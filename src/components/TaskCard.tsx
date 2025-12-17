import type { Task } from "../lib/hive";
import { Coins } from "lucide-react";

interface TaskCardProps {
    task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
    return (
        <div className="group relative bg-[#0F1115] border border-white/5 rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-300 hover:shadow-[0_0_30px_rgba(227,19,55,0.1)] hover:border-primary/30">
            {/* Image Section */}
            <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F1115] via-transparent to-transparent z-10" />
                <img
                    src={task.image}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    alt={task.title}
                />

                {/* Status Badge */}
                <div className="absolute top-4 right-4 z-20">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border backdrop-blur-md ${task.status === 'OPEN'
                        ? 'bg-green-500/10 border-green-500/20 text-green-400'
                        : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                        }`}>
                        {task.status}
                    </span>
                </div>
            </div>

            {/* Content Section */}
            <div className="relative p-5 z-20 -mt-10">
                <div className="bg-[#181B21]/80 backdrop-blur-xl border border-white/5 p-4 rounded-xl shadow-lg">
                    <div className="flex justify-between items-start mb-3">
                        <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-1">
                            {task.title}
                        </h3>
                        <div className="flex items-center gap-1 text-accent font-mono font-bold text-sm bg-accent/10 px-2 py-1 rounded border border-accent/20">
                            <Coins size={14} />
                            {task.reward}
                        </div>
                    </div>

                    <p className="text-muted text-sm line-clamp-2 h-10 mb-4 font-light">
                        {task.description}
                    </p>

                    <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-2">
                        <div className="flex items-center gap-2 text-xs text-muted">
                            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-[10px] border border-white/10">
                                {task.requester[0].toUpperCase()}
                            </div>
                            @{task.requester}
                        </div>

                        <button className="text-xs font-bold text-white/50 group-hover:text-white flex items-center gap-1 transition-colors">
                            VIEW DETAILS
                            <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
