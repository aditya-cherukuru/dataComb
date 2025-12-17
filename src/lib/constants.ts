/**
 * DataComb - Centralized Constants
 * All application-wide constants and configuration values
 */

// App Metadata
export const APP_NAME = 'DataComb';
export const APP_VERSION = '1.0.0';
export const APP_DESCRIPTION = 'Decentralized AI Data Marketplace on Hive Blockchain';
export const APP_IDENTIFIER = 'datacomb/1.0';

// Hive Configuration
export const HIVE_TAG = 'datacomb33';
export const HIVE_PARENT_PERMLINK = 'datacomb33';
export const HIVE_NODES = [
    'https://api.hive.blog',
    'https://api.deathwing.me',
    'https://hive-api.arcange.eu',
];

// Default Images
export const DEFAULT_TASK_IMAGE = 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop';
export const DEFAULT_AVATAR_BASE = 'https://api.dicebear.com/7.x/avataaars/svg?seed=';
export const FALLBACK_TASK_IMAGE = 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&h=600&fit=crop';

// Task Categories
export const TASK_CATEGORIES = [
    { value: 'Image Labeling', label: 'Image Labeling', icon: '🖼️' },
    { value: 'Text Classification', label: 'Text Classification', icon: '📝' },
    { value: 'Audio Transcription', label: 'Audio Transcription', icon: '🎵' },
    { value: 'Data Validation', label: 'Data Validation', icon: '✅' },
    { value: 'Sentiment Analysis', label: 'Sentiment Analysis', icon: '😊' },
    { value: 'Object Detection', label: 'Object Detection', icon: '🎯' },
    { value: 'Other', label: 'Other', icon: '📦' },
];

// Data Types
export const DATA_TYPES = [
    { value: 'Images', label: 'Images' },
    { value: 'Text', label: 'Text' },
    { value: 'Audio', label: 'Audio' },
    { value: 'Video', label: 'Video' },
    { value: 'Mixed', label: 'Mixed' },
];

// Reputation Tiers
export const REPUTATION_TIERS = {
    BRONZE: { min: 25, max: 39, label: 'Bronze', color: '#CD7F32' },
    SILVER: { min: 40, max: 59, label: 'Silver', color: '#C0C0C0' },
    GOLD: { min: 60, max: 74, label: 'Gold', color: '#FFD700' },
    PLATINUM: { min: 75, max: 100, label: 'Platinum', color: '#E5E4E2' },
};

// Minimum reputation required for different actions
export const MIN_REPUTATION = {
    CREATE_TASK: 40, // Silver tier
    SUBMIT_WORK: 25, // Bronze tier
    VALIDATE_WORK: 60, // Gold tier
};

// Default Form Values
export const DEFAULT_MAX_SUBMISSIONS = 100;
export const DEFAULT_REWARD = '10.000 HIVE';
export const DEFAULT_REQUIRED_REPUTATION = 'bronze';

// VSC Bridge Configuration
export const SUPPORTED_CHAINS = [
    {
        id: 'ethereum',
        name: 'Ethereum',
        symbol: 'ETH',
        icon: '⟠',
        color: '#627EEA'
    },
    {
        id: 'bitcoin',
        name: 'Bitcoin',
        symbol: 'BTC',
        icon: '₿',
        color: '#F7931A'
    },
    {
        id: 'solana',
        name: 'Solana',
        symbol: 'SOL',
        icon: '◎',
        color: '#14F195'
    },
];

// UI Constants
export const ITEMS_PER_PAGE = 20;
export const MAX_TITLE_LENGTH = 100;
export const MAX_DESCRIPTION_LENGTH = 500;
export const MAX_INSTRUCTIONS_LENGTH = 2000;

// Error Messages
export const ERROR_MESSAGES = {
    KEYCHAIN_NOT_FOUND: 'Hive Keychain not found. Please install the browser extension.',
    LOGIN_FAILED: 'Login failed. Please try again.',
    TASK_CREATION_FAILED: 'Failed to create task. Please check your inputs and try again.',
    WORK_SUBMISSION_FAILED: 'Failed to submit work. Please try again.',
    INSUFFICIENT_REPUTATION: 'Your reputation is too low for this action.',
    NETWORK_ERROR: 'Network error. Please check your connection and try again.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
    LOGIN_SUCCESS: 'Login successful!',
    TASK_CREATED: 'Task created successfully!',
    WORK_SUBMITTED: 'Work submitted successfully!',
    COMMENT_POSTED: 'Comment posted successfully!',
    VOTE_SUCCESS: 'Vote recorded successfully!',
};

// External Links
export const EXTERNAL_LINKS = {
    HIVE_WEBSITE: 'https://hive.io/',
    HIVE_DOCS: 'https://developers.hive.io/',
    VSC_WEBSITE: 'https://vsc.eco/',
    MAGI_WEBSITE: 'https://magi.network',
    MAGI_DOCS: 'https://docs.magi.eco/',
    GITHUB: 'https://github.com/yourusername/datacomb',
    DISCORD: 'https://discord.gg/fju3QDsyxJ',
};
