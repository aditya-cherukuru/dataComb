import { useAuth } from '../contexts/AuthContext';
import { ArrowRight, Sparkles, Shield, Zap, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export function HomePage() {
    const { user } = useAuth();

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative overflow-hidden py-20 px-6">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-pink-600/20 to-red-600/20 blur-3xl" />

                <div className="relative max-w-6xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-6">
                        <Sparkles className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm font-semibold">Decentralized AI Data Marketplace</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                        Quality Data for AI,<br />Powered by Hive
                    </h1>

                    <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                        DataComb leverages Hive's reputation system to ensure high-quality, human-verified data for AI training. No middlemen, no fees, just pure value.
                    </p>

                    <div className="flex flex-wrap gap-4 justify-center">
                        {user ? (
                            <>
                                <Link
                                    to="/browse"
                                    className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all flex items-center gap-2 shadow-lg shadow-red-500/50"
                                >
                                    Browse Tasks <ArrowRight className="w-5 h-5" />
                                </Link>
                                <Link
                                    to="/dashboard"
                                    className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all"
                                >
                                    My Dashboard
                                </Link>
                            </>
                        ) : (
                            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6">
                                <p className="text-gray-300 mb-4">Connect your Hive wallet to get started</p>
                                <button className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-8 py-3 rounded-lg font-bold transition-all">
                                    Login with Keychain
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-12">Why DataComb?</h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4">
                                <Shield className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Reputation-Gated Quality</h3>
                            <p className="text-gray-400">
                                Only high-reputation Hive users can validate data, ensuring premium quality for AI training.
                            </p>
                        </div>

                        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4">
                                <Zap className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Zero Gas Fees</h3>
                            <p className="text-gray-400">
                                Built on Hive blockchain - fast, feeless transactions. No hidden costs, just pure value.
                            </p>
                        </div>

                        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mb-4">
                                <TrendingUp className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Fair Compensation</h3>
                            <p className="text-gray-400">
                                Workers earn directly in HIVE/HBD. Transparent pricing, instant payments, no middlemen.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-20 px-6 bg-white/5">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-4xl font-bold text-red-500 mb-2">1,204</div>
                            <div className="text-gray-400">Total Tasks</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-yellow-500 mb-2">89</div>
                            <div className="text-gray-400">Active Workers</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-green-500 mb-2">3.5 HIVE</div>
                            <div className="text-gray-400">Avg. Reward</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-purple-500 mb-2">98%</div>
                            <div className="text-gray-400">Quality Score</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
                    <p className="text-xl text-gray-300 mb-8">
                        Join the future of AI data labeling. Decentralized, transparent, and rewarding.
                    </p>
                    <Link
                        to="/browse"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all shadow-lg shadow-red-500/50"
                    >
                        Explore Tasks <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>
        </div>
    );
}
