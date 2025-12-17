import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MessageSquare, Clock, Share2, ArrowLeft, Loader2, Briefcase } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getTaskDetails, voteOnTask, commentOnTask, type Task } from '../lib/hive';

export function TaskDetailsPage() {
    const { username, permlink } = useParams<{ username: string; permlink: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [task, setTask] = useState<Task | null>(null);
    const [comments, setComments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    // const [voting, setVoting] = useState(false); // Removed as main task voting is gone
    const [commenting, setCommenting] = useState(false);
    const [newComment, setNewComment] = useState('');

    // Track which submission is being voted on
    const [votingSubmissionId, setVotingSubmissionId] = useState<string | null>(null);

    useEffect(() => {
        if (username && permlink) {
            loadData();
        }
    }, [username, permlink]);

    const loadData = async () => {
        setLoading(true);
        if (username && permlink) {
            const data = await getTaskDetails(username, permlink);
            if (data) {
                setTask(data.task);
                setComments(data.comments);
            }
        }
        setLoading(false);
    };

    const handleSubmissionVote = async (submission: any, weight: number) => {
        if (!user) {
            alert('Please login to vote');
            return;
        }

        setVotingSubmissionId(submission.id);

        const result = await voteOnTask(user.name, submission.author, submission.permlink, weight);

        setVotingSubmissionId(null);

        if (result.success) {
            alert(weight > 0 ? 'Submission Approved!' : 'Submission Rejected!');
            loadData();
        } else {
            alert('Vote failed: ' + result.msg);
        }
    };

    // Helper to calculate total value
    const getVoteValue = (submission: any) => {
        if (!submission.active_votes) return 0;
        return submission.active_votes.length;
    };

    const handleComment = async () => {
        if (!user || !task || !newComment.trim()) return;
        setCommenting(true);
        const result = await commentOnTask(user.name, task.requester, task.permlink!, newComment);
        setCommenting(false);
        if (result.success) {
            alert('Comment posted! It will appear after propagation.');
            setNewComment('');
        } else {
            alert('Comment failed: ' + result.msg);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-red-500" />
            </div>
        );
    }

    if (!task) {
        return (
            <div className="min-h-screen flex items-center justify-center flex-col">
                <h2 className="text-2xl font-bold mb-4">Task Not Found</h2>
                <button onClick={() => navigate('/browse')} className="text-red-400 hover:text-red-300">Back to Browse</button>
            </div>
        );
    }

    // Separate comments into submissions and discussions
    const submissions = comments.filter(c => {
        let meta = {};
        try { meta = JSON.parse(c.json_metadata); } catch (e) { }
        return (meta as any).type === 'submission' || c.body.startsWith('## Work Submission');
    });

    const discussions = comments.filter(c => {
        let meta = {};
        try { meta = JSON.parse(c.json_metadata); } catch (e) { }
        return (meta as any).type !== 'submission' && !c.body.startsWith('## Work Submission');
    });

    return (
        <div className="min-h-screen py-8 px-6">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => navigate('/browse')}
                    className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Browse
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden p-8">
                            <h1 className="text-3xl font-bold mb-4">{task.title}</h1>
                            <div className="flex items-center gap-4 text-sm text-gray-400 mb-6">
                                <div className="flex items-center gap-1">
                                    <img
                                        src={`https://images.hive.blog/u/${task.requester}/avatar`}
                                        className="w-5 h-5 rounded-full"
                                        alt={task.requester}
                                    />
                                    <span>@{task.requester}</span>
                                </div>
                                <span>•</span>
                                <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    <span>{new Date(task.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>

                            {/* Task Description / Instructions */}
                            <div className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-gray-300 prose-a:text-red-400">
                                <div className="whitespace-pre-wrap">{task.description}</div>
                                {task.instructions && (
                                    <>
                                        <h2 className="text-xl font-bold mt-8 mb-4 border-t border-white/10 pt-8">Instructions</h2>
                                        <div className="whitespace-pre-wrap">{task.instructions}</div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Submissions Section */}
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden p-8">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-green-400">
                                <Briefcase className="w-5 h-5" />
                                Work Submissions ({submissions.length})
                            </h3>

                            <div className="space-y-4">
                                {submissions.map((sub: any) => (
                                    <div key={sub.id} className="bg-white/5 rounded-xl p-4 border border-white/5">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <img
                                                    src={`https://images.hive.blog/u/${sub.author}/avatar`}
                                                    className="w-6 h-6 rounded-full"
                                                    alt={sub.author}
                                                />
                                                <span className="font-bold text-sm">@{sub.author}</span>
                                                <span className="text-xs text-gray-500">{new Date(sub.created).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="text-xs text-gray-400">{getVoteValue(sub)} votes</div>
                                                <span className="bg-yellow-500/10 text-yellow-400 text-xs px-2 py-1 rounded">Pending Review</span>
                                            </div>
                                        </div>
                                        <div className="text-gray-300 text-sm whitespace-pre-wrap pl-8 border-l-2 border-white/10 mb-4">
                                            {sub.body.replace('## Work Submission', '').trim()}
                                        </div>

                                        {/* Peer Review Buttons */}
                                        <div className="flex justify-end gap-2 pl-8">
                                            <button
                                                onClick={() => handleSubmissionVote(sub, 10000)}
                                                disabled={votingSubmissionId === sub.id}
                                                className="flex items-center gap-1 bg-green-500/10 hover:bg-green-500/20 text-green-400 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
                                            >
                                                {votingSubmissionId === sub.id ? <Loader2 className="w-3 h-3 animate-spin" /> : '👍 Approve'}
                                            </button>
                                            <button
                                                onClick={() => handleSubmissionVote(sub, -10000)}
                                                disabled={votingSubmissionId === sub.id}
                                                className="flex items-center gap-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
                                            >
                                                {votingSubmissionId === sub.id ? <Loader2 className="w-3 h-3 animate-spin" /> : '👎 Reject'}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {submissions.length === 0 && (
                                    <div className="text-center py-8 border border-dashed border-white/10 rounded-xl">
                                        <p className="text-gray-500">No submissions yet.</p>
                                        <p className="text-sm text-gray-600 mt-1">Be the first to submit work!</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Comments Section */}
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden p-8">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <MessageSquare className="w-5 h-5" />
                                Discussion ({discussions.length})
                            </h3>

                            {user ? (
                                <div className="mb-8 flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center shrink-0">
                                        <span className="font-bold">{user.name[0].toUpperCase()}</span>
                                    </div>
                                    <div className="flex-1">
                                        <textarea
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            placeholder="Ask a question or discuss this task..."
                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 min-h-[100px] focus:outline-none focus:border-red-500/50 transition-colors mb-2"
                                        />
                                        <button
                                            onClick={handleComment}
                                            disabled={commenting || !newComment.trim()}
                                            className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-2 rounded-lg font-semibold text-sm float-right transition-colors"
                                        >
                                            {commenting ? 'Posting...' : 'Post Comment'}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white/5 rounded-xl p-4 text-center mb-8">
                                    <p className="text-gray-400">Please login to join the discussion.</p>
                                </div>
                            )}

                            <div className="space-y-6">
                                {discussions.map((comment: any) => (
                                    <div key={comment.id} className="flex gap-4">
                                        <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center shrink-0 overflow-hidden">
                                            <img src={`https://images.hive.blog/u/${comment.author}/avatar`} alt={comment.author} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-bold text-sm">@{comment.author}</span>
                                                <span className="text-xs text-gray-500">{new Date(comment.created).toLocaleDateString()}</span>
                                            </div>
                                            <div className="text-gray-300 text-sm whitespace-pre-wrap">{comment.body}</div>
                                        </div>
                                    </div>
                                ))}
                                {discussions.length === 0 && (
                                    <p className="text-gray-500 text-center py-4">No comments yet. Be the first!</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                            <h3 className="text-lg font-semibold mb-4">Task Details</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center py-2 border-b border-white/5">
                                    <span className="text-gray-400">Reward</span>
                                    <span className="text-yellow-400 font-bold">{task.reward}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-white/5">
                                    <span className="text-gray-400">Category</span>
                                    <span className="text-purple-400">{task.category}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-white/5">
                                    <span className="text-gray-400">Deadline</span>
                                    <span>{task.deadline || 'No deadline'}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-white/5">
                                    <span className="text-gray-400">Reputation</span>
                                    <span className="capitalize">{task.requiredReputation || 'None'}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate(`/work/${task.requester}/${task.permlink}`)}
                                className="w-full mt-6 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white py-3 rounded-xl font-bold shadow-lg shadow-red-500/20 transition-all"
                            >
                                Start Working
                            </button>
                        </div>

                        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                            <h3 className="text-lg font-semibold mb-4">Actions</h3>
                            <button className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white py-3 rounded-xl font-semibold transition-all">
                                <Share2 className="w-5 h-5 text-blue-400" />
                                Share Task
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
