import { Loader2, LogIn, UserCircle } from "lucide-react";
import type { UserProfile } from "../lib/hive";
import { cn } from "../lib/utils";

interface HeaderProps {
    user: UserProfile | null;
    onLogin: (username: string) => void;
    loading: boolean;
}

export function Header({ user, onLogin, loading }: HeaderProps) {
    const handleLoginSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const input = form.elements.namedItem('username') as HTMLInputElement;
        if (input.value) onLogin(input.value);
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-white/5 bg-[#050505]/80 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-3 group cursor-pointer">
                    <div className="relative">
                        <div className="absolute inset-0 bg-primary blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
                        <div className="relative w-10 h-10 bg-gradient-to-br from-primary to-rose-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg border border-white/10 group-hover:scale-105 transition-transform">
                            <span className="mb-0.5">🐝</span>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-2xl font-bold tracking-tight text-white group-hover:text-primary transition-colors">DataComb</h1>
                        <span className="text-[10px] uppercase tracking-widest text-muted font-bold">Hive Intel Layer</span>
                    </div>
                </div>

                {/* User Auth */}
                <div>
                    {user ? (
                        <div className="flex items-center gap-4 pl-6 border-l border-white/10">
                            <div className="text-right hidden sm:block">
                                <p className="font-bold text-sm text-white">{user.name}</p>
                                <div className="flex items-center justify-end gap-1.5">
                                    <span className={cn(
                                        "w-2 h-2 rounded-full animate-pulse",
                                        user.reputation > 50 ? "bg-green-500" : "bg-yellow-500"
                                    )} />
                                    <p className="text-xs text-muted font-mono">REP: {user.reputation}</p>
                                </div>
                            </div>
                            <div className="relative group">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-full opacity-50 blur group-hover:opacity-75 transition duration-200"></div>
                                <img
                                    src={user.metadata?.profile?.profile_image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                                    className="relative w-10 h-10 rounded-full bg-surface border-2 border-[#050505] object-cover"
                                    alt="avatar"
                                />
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleLoginSubmit} className="flex items-center gap-2 bg-white/5 p-1 rounded-full border border-white/10 focus-within:border-primary/50 transition-colors">
                            <div className="pl-3 text-muted">
                                <UserCircle size={18} />
                            </div>
                            <input
                                name="username"
                                type="text"
                                placeholder="Hive Username"
                                className="bg-transparent border-none outline-none text-sm w-32 placeholder:text-muted/50 text-white"
                                autoComplete="off"
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-all disabled:opacity-50 hover:scale-105 active:scale-95"
                            >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </header>
    );
}
