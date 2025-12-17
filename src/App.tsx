import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { HomePage } from './pages/HomePage';
import { BrowsePage } from './pages/BrowsePage';
import { DashboardPage } from './pages/DashboardPage';
import { WorkPage } from './pages/WorkPage';
import { CreateTaskPage } from './pages/CreateTaskPage';
import { TaskDetailsPage } from './pages/TaskDetails';
import { VSCBridge } from './components/VSCBridge';
import { Loader2, LogIn, UserCircle, Menu, X, Zap } from 'lucide-react';
import { useState } from 'react';

function Navigation() {
  const { user, login, logout, loading } = useAuth();
  const [username, setUsername] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showBridge, setShowBridge] = useState(false);
  const location = useLocation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) return;

    try {
      await login(username);
      setShowLoginModal(false);
      setUsername('');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Login failed');
    }
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/browse', label: 'Browse Tasks' },
    ...(user ? [
      { to: '/dashboard', label: 'Dashboard' },
      { to: '/work', label: 'My Work' },
    ] : []),
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              🐝
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">DataComb</h1>
              <p className="text-xs text-gray-400">Hive AI Marketplace</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-semibold transition-colors ${location.pathname === link.to
                  ? 'text-red-400'
                  : 'text-gray-300 hover:text-white'
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Auth Section */}
          <div className="hidden md:flex items-center gap-3">
            {user && (
              <button
                onClick={() => setShowBridge(true)}
                className="bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-300 px-4 py-2 rounded-lg font-semibold text-sm transition-all flex items-center gap-2"
              >
                <Zap className="w-4 h-4" />
                VSC Bridge
              </button>
            )}
            {user ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg px-4 py-2 transition-colors"
                >
                  <UserCircle className="w-5 h-5" />
                  <div className="text-left">
                    <div className="text-sm font-semibold">{user.name}</div>
                    <div className="text-xs text-gray-400">Rep: {user.reputation}</div>
                  </div>
                </Link>
                <button
                  onClick={logout}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-6 py-2 rounded-lg font-semibold transition-all flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                Login
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden bg-black/90 backdrop-blur-md border-t border-white/10">
            <nav className="px-6 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setShowMobileMenu(false)}
                  className={`block py-2 px-4 rounded-lg transition-colors ${location.pathname === link.to
                    ? 'bg-red-500/20 text-red-400'
                    : 'text-gray-300 hover:bg-white/10'
                    }`}
                >
                  {link.label}
                </Link>
              ))}
              {!user && (
                <button
                  onClick={() => {
                    setShowMobileMenu(false);
                    setShowLoginModal(true);
                  }}
                  className="w-full bg-gradient-to-r from-red-600 to-pink-600 text-white px-6 py-2 rounded-lg font-semibold"
                >
                  Login
                </button>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-gray-900 border border-white/20 rounded-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-6">Login with Hive Keychain</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Hive Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
                  disabled={loading}
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowLoginModal(false)}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !username}
                  className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    'Login'
                  )}
                </button>
              </div>
            </form>
            <p className="text-xs text-gray-400 mt-4 text-center">
              Make sure you have Hive Keychain extension installed
            </p>
          </div>
        </div>
      )}

      {/* VSC Bridge */}
      <VSCBridge isOpen={showBridge} onClose={() => setShowBridge(false)} />

      {/* Spacer for fixed header */}
      <div className="h-20" />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
          <Navigation />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/browse" element={<BrowsePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/create-task" element={<CreateTaskPage />} />
            <Route path="/work" element={<WorkPage />} />
            <Route path="/work/:username/:permlink" element={<WorkPage />} />
            <Route path="/task/:username/:permlink" element={<TaskDetailsPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
