import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { submitTaskWork, getTaskDetails, type Task } from '../lib/hive';
import { FALLBACK_TASK_IMAGE } from '../lib/constants';
import { Briefcase, DollarSign, Award, TrendingUp, Loader2, Send } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';

export function WorkPage() {
    const { user } = useAuth();
    const { username, permlink } = useParams<{ username: string; permlink: string }>();
    const navigate = useNavigate();

    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [workData, setWorkData] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [loadingTask, setLoadingTask] = useState(false);

    useEffect(() => {
        if (username && permlink) {
            loadTaskFromUrl();
        }
    }, [username, permlink]);

    const loadTaskFromUrl = async () => {
        if (!username || !permlink) return;
        setLoadingTask(true);
        try {
            const data = await getTaskDetails(username, permlink);
            if (data && data.task) {
                setSelectedTask(data.task);
            }
        } catch (error) {
            console.error("Failed to load task:", error);
        } finally {
            setLoadingTask(false);
        }
    };

    const handleSubmitWork = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !selectedTask) return;

        setSubmitting(true);
        try {
            // Submit work as a comment
            const result = await submitTaskWork(
                user.name,
                selectedTask.requester,
                selectedTask.permlink!,
                workData
            );

            if (result.success) {
                alert('Work submitted successfully!');
                setSelectedTask(null);
                setWorkData('');
                // If we were on a specific task page, maybe go back to browse or dashboard?
                if (username && permlink) {
                    navigate('/browse');
                }
            } else {
                alert(`Failed to submit work: ${result.msg}`);
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            console.error('Submit work error:', error);
            alert(`Failed to submit work: ${errorMessage}`);
        } finally {
            setSubmitting(false);
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Please login to access work</h2>
                    <p className="text-gray-400">Connect your Hive Keychain to continue</p>
                </div>
            </div>
        );
    }

    const availableTasks = [
        {
            id: '1',
            title: 'Label Fashion Items',
            description: 'Identify clothing items and accessories in images',
            reward: '5 HIVE',
            image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600',
            requester: 'fashion-ai',
            difficulty: 'Easy',
        },
        {
            id: '2',
            title: 'Classify Product Reviews',
            description: 'Rate customer reviews as positive, negative, or neutral',
            reward: '8 HIVE',
            image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600',
            requester: 'sentiment-bot',
            difficulty: 'Medium',
        },
        {
            id: '3',
            title: 'Transcribe Podcast Clips',
            description: 'Convert short audio clips to accurate text transcriptions',
            reward: '12 HIVE',
            image: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=600',
            requester: 'audio-labs',
            difficulty: 'Hard',
        },
    ];

    return (
        <div className="min-h-screen py-8 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">Worker Dashboard</h1>
                    <p className="text-gray-400">Complete tasks and earn HIVE</p>
                </div>

                {/* Stats */}
                <div className="grid md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-2">
                            <Briefcase className="w-8 h-8 text-purple-400" />
                            <span className="text-2xl font-bold">28</span>
                        </div>
                        <p className="text-gray-300 text-sm font-semibold">Tasks Completed</p>
                    </div>

                    <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-2">
                            <DollarSign className="w-8 h-8 text-green-400" />
                            <span className="text-2xl font-bold text-yellow-400">145</span>
                        </div>
                        <p className="text-gray-300 text-sm font-semibold">HIVE Earned</p>
                    </div>

                    <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-2">
                            <Award className="w-8 h-8 text-blue-400" />
                            <span className="text-2xl font-bold">{user.reputation}</span>
                        </div>
                        <p className="text-gray-300 text-sm font-semibold">Reputation Score</p>
                    </div>

                    <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-2">
                            <TrendingUp className="w-8 h-8 text-orange-400" />
                            <span className="text-2xl font-bold">98%</span>
                        </div>
                        <p className="text-gray-300 text-sm font-semibold">Approval Rate</p>
                    </div>
                </div>

                {/* Available Tasks */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-6">Available Tasks</h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {availableTasks.map((task: any) => (
                            <div
                                key={task.id}
                                className="group bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 hover:border-red-500/50 transition-all cursor-pointer"
                                onClick={() => setSelectedTask(task as Task)}
                            >
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={task.image}
                                        alt={task.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                    <div className="absolute top-4 right-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm ${task.difficulty === 'Easy'
                                            ? 'bg-green-500/90 text-white'
                                            : task.difficulty === 'Medium'
                                                ? 'bg-yellow-500/90 text-white'
                                                : 'bg-red-500/90 text-white'
                                            }`}>
                                            {task.difficulty}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="text-lg font-bold group-hover:text-red-400 transition-colors flex-1">
                                            {task.title}
                                        </h3>
                                        <div className="text-yellow-400 font-bold text-sm whitespace-nowrap ml-2">
                                            {task.reward}
                                        </div>
                                    </div>

                                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                                        {task.description}
                                    </p>

                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-500">by @{task.requester}</span>
                                        <button className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-4 py-2 rounded-lg font-semibold text-xs transition-all">
                                            Start Task
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Submissions */}
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                    <h2 className="text-2xl font-bold mb-6">Recent Submissions</h2>

                    <div className="space-y-3">
                        {[
                            { task: 'Label Product Images', status: 'Approved', reward: '5 HIVE', date: '2 hours ago' },
                            { task: 'Classify Reviews', status: 'Pending', reward: '8 HIVE', date: '5 hours ago' },
                            { task: 'Audio Transcription', status: 'Approved', reward: '12 HIVE', date: '1 day ago' },
                        ].map((submission, i) => (
                            <div
                                key={i}
                                className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all"
                            >
                                <div>
                                    <h3 className="font-semibold mb-1">{submission.task}</h3>
                                    <p className="text-sm text-gray-400">{submission.date}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-yellow-400 font-bold">{submission.reward}</span>
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-bold ${submission.status === 'Approved'
                                            ? 'bg-green-500/20 text-green-400'
                                            : 'bg-yellow-500/20 text-yellow-400'
                                            }`}
                                    >
                                        {submission.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Work Submission Modal */}
            {(selectedTask || loadingTask) && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-gray-900 border border-white/20 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        {loadingTask ? (
                            <div className="text-center py-12">
                                <Loader2 className="w-8 h-8 animate-spin mx-auto text-red-500 mb-4" />
                                <p className="text-gray-400">Loading task details...</p>
                            </div>
                        ) : selectedTask ? (
                            <>
                                <h2 className="text-2xl font-bold mb-4">{selectedTask.title}</h2>
                                <p className="text-gray-400 mb-6">{selectedTask.description}</p>

                                {selectedTask.instructions && (
                                    <div className="bg-white/5 p-4 rounded-xl mb-6">
                                        <h3 className="font-bold mb-2 text-sm text-gray-300">INSTRUCTIONS</h3>
                                        <p className="text-sm text-gray-400 whitespace-pre-wrap">{selectedTask.instructions}</p>
                                    </div>
                                )}

                                <img
                                    src={selectedTask.image}
                                    alt={selectedTask.title}
                                    className="w-full h-64 object-cover rounded-xl mb-6 bg-gray-800"
                                    onError={(e) => {
                                        e.currentTarget.src = FALLBACK_TASK_IMAGE;
                                    }}
                                />

                                <form onSubmit={handleSubmitWork} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                                            Your Work / Response
                                        </label>
                                        <textarea
                                            value={workData}
                                            onChange={(e) => setWorkData(e.target.value)}
                                            placeholder="Enter your labels, classifications, or transcription here..."
                                            rows={6}
                                            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-red-500 resize-none"
                                            required
                                        />
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSelectedTask(null);
                                                if (username && permlink) {
                                                    navigate('/browse');
                                                }
                                            }}
                                            className="flex-1 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                                            disabled={submitting}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                        >
                                            {submitting ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    Submitting...
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="w-4 h-4" />
                                                    Submit Work
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </>
                        ) : null}
                    </div>
                </div>
            )}
        </div>
    );
}
