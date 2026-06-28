import { useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

const VideoGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [myVideos, setMyVideos] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Fetch past videos on mount
  useEffect(() => {
    fetchMyVideos();
  }, []);

  const fetchMyVideos = async () => {
    try {
      setLoadingHistory(true);
      // Use 'authToken' — matches what AuthScreen stores
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${API_BASE_URL}/video/my-videos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setMyVideos(data.videos || []);
      }
    } catch (err) {
      console.error('Failed to load video history:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setError('');
    setVideoUrl('');

    try {
      setLoading(true);
      // Use 'authToken' — matches what AuthScreen stores
      const token = localStorage.getItem('authToken');

      const res = await fetch(`${API_BASE_URL}/video/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Video generation failed');
      }

      setVideoUrl(data.video.videoUrl);
      // Refresh history
      fetchMyVideos();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 max-w-2xl mx-auto w-full">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center">
          <div className="icon-video text-white text-lg"></div>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white">AI Video Generator</h2>
          <p className="text-zinc-400 text-sm">Turn a text prompt into a short video</p>
        </div>
      </div>

      {/* Prompt input */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-zinc-400">Describe your video</label>
        <textarea
          rows={4}
          placeholder="e.g. A serene mountain lake at sunrise with mist rising from the water..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={loading}
          className="w-full bg-zinc-900 border border-zinc-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl px-4 py-3 text-white outline-none transition-all resize-none disabled:opacity-50"
        />
      </div>

      {error && (
        <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      <button
        onClick={handleGenerate}
        disabled={loading || !prompt.trim()}
        className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-zinc-800 disabled:text-zinc-500 text-white rounded-xl py-3 font-medium transition-all flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <div className="icon-loader animate-spin text-xl"></div>
            <span>Generating… this may take 1–3 minutes</span>
          </>
        ) : (
          <>
            <div className="icon-sparkles text-lg"></div>
            <span>Generate Video</span>
          </>
        )}
      </button>

      {/* Generated video preview */}
      {videoUrl && (
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-zinc-400">Generated Video</p>
          <video
            className="w-full rounded-xl border border-zinc-800"
            controls
            autoPlay
            src={videoUrl}
          />
          <a
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-purple-400 hover:text-purple-300 text-center transition-colors"
          >
            Open in new tab ↗
          </a>
        </div>
      )}

      {/* Video history */}
      {myVideos.length > 0 && (
        <div className="flex flex-col gap-3 mt-2">
          <p className="text-sm font-medium text-zinc-400">Your Recent Videos</p>
          <div className="flex flex-col gap-3">
            {myVideos.slice(0, 5).map((v) => (
              <div
                key={v._id}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 flex flex-col gap-2"
              >
                <p className="text-xs text-zinc-400 truncate">{v.prompt}</p>
                {v.status === 'completed' && v.videoUrl ? (
                  <video className="w-full rounded-lg" controls src={v.videoUrl} />
                ) : (
                  <span
                    className={`text-xs px-2 py-1 rounded-full self-start ${
                      v.status === 'failed'
                        ? 'bg-red-500/10 text-red-400'
                        : 'bg-yellow-500/10 text-yellow-400'
                    }`}
                  >
                    {v.status}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoGenerator;