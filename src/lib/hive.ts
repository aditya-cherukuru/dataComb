import { Client } from '@hiveio/dhive';
import {
    HIVE_NODES,
    APP_IDENTIFIER,
    HIVE_TAG,
    HIVE_PARENT_PERMLINK,
    DEFAULT_TASK_IMAGE,
    ERROR_MESSAGES,
    SUCCESS_MESSAGES
} from './constants';

// Initialize Hive client with public nodes
const client = new Client(HIVE_NODES);

// Hive Keychain types
declare global {
    interface Window {
        hive_keychain?: {
            requestSignBuffer: (username: string, message: string, method: string, callback: (response: { success: boolean; error?: string; result?: string }) => void) => void;
            requestBroadcast: (username: string, operations: any[], method: string, callback: (response: { success: boolean; error?: string; message?: string; result?: any }) => void) => void;
            requestVote: (username: string, permlink: string, author: string, weight: number, callback: (response: { success: boolean; message?: string; error?: string }) => void) => void;
            requestPost: (username: string, title: string, body: string, parentPermlink: string, parentAuthor: string, jsonMetadata: string, permlink: string, options: string, callback: (response: { success: boolean; message?: string; error?: string }) => void) => void;
        };
    }
}

export interface UserProfile {
    name: string;
    reputation: number;
    metadata: {
        profile?: {
            name?: string;
            about?: string;
            profile_image?: string;
            cover_image?: string;
        };
    };
    balance: string;
    hbd_balance: string;
    post_count: number;
}

export interface Task {
    id: string;
    title: string;
    description: string;
    instructions?: string;
    reward: string;
    image: string;
    requester: string;
    status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED';
    category: string;
    dataType?: string;
    deadline?: string | null;
    maxSubmissions?: number;
    requiredReputation?: string;
    created_at: number;
    submissions?: TaskSubmission[];
    permlink?: string;
}

export interface TaskSubmission {
    worker: string;
    data: any;
    timestamp: number;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

// Format reputation score
export function formatReputation(rawRep: number): number {
    if (rawRep === 0) return 25;
    const neg = rawRep < 0;
    let rep = Math.log10(Math.abs(rawRep));
    rep = Math.max(rep - 9, 0);
    rep *= neg ? -9 : 9;
    rep += 25;
    return Math.floor(rep);
}

// Login with Hive Keychain
export async function loginWithKeychain(username: string): Promise<{ success: boolean; msg: string }> {
    return new Promise((resolve) => {
        if (!window.hive_keychain) {
            resolve({ success: false, msg: ERROR_MESSAGES.KEYCHAIN_NOT_FOUND });
            return;
        }

        const message = `Login to DataComb - ${Date.now()}`;

        window.hive_keychain.requestSignBuffer(
            username,
            message,
            'Posting',
            (response) => {
                if (response.success) {
                    resolve({ success: true, msg: SUCCESS_MESSAGES.LOGIN_SUCCESS });
                } else {
                    resolve({ success: false, msg: response.error || ERROR_MESSAGES.LOGIN_FAILED });
                }
            }
        );
    });
}

// Fetch user profile
export async function fetchProfile(username: string): Promise<UserProfile> {
    const [account] = await client.database.getAccounts([username]);

    if (!account) {
        throw new Error('Account not found');
    }

    let metadata = {};
    try {
        metadata = JSON.parse(account.posting_json_metadata || '{}');
    } catch (e) {
        console.error('Failed to parse metadata:', e);
    }

    return {
        name: account.name,
        reputation: formatReputation(Number(account.reputation)),
        metadata,
        balance: account.balance as string,
        hbd_balance: account.hbd_balance as string,
        post_count: account.post_count,
    };
}

// Broadcast a new task to Hive as a blog post with datacomb33 tag
export async function broadcastTask(
    username: string,
    task: Omit<Task, 'id' | 'requester' | 'status' | 'created_at' | 'permlink'>
): Promise<{ success: boolean; msg: string }> {
    return new Promise((resolve) => {
        if (!window.hive_keychain) {
            resolve({ success: false, msg: 'Hive Keychain not found' });
            return;
        }

        const permlink = `datacomb-task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        const taskData: Task = {
            ...task,
            id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            requester: username,
            status: 'OPEN',
            created_at: Date.now(),
            permlink,
        };

        // Create markdown body with task data embedded as JSON
        const body = `# ${task.title}

${task.description}

## Instructions

${task.instructions || 'No specific instructions provided.'}

---

**Category:** ${task.category}  
**Data Type:** ${task.dataType || 'Mixed'}  
**Reward:** ${task.reward}  
**Max Submissions:** ${task.maxSubmissions || 100}  
**Required Reputation:** ${task.requiredReputation || 'bronze'}  
${task.deadline ? `**Deadline:** ${task.deadline}` : ''}

---

*This is a DataComb task. Complete it on [DataComb](https://datacomb.app) to earn rewards.*

<!-- DATACOMB_TASK_DATA:${JSON.stringify(taskData)}:DATACOMB_TASK_DATA -->
`;

        // Post metadata with datacomb33 as the first tag
        const jsonMetadata = JSON.stringify({
            tags: [HIVE_TAG, 'datacomb', 'hive', 'ai', task.category.toLowerCase().replace(/\s+/g, '-')],
            app: APP_IDENTIFIER,
            format: 'markdown',
            task: taskData,
        });

        const commentOp = [
            'comment',
            {
                parent_author: '',
                parent_permlink: HIVE_PARENT_PERMLINK,
                author: username,
                permlink: permlink,
                title: `[DataComb Task] ${task.title}`,
                body: body,
                json_metadata: jsonMetadata,
            }
        ];

        window.hive_keychain.requestBroadcast(
            username,
            [commentOp],
            'Posting',
            (response) => {
                if (response.success) {
                    resolve({ success: true, msg: SUCCESS_MESSAGES.TASK_CREATED });
                } else {
                    resolve({ success: false, msg: response.error || ERROR_MESSAGES.TASK_CREATION_FAILED });
                }
            }
        );
    });
}

// Fetch tasks from account history
export async function fetchAccountTasks(username: string): Promise<Task[]> {
    try {
        const history = await client.database.getAccountHistory(username, -1, 100);
        const tasks: Task[] = [];

        for (const [, op] of history) {
            const operation = op as any;
            if (operation[0] === 'custom_json' && operation[1].id === 'datacomb_task_v1') {
                try {
                    const task = JSON.parse(operation[1].json);
                    tasks.push(task);
                } catch (e) {
                    console.error('Failed to parse task:', e);
                }
            }
        }

        return tasks.reverse(); // Most recent first
    } catch (error) {
        console.error('Failed to fetch tasks:', error);
        return [];
    }
}

// Fetch all tasks from the platform by tag
export async function fetchTasksByTag(tag: string = 'datacomb33'): Promise<Task[]> {
    try {
        // Use direct RPC call to avoid wrapper issues
        console.log(`Fetching tasks via condenser_api.get_discussions_by_created for tag: ${tag}`);
        const discussions = await client.call('condenser_api', 'get_discussions_by_created', [{
            tag: tag,
            limit: 20,
        }]);

        if (!discussions || discussions.length === 0) {
            console.log(`No discussions found for tag: ${tag}`);
            return [];
        } else {
            console.log(`Found ${discussions.length} discussions for tag: ${tag}`);
        }

        const tasks: Task[] = [];

        for (const post of discussions) {
            try {
                // Try to parse task data from json_metadata
                let metadata: any = {};
                try {
                    metadata = JSON.parse(post.json_metadata || '{}');
                } catch (e) {
                    console.warn(`Failed to parse metadata for post ${post.permlink}`);
                }

                if (metadata.task) {
                    console.log(`Found task in metadata: ${post.title}`);
                    tasks.push(metadata.task);
                } else {
                    // Fallback: try to extract from body
                    const match = post.body.match(/<!-- DATACOMB_TASK_DATA:(.*?):DATACOMB_TASK_DATA -->/);
                    if (match) {
                        try {
                            const taskData = JSON.parse(match[1]);
                            console.log(`Found task in body comment: ${post.title}`);
                            tasks.push(taskData);
                        } catch (e) {
                            console.warn(`Failed to parse task data from body for ${post.permlink}`);
                        }
                    } else {
                        // Create task from post data
                        console.log(`Constructing task from raw post: ${post.title}`);
                        tasks.push({
                            id: post.permlink,
                            title: post.title.replace('[DataComb Task] ', ''),
                            description: post.body.substring(0, 200) + '...',
                            reward: '0 HIVE',
                            image: metadata.image?.[0] || DEFAULT_TASK_IMAGE,
                            requester: post.author,
                            status: 'OPEN',
                            category: metadata.tags?.[4] || 'Other',
                            created_at: new Date(post.created + (post.created.endsWith('Z') ? '' : 'Z')).getTime(),
                            permlink: post.permlink,
                        });
                    }
                }
            } catch (e) {
                console.error('Failed to parse task from post:', e);
            }
        }

        console.log(`Parsed ${tasks.length} valid tasks`);
        return tasks;
    } catch (error) {
        console.error('Failed to fetch tasks by tag:', error);
        throw error;
    }
}

// Legacy function - now uses fetchTasksByTag
export async function fetchAllTasks(): Promise<Task[]> {
    return fetchTasksByTag('datacomb33');
}

// Submit work for a task (as a comment/reply)
export async function submitTaskWork(
    username: string,
    taskAuthor: string,
    taskPermlink: string,
    workResponse: string
): Promise<{ success: boolean; msg: string }> {
    return new Promise((resolve) => {
        if (!window.hive_keychain) {
            resolve({ success: false, msg: ERROR_MESSAGES.KEYCHAIN_NOT_FOUND });
            return;
        }

        const permlink = `re-${taskPermlink.substring(0, 50)}-${Date.now()}`;

        const jsonMetadata = JSON.stringify({
            app: APP_IDENTIFIER,
            type: 'submission',
            format: 'markdown'
        });

        const body = `## Work Submission
        
${workResponse}

---
*Submitted via [DataComb](https://datacomb.app)*`;

        window.hive_keychain.requestPost(
            username,
            '', // Title should be empty for comments/replies
            body,
            taskPermlink,
            taskAuthor,
            jsonMetadata,
            permlink,
            '', // No comment options for now to avoid errors
            (response) => {
                if (response.success) {
                    resolve({ success: true, msg: SUCCESS_MESSAGES.WORK_SUBMITTED });
                } else {
                    resolve({ success: false, msg: response.error || ERROR_MESSAGES.WORK_SUBMISSION_FAILED });
                }
            }
        );
    });
}


// Fetch a single task details including comments
export async function getTaskDetails(author: string, permlink: string): Promise<{ task: Task, comments: any[] } | null> {
    try {
        const post = await client.call('condenser_api', 'get_content', [author, permlink]);
        const comments = await client.call('condenser_api', 'get_content_replies', [author, permlink]);

        if (!post || post.author === '') return null;

        // Parse task data similar to fetchTasksByTag
        let taskData: Task | null = null;
        try {
            const metadata = JSON.parse(post.json_metadata || '{}');
            if (metadata.task) {
                taskData = metadata.task;
            } else {
                const match = post.body.match(/<!-- DATACOMB_TASK_DATA:(.*?):DATACOMB_TASK_DATA -->/);
                if (match) {
                    taskData = JSON.parse(match[1]);
                }
            }
        } catch (e) {
            console.error('Error parsing task data:', e);
        }

        if (!taskData) {
            taskData = {
                id: post.permlink,
                title: post.title.replace('[DataComb Task] ', ''),
                description: post.body, // content is full body here
                reward: '0 HIVE',
                image: '', // Will be handled by UI fallback
                requester: post.author,
                status: 'OPEN',
                category: 'Unknown',
                created_at: new Date(post.created + (post.created.endsWith('Z') ? '' : 'Z')).getTime(),
                permlink: post.permlink,
            };
        }

        return { task: taskData, comments };
    } catch (error) {
        console.error('Failed to fetch task details:', error);
        return null;
    }
}

export async function voteOnTask(voter: string, author: string, permlink: string, weight: number): Promise<{ success: boolean; msg: string }> {
    return new Promise((resolve) => {
        if (!window.hive_keychain) {
            resolve({ success: false, msg: ERROR_MESSAGES.KEYCHAIN_NOT_FOUND });
            return;
        }

        window.hive_keychain.requestVote(
            voter,
            permlink,
            author,
            weight,
            (response: any) => {
                if (response.success) {
                    resolve({ success: true, msg: SUCCESS_MESSAGES.VOTE_SUCCESS });
                } else {
                    resolve({ success: false, msg: response.message });
                }
            }
        );
    });
}

export async function commentOnTask(
    author: string,
    parentAuthor: string,
    parentPermlink: string,
    body: string
): Promise<{ success: boolean; msg: string }> {
    return new Promise((resolve) => {
        if (!window.hive_keychain) {
            resolve({ success: false, msg: ERROR_MESSAGES.KEYCHAIN_NOT_FOUND });
            return;
        }

        const permlink = `re-${parentAuthor}-${parentPermlink.substring(0, 20)}-${Date.now()}`; // Standard reply permlink format

        window.hive_keychain.requestPost(
            author,
            '', // Title is empty for comments
            body,
            parentPermlink,
            parentAuthor,
            JSON.stringify({ app: APP_IDENTIFIER, format: 'markdown' }),
            permlink,
            JSON.stringify({}), // Options
            (response: any) => {
                if (response.success) {
                    resolve({ success: true, msg: SUCCESS_MESSAGES.COMMENT_POSTED });
                } else {
                    resolve({ success: false, msg: response.message });
                }
            }
        );
    });
}

export { client };
