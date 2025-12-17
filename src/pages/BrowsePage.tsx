import { useState, useEffect } from 'react';
import { fetchTasksByTag, type Task } from '../lib/hive';
import { FALLBACK_TASK_IMAGE } from '../lib/constants';
import { Search, Filter, LayoutGrid, List, RefreshCw, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export function BrowsePage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        setLoading(true);
        setError(null);
        try {
            // Fetch tasks from Hive by datacomb33 tag
            const hiveTasks = await fetchTasksByTag('datacomb33');

            if (hiveTasks.length > 0) {
                setTasks(hiveTasks);
            } else {
                setTasks([]);
            }
        } catch (error: any) {
            console.error('Failed to load tasks:', error);
            setError(error.message || 'Failed to load tasks from Hive network');
            setTasks([]);
        } finally {
            setLoading(false);
        }
    };

    const filteredTasks = tasks.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen py-8 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">Browse Tasks</h1>
                        <p className="text-gray-400">Explore and filter available data tasks</p>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 flex items-center justify-between">
                        <span>{error}</span>
                        <button onClick={loadTasks} className="text-sm underline hover:text-red-300">Retry</button>
                    </div>
                )}

                {/* Search and Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <div className="flex-1 min-w-[300px]">
                        <div className="relative">
                            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search tasks..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
                            />
                        </div>
                    </div>

                    <button
                        onClick={loadTasks}
                        className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg px-6 py-3 flex items-center gap-2 transition-colors"
                        disabled={loading}
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
                        Refresh
                    </button>

                    <button className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg px-6 py-3 flex items-center gap-2 transition-colors">
                        <Filter className="w-5 h-5" />
                        Filters
                    </button>

                    <div className="flex bg-white/10 rounded-lg p-1">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white/20 text-white' : 'text-gray-400 hover:text-white'}`}
                        >
                            <LayoutGrid className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white/20 text-white' : 'text-gray-400 hover:text-white'}`}
                        >
                            <List className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Tasks Grid */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-block w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
                        <p className="mt-4 text-gray-400">Loading tasks...</p>
                    </div>
                ) : filteredTasks.length === 0 ? (
                    <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
                        <p className="text-gray-400 mb-2">No active tasks found</p>
                        <p className="text-sm text-gray-500">
                            Be the first to create a task with tag <span className="text-red-400 font-mono">#datacomb33</span>
                        </p>
                        <Link
                            to="/create-task"
                            className="inline-block mt-6 bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                        >
                            Create Task
                        </Link>
                    </div>
                ) : (
                    <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                        {filteredTasks.map((task) => (
                            <Link
                                key={task.id}
                                to={`/task/${task.requester}/${task.permlink || task.id}`}
                                className="group bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 hover:border-red-500/50 transition-all"
                            >
                                <div className="relative h-48 overflow-hidden bg-gray-800">
                                    <img
                                        src={task.image}
                                        alt={task.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                        onError={(e) => {
                                            // Fallback if image fails to load
                                            e.currentTarget.src = FALLBACK_TASK_IMAGE;
                                        }}
                                    />
                                    <div className="absolute top-4 right-4">
                                        <span className="bg-green-500/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full">
                                            {task.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="text-lg font-bold group-hover:text-red-400 transition-colors">
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
                                        <span className="text-purple-400">{task.category}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
