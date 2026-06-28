import React from 'react';

function Sidebar({ user, isOpen, toggleSidebar, onNewChat, onLogout, view, setView }) {
  try {
    return (
      <React.Fragment>
        {/* Mobile overlay */}
        {isOpen && <div className="md:hidden fixed inset-0 bg-black/50 z-40" onClick={toggleSidebar}></div>}

        <div
          className={`fixed md:static inset-y-0 left-0 z-[60] w-[260px] bg-[var(--bg-sidebar)] flex flex-col transition-transform duration-300 ease-in-out ${
            isOpen ? 'translate-x-0' : '-translate-x-full md:hidden md:w-0 md:translate-x-0'
          }`}
          data-name="sidebar"
        >
          <div className="p-3 flex items-center justify-between">
            <button
              onClick={() => { setView('chat'); onNewChat(); }}
              className="flex-1 flex items-center gap-2 hover:bg-zinc-800 p-2 rounded-lg text-sm text-zinc-200 transition-colors"
            >
              <div className="icon-plus text-lg"></div>
              New Chat
            </button>
            <button onClick={toggleSidebar} className="md:hidden p-2 text-zinc-400 hover:text-white rounded-md">
              <div className="icon-x"></div>
            </button>
          </div>

          <div className="px-3 pb-2">
            <button
              onClick={() => setView('chat')}
              className={`w-full flex items-center gap-2 p-2 rounded-lg text-sm transition-colors ${
                view === 'chat' ? 'bg-zinc-800 text-white' : 'text-zinc-300 hover:bg-zinc-800'
              }`}
            >
              <div className="icon-message-circle text-lg"></div>
              Chat
            </button>
            <button
              onClick={() => setView('video')}
              className={`w-full flex items-center gap-2 p-2 rounded-lg text-sm transition-colors ${
                view === 'video' ? 'bg-zinc-800 text-white' : 'text-zinc-300 hover:bg-zinc-800'
              }`}
            >
              <div className="icon-video text-lg"></div>
              Video Generator
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-2">
            <div className="text-xs font-medium text-zinc-500 mb-3 px-2">Today</div>
            <button className="w-full text-left p-2 hover:bg-zinc-800 rounded-lg text-sm text-zinc-300 truncate transition-colors">
              How to build a web app
            </button>
            <button className="w-full text-left p-2 hover:bg-zinc-800 rounded-lg text-sm text-zinc-300 truncate transition-colors">
              Python script for data analysis
            </button>
          </div>

          <div className="p-3 border-t border-zinc-800">
            <div className="w-full flex items-center justify-between p-2 rounded-lg text-sm text-zinc-300 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-500 flex items-center justify-center shrink-0">
                  <div className="icon-user text-sm"></div>
                </div>
                <div className="text-left font-medium truncate max-w-[120px]">{user ? user.name : 'Guest'}</div>
              </div>
              <button
                onClick={onLogout}
                className="text-zinc-500 hover:text-red-400 p-1.5 rounded-md hover:bg-zinc-800 transition-colors"
                title="Logout"
              >
                <div className="icon-log-out"></div>
              </button>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  } catch (error) {
    console.error('Sidebar component error:', error);
    return null;
  }
}

export default Sidebar;
