import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { broadcastTask } from '../lib/hive';
import {
    ArrowLeft,
    Loader2,
    Image as ImageIcon,
    FileText,
    Calendar,
    Users,
    Award,
    Sparkles,
    Send
} from 'lucide-react';

const CATEGORIES = [
    'Image Labeling',
    'Text Classification',
    'Audio Processing',
    'Data Entry',
    'Sentiment Analysis',
    'Object Detection',
    'Translation',
    'Content Moderation',
    'Video Annotation',
    'Other'
];

const DATA_TYPES = [
    'Image',
    'Text',
    'Audio',
    'Video',
    'Mixed'
];

const REPUTATION_LEVELS = [
    { value: 'bronze', label: 'Bronze (< 40 rep)', minRep: 0 },
    { value: 'silver', label: 'Silver (40-60 rep)', minRep: 40 },
    { value: 'gold', label: 'Gold (60+ rep)', minRep: 60 }
];

export function CreateTaskPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [creating, setCreating] = useState(false);

    // Form state
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [instructions, setInstructions] = useState('');
    const [reward, setReward] = useState('5');
    const [category, setCategory] = useState('Image Labeling');
    const [dataType, setDataType] = useState('Image');
    const [imageUrl, setImageUrl] = useState('');
    const [deadline, setDeadline] = useState('');
    const [maxSubmissions, setMaxSubmissions] = useState('100');
    const [requiredReputation, setRequiredReputation] = useState('bronze');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setCreating(true);
        try {
            const result = await broadcastTask(user.name, {
                title,
                description,
                instructions,
                reward: `${reward} HIVE`,
                image: imageUrl || `https://source.unsplash.com/800x600/?${category.toLowerCase().replace(' ', ',')}`,
                category,
                dataType,
                deadline: deadline || null,
                maxSubmissions: parseInt(maxSubmissions) || 100,
                requiredReputation,
            });

            if (result.success) {
                // Show success message and redirect
                // Acknowledge blockchain propagation delay
                alert('Task created successfully! It may take 1-2 minutes to appear in the Browse feed due to blockchain propagation.');
                navigate('/dashboard');
            } else {
                alert(result.msg);
            }
        } catch (error) {
            alert('Failed to create task');
        } finally {
            setCreating(false);
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Please login to create tasks</h2>
                    <p className="text-gray-400">Connect your Hive Keychain to continue</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8 px-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to Dashboard
                    </button>

                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center">
                            <Sparkles className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">Create New Task</h1>
                            <p className="text-gray-400">Define your data labeling task for the DataComb marketplace</p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Information */}
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-purple-400" />
                            Basic Information
                        </h2>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">
                                    Task Title *
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g., Label 100 product images for e-commerce"
                                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-red-500 transition-colors"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">
                                    Short Description *
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Briefly describe what this task is about and what workers will accomplish..."
                                    rows={3}
                                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-red-500 resize-none transition-colors"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">
                                    Detailed Instructions *
                                </label>
                                <textarea
                                    value={instructions}
                                    onChange={(e) => setInstructions(e.target.value)}
                                    placeholder="Provide step-by-step instructions for workers. Be specific about:
• What exactly needs to be labeled/classified
• Quality requirements and acceptance criteria
• Any edge cases or special considerations
• Examples of correct and incorrect submissions"
                                    rows={6}
                                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-red-500 resize-none transition-colors"
                                    required
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                                        Category
                                    </label>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                                    >
                                        {CATEGORIES.map(cat => (
                                            <option key={cat} value={cat} className="bg-gray-900">{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                                        Data Type
                                    </label>
                                    <select
                                        value={dataType}
                                        onChange={(e) => setDataType(e.target.value)}
                                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                                    >
                                        {DATA_TYPES.map(type => (
                                            <option key={type} value={type} className="bg-gray-900">{type}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Task Image */}
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <ImageIcon className="w-5 h-5 text-blue-400" />
                            Task Image
                        </h2>

                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2">
                                Cover Image URL (optional)
                            </label>
                            <input
                                type="url"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                placeholder="https://example.com/image.jpg"
                                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-red-500 transition-colors"
                            />
                            <p className="text-xs text-gray-500 mt-2">
                                Leave empty to auto-generate a relevant image based on your category
                            </p>

                            {imageUrl && (
                                <div className="mt-4">
                                    <img
                                        src={imageUrl}
                                        alt="Preview"
                                        className="w-full max-w-md h-48 object-cover rounded-lg border border-white/20"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = 'none';
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Reward & Requirements */}
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Award className="w-5 h-5 text-yellow-400" />
                            Reward & Requirements
                        </h2>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">
                                    Reward per Submission (HIVE) *
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={reward}
                                        onChange={(e) => setReward(e.target.value)}
                                        min="0.1"
                                        step="0.1"
                                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                                        required
                                    />
                                    <span className="absolute right-4 top-3 text-yellow-400 font-semibold">HIVE</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">
                                    Required Reputation Level
                                </label>
                                <select
                                    value={requiredReputation}
                                    onChange={(e) => setRequiredReputation(e.target.value)}
                                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                                >
                                    {REPUTATION_LEVELS.map(level => (
                                        <option key={level.value} value={level.value} className="bg-gray-900">
                                            {level.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">
                                    <Users className="w-4 h-4 inline mr-1" />
                                    Max Submissions
                                </label>
                                <input
                                    type="number"
                                    value={maxSubmissions}
                                    onChange={(e) => setMaxSubmissions(e.target.value)}
                                    min="1"
                                    placeholder="100"
                                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-red-500 transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">
                                    <Calendar className="w-4 h-4 inline mr-1" />
                                    Deadline (optional)
                                </label>
                                <input
                                    type="date"
                                    value={deadline}
                                    onChange={(e) => setDeadline(e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Summary Card */}
                    <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-md border border-purple-500/30 rounded-2xl p-6">
                        <h3 className="font-bold mb-4">Task Summary</h3>
                        <div className="grid md:grid-cols-3 gap-4 text-sm">
                            <div>
                                <span className="text-gray-400">Category:</span>
                                <span className="ml-2 text-white">{category}</span>
                            </div>
                            <div>
                                <span className="text-gray-400">Data Type:</span>
                                <span className="ml-2 text-white">{dataType}</span>
                            </div>
                            <div>
                                <span className="text-gray-400">Reward:</span>
                                <span className="ml-2 text-yellow-400 font-semibold">{reward} HIVE</span>
                            </div>
                            <div>
                                <span className="text-gray-400">Max Workers:</span>
                                <span className="ml-2 text-white">{maxSubmissions}</span>
                            </div>
                            <div>
                                <span className="text-gray-400">Min Rep:</span>
                                <span className="ml-2 text-white capitalize">{requiredReputation}</span>
                            </div>
                            <div>
                                <span className="text-gray-400">Total Budget:</span>
                                <span className="ml-2 text-green-400 font-semibold">
                                    {(parseFloat(reward) * parseInt(maxSubmissions || '100')).toFixed(2)} HIVE
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => navigate('/dashboard')}
                            className="flex-1 bg-white/10 hover:bg-white/20 text-white px-6 py-4 rounded-xl font-semibold transition-colors"
                            disabled={creating}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={creating || !title || !description || !instructions}
                            className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-6 py-4 rounded-xl font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-red-500/30"
                        >
                            {creating ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Creating Task...
                                </>
                            ) : (
                                <>
                                    <Send className="w-5 h-5" />
                                    Publish Task to Hive
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
