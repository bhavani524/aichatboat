import React from 'react';

function AuthScreen({ onLogin }) {
  try {
    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [isRegisterMode, setIsRegisterMode] = React.useState(false);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [error, setError] = React.useState('');

    // Use relative path — Vite proxy forwards /api → backend (no CORS issues ever)
    const API_BASE = '/api';

    const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');
      if (!email.trim() || !password.trim() || (isRegisterMode && !name.trim())) return;

      setIsSubmitting(true);
      try {
        const endpoint = isRegisterMode ? '/auth/register' : '/auth/login';
        const body = isRegisterMode
          ? { name: name.trim(), email: email.trim(), password }
          : { email: email.trim(), password };

        const res = await fetch(`${API_BASE}${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || (data.errors && data.errors[0]) || 'Authentication failed.');
        }

        localStorage.setItem('authToken', data.token);
        onLogin({ name: data.user.name, email: data.user.email, avatar: 'icon-user' });
      } catch (err) {
        console.error('Auth error:', err);
        setError(err.message || 'Something went wrong. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center bg-[var(--bg-main)] overflow-hidden" data-name="auth-screen">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-[var(--bg-main)] to-purple-900/20 pointer-events-none"></div>

        <div className="relative z-10 w-full max-w-md p-8 flex flex-col items-center">
          <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center mb-8 shadow-2xl shadow-blue-500/20 animate-hero opacity-0">
            <div className="icon-sparkles text-4xl text-white"></div>
          </div>

          <h1 className="text-4xl font-bold text-white mb-2 animate-hero delay-100 opacity-0 text-center">
            {isRegisterMode ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-zinc-400 mb-10 text-center animate-hero delay-200 opacity-0">
            {isRegisterMode ? 'Sign up to start your premium AI workspace.' : 'Sign in to continue to your premium AI workspace.'}
          </p>

          <form onSubmit={handleSubmit} className="w-full animate-hero delay-300 opacity-0">
            {isRegisterMode && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-zinc-400 mb-2">Display Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-4 py-3 text-white outline-none transition-all"
                  required
                />
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-zinc-400 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-zinc-900 border border-zinc-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-4 py-3 text-white outline-none transition-all"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-zinc-400 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-zinc-900 border border-zinc-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-4 py-3 text-white outline-none transition-all"
                required
                minLength={8}
              />
            </div>

            {error && (
              <div className="mb-4 text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-800 disabled:text-zinc-500 text-white rounded-xl py-3 font-medium transition-all flex items-center justify-center gap-2 group relative overflow-hidden"
            >
              {isSubmitting ? (
                <div className="icon-loader animate-spin text-xl"></div>
              ) : (
                <React.Fragment>
                  <span>{isRegisterMode ? 'Create Account' : 'Continue to Workspace'}</span>
                  <div className="icon-arrow-right group-hover:translate-x-1 transition-transform"></div>
                </React.Fragment>
              )}
            </button>

            <button
              type="button"
              onClick={() => { setIsRegisterMode(!isRegisterMode); setError(''); }}
              className="w-full mt-4 text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              {isRegisterMode ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </form>
        </div>
      </div>
    );
  } catch (error) {
    console.error('AuthScreen component error:', error);
    return null;
  }
}

export default AuthScreen;