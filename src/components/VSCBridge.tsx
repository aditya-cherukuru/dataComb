import { useState } from 'react';
import { X, ArrowRight, CheckCircle, Loader2 } from 'lucide-react';

interface VSCBridgeProps {
    isOpen: boolean;
    onClose: () => void;
}

export function VSCBridge({ isOpen, onClose }: VSCBridgeProps) {
    const [step, setStep] = useState<'select' | 'amount' | 'confirm' | 'processing' | 'success'>('select');
    const [selectedChain, setSelectedChain] = useState<'ETH' | 'BTC' | 'SOL' | null>(null);
    const [amount, setAmount] = useState('');

    const chains = [
        { id: 'ETH' as const, name: 'Ethereum', icon: '⟠', color: 'from-blue-500 to-cyan-500' },
        { id: 'BTC' as const, name: 'Bitcoin', icon: '₿', color: 'from-orange-500 to-yellow-500' },
        { id: 'SOL' as const, name: 'Solana', icon: '◎', color: 'from-purple-500 to-pink-500' },
    ];

    const handleSelectChain = (chain: 'ETH' | 'BTC' | 'SOL') => {
        setSelectedChain(chain);
        setStep('amount');
    };

    const handleConfirm = () => {
        setStep('processing');
        setTimeout(() => {
            setStep('success');
        }, 3000);
    };

    const handleClose = () => {
        setStep('select');
        setSelectedChain(null);
        setAmount('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-gradient-to-br from-gray-900 via-purple-900/50 to-gray-900 border border-white/20 rounded-2xl p-8 max-w-md w-full relative">
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">⚡</span>
                    </div>
                    <h2 className="text-2xl font-bold mb-2">VSC Bridge</h2>
                    <p className="text-gray-400 text-sm">
                        Cross-chain deposits powered by Magi Network
                    </p>
                </div>

                {/* Step Indicator */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    {['select', 'amount', 'confirm', 'processing'].map((s, i) => (
                        <div
                            key={s}
                            className={`h-2 rounded-full transition-all ${step === s || (step === 'success' && s === 'processing')
                                    ? 'w-8 bg-red-500'
                                    : i < ['select', 'amount', 'confirm', 'processing'].indexOf(step)
                                        ? 'w-2 bg-red-500/50'
                                        : 'w-2 bg-white/20'
                                }`}
                        />
                    ))}
                </div>

                {/* Select Chain */}
                {step === 'select' && (
                    <div className="space-y-3">
                        <p className="text-sm text-gray-400 mb-4">Select source chain:</p>
                        {chains.map((chain) => (
                            <button
                                key={chain.id}
                                onClick={() => handleSelectChain(chain.id)}
                                className={`w-full bg-gradient-to-r ${chain.color} bg-opacity-20 hover:bg-opacity-30 border border-white/20 rounded-xl p-4 flex items-center gap-4 transition-all group`}
                            >
                                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-2xl">
                                    {chain.icon}
                                </div>
                                <div className="flex-1 text-left">
                                    <h3 className="font-bold">{chain.name}</h3>
                                    <p className="text-sm text-gray-400">Bridge {chain.id} to HIVE</p>
                                </div>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        ))}
                    </div>
                )}

                {/* Enter Amount */}
                {step === 'amount' && selectedChain && (
                    <div className="space-y-6">
                        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                            <p className="text-sm text-gray-400 mb-2">From</p>
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">
                                    {chains.find(c => c.id === selectedChain)?.icon}
                                </span>
                                <span className="font-bold">{selectedChain}</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2">
                                Amount
                            </label>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                                step="0.01"
                                min="0"
                                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white text-2xl font-bold placeholder-gray-400 focus:outline-none focus:border-red-500"
                            />
                            <p className="text-xs text-gray-500 mt-2">
                                ≈ {amount ? (parseFloat(amount) * 1000).toFixed(2) : '0.00'} HIVE
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setStep('select')}
                                className="flex-1 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                            >
                                Back
                            </button>
                            <button
                                onClick={() => setStep('confirm')}
                                disabled={!amount || parseFloat(amount) <= 0}
                                className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50"
                            >
                                Continue
                            </button>
                        </div>
                    </div>
                )}

                {/* Confirm */}
                {step === 'confirm' && selectedChain && (
                    <div className="space-y-6">
                        <div className="bg-white/5 rounded-xl p-6 border border-white/10 space-y-4">
                            <div className="flex justify-between">
                                <span className="text-gray-400">From</span>
                                <span className="font-bold">{amount} {selectedChain}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">To</span>
                                <span className="font-bold">{(parseFloat(amount) * 1000).toFixed(2)} HIVE</span>
                            </div>
                            <div className="border-t border-white/10 pt-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Network Fee</span>
                                    <span>~0.01 {selectedChain}</span>
                                </div>
                                <div className="flex justify-between text-sm mt-2">
                                    <span className="text-gray-400">Bridge Fee</span>
                                    <span>0.5%</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setStep('amount')}
                                className="flex-1 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                            >
                                Back
                            </button>
                            <button
                                onClick={handleConfirm}
                                className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                )}

                {/* Processing */}
                {step === 'processing' && (
                    <div className="text-center py-8">
                        <Loader2 className="w-16 h-16 animate-spin text-red-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold mb-2">Processing Transaction</h3>
                        <p className="text-gray-400 text-sm">
                            Your cross-chain transfer is being processed via VSC Network...
                        </p>
                    </div>
                )}

                {/* Success */}
                {step === 'success' && (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-10 h-10 text-green-400" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Transfer Complete!</h3>
                        <p className="text-gray-400 text-sm mb-6">
                            {(parseFloat(amount) * 1000).toFixed(2)} HIVE has been added to your account
                        </p>
                        <button
                            onClick={handleClose}
                            className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-8 py-3 rounded-lg font-semibold transition-all"
                        >
                            Done
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
