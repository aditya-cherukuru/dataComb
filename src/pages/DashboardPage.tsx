import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Plus, TrendingUp, Clock, CheckCircle } from 'lucide-react';

export function DashboardPage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Please login to access your dashboard</h2>
                    <p className="text-gray-400">Connect your Hive Keychain to continue</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">Requester Dashboard</h1>
                        <p className="text-gray-400">Manage your tasks and track progress</p>
                    </div>
                    <button
                        onClick={() => navigate('/create-task')}
                        className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all shadow-lg shadow-red-500/50"
                    >
                        <Plus className="w-5 h-5" />
                        Create Task
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-2">
                            <TrendingUp className="w-8 h-8 text-green-400" />
                            <span className="text-2xl font-bold">12</span>
                        </div>
                        <p className="text-gray-400 text-sm">Active Tasks</p>
                    </div>

                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-2">
                            <Clock className="w-8 h-8 text-yellow-400" />
                            <span className="text-2xl font-bold">8</span>
                        </div>
                        <p className="text-gray-400 text-sm">Pending Review</p>
                    </div>

                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-2">
                            <CheckCircle className="w-8 h-8 text-blue-400" />
                            <span className="text-2xl font-bold">45</span>
                        </div>
                        <p className="text-gray-400 text-sm">Completed</p>
                    </div>

                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-2xl">💰</span>
                            <span className="text-2xl font-bold text-yellow-400">180</span>
                        </div>
                        <p className="text-gray-400 text-sm">HIVE Spent</p>
                    </div>
                </div>

                {/* Recent Tasks */}
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                    <h2 className="text-2xl font-bold mb-6">Your Tasks</h2>

                    <div className="space-y-4">
                        {[
                            {
                                title: 'Label Product Images',
                                status: 'Active',
                                submissions: 23,
                                total: 100,
                                reward: '10 HIVE',
                                image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
                            },
                            {
                                title: 'Classify Customer Feedback',
                                status: 'Review',
                                submissions: 50,
                                total: 50,
                                reward: '15 HIVE',
                                image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
                            },
                            {
                                title: 'Audio Transcription',
                                status: 'Completed',
                                submissions: 30,
                                total: 30,
                                reward: '20 HIVE',
                                image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400',
                            },
                        ].map((task, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all cursor-pointer"
                            >
                                <img
                                    src={task.image}
                                    alt={task.title}
                                    className="w-20 h-20 object-cover rounded-lg"
                                />
                                <div className="flex-1">
                                    <h3 className="font-bold mb-1">{task.title}</h3>
                                    <div className="flex items-center gap-4 text-sm text-gray-400">
                                        <span>{task.submissions}/{task.total} submissions</span>
                                        <span className="text-yellow-400">{task.reward}</span>
                                    </div>
                                </div>
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-bold ${task.status === 'Active'
                                        ? 'bg-green-500/20 text-green-400'
                                        : task.status === 'Review'
                                            ? 'bg-yellow-500/20 text-yellow-400'
                                            : 'bg-blue-500/20 text-blue-400'
                                        }`}
                                >
                                    {task.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
