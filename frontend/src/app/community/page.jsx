'use client';
import { useState, useEffect } from 'react';
import { getCommunityPosts, createCommunityPost } from '@/lib/api';
import { useToast } from '@/components/Toast';

const AVATAR_COLORS = ['from-teal-400 to-blue-400', 'from-purple-400 to-pink-400', 'from-orange-400 to-red-400', 'from-yellow-400 to-green-400'];

const FALLBACK = [
  { id: 1, author_name: 'Sarah Chen', title: 'Amazing experience in Bali!', content: 'The rice terraces of Ubud are absolutely breathtaking.', destination: 'Bali', tags: 'bali,nature,culture', likes: 47, created_at: '2026-08-15' },
  { id: 2, author_name: 'Marco Rossi', title: 'Hidden gems of Santorini', content: 'Skip tourist spots and explore Pyrgos and Emporio.', destination: 'Santorini', tags: 'greece,europe', likes: 32, created_at: '2026-08-10' },
  { id: 3, author_name: 'Amit Patel', title: 'Jaipur food trail', content: 'Best dal baati churma near Johari Bazaar!', destination: 'Jaipur', tags: 'india,food', likes: 28, created_at: '2026-08-05' },
];

export default function CommunityPage() {
  const showToast = useToast();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [showForm, setShowForm] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', destination: '', tags: '' });
  const [posting, setPosting] = useState(false);

  useEffect(() => { loadPosts(); }, []);

  async function loadPosts(sort, q) {
    try {
      const data = await getCommunityPosts({ sort_by: sort ?? sortBy, ...(q ?? search ? { search: q ?? search } : {}) });
      setPosts(Array.isArray(data) ? data : FALLBACK);
    } catch { setPosts(FALLBACK); }
    setLoading(false);
  }

  async function handlePost() {
    if (!newPost.title) { showToast('Title required', 'error'); return; }
    setPosting(true);
    try {
      await createCommunityPost(newPost);
      showToast('Post shared! 🎉', 'success');
      setShowForm(false);
      setNewPost({ title: '', content: '', destination: '', tags: '' });
      await loadPosts();
    } catch { showToast('Failed to post', 'error'); }
    setPosting(false);
  }

  return (
    <div className="max-w-[900px] mx-auto px-6 py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-heading font-bold"><span className="gradient-text">Community</span></h1>
        <button onClick={() => setShowForm(!showForm)} className="px-5 py-2 rounded-xl font-semibold gradient-btn text-sm">+ Share Experience</button>
      </div>
      <p className="text-white/50 text-sm mb-8">Community section where all users can share their experience about a certain trip or any activity.</p>

      <div className="flex flex-wrap items-center gap-3 p-3 glass-card mb-6">
        <div className="flex-1 min-w-[200px] relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">🔍</span>
          <input type="text" placeholder="Search posts..." value={search}
            onChange={(e) => { setSearch(e.target.value); loadPosts(null, e.target.value); }}
            className="w-full py-2 pl-10 pr-4 bg-white/[0.06] border border-transparent rounded-xl text-white text-sm outline-none focus:border-teal-400 transition-all" />
        </div>
        <div className="flex gap-1">
          {[{ v: 'recent', l: '🕐 Recent' }, { v: 'popular', l: '🔥 Popular' }].map((s) => (
            <button key={s.v} onClick={() => { setSortBy(s.v); loadPosts(s.v); }}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-all
                ${sortBy === s.v ? 'text-teal-400 border-teal-400 bg-teal-400/15' : 'text-white/50 border-white/[0.08] bg-white/[0.06]'}`}>
              {s.l}
            </button>
          ))}
        </div>
      </div>

      <div className="text-xs text-right mb-2 text-white/30">Community tab</div>

      {/* Create Post */}
      {showForm && (
        <div className="glass-card p-6 mb-6 border border-teal-400/30 animate-scale-in">
          <h3 className="font-heading font-bold mb-4">✍️ Share Your Experience</h3>
          <div className="space-y-3">
            <input type="text" placeholder="Title" value={newPost.title} onChange={(e) => setNewPost({ ...newPost, title: e.target.value })} className="gt-input py-3" />
            <textarea placeholder="Tell your story..." value={newPost.content} onChange={(e) => setNewPost({ ...newPost, content: e.target.value })} className="gt-input py-3 min-h-[80px] resize-y" />
            <div className="grid grid-cols-2 gap-3">
              <input type="text" placeholder="Destination" value={newPost.destination} onChange={(e) => setNewPost({ ...newPost, destination: e.target.value })} className="gt-input py-2 text-sm" />
              <input type="text" placeholder="Tags (comma-separated)" value={newPost.tags} onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })} className="gt-input py-2 text-sm" />
            </div>
            <div className="flex gap-3">
              <button onClick={handlePost} disabled={posting} className="px-5 py-2 rounded-xl font-bold gradient-btn text-sm disabled:opacity-50">{posting ? 'Posting...' : '📤 Post'}</button>
              <button onClick={() => setShowForm(false)} className="px-5 py-2 rounded-xl text-sm border border-white/[0.08] text-white/60 hover:text-white transition-all">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Posts */}
      {loading ? (
        <div className="flex justify-center py-16"><div className="w-10 h-10 border-3 border-white/[0.08] border-t-teal-400 rounded-full animate-spin" /></div>
      ) : (
        <div className="space-y-4">
          {posts.map((post, i) => (
            <div key={post.id} className="glass-card p-5 hover:glass-card-hover transition-all flex gap-4">
              <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${AVATAR_COLORS[i % AVATAR_COLORS.length]} flex items-center justify-center text-base font-bold flex-shrink-0`}>
                {(post.author_name || 'U')[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-0.5">
                  <span className="font-semibold text-sm">{post.author_name || 'Anonymous'}</span>
                  <span className="text-xs text-white/30">{post.destination && `📍 ${post.destination} ·`} {post.created_at?.split('T')[0]}</span>
                </div>
                <h3 className="font-heading font-bold mb-1">{post.title}</h3>
                <p className="text-sm text-white/50 mb-2">{post.content}</p>
                {post.tags && (
                  <div className="flex gap-1 flex-wrap mb-2">
                    {post.tags.split(',').map((tag, j) => (
                      <span key={j} className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.06] text-teal-400">#{tag.trim()}</span>
                    ))}
                  </div>
                )}
                <div className="flex gap-4 text-xs text-white/40">
                  <span className="hover:text-red-400 cursor-pointer transition-colors">❤️ {post.likes || 0}</span>
                  <span className="hover:text-white cursor-pointer transition-colors">💬 Reply</span>
                  <span className="hover:text-white cursor-pointer transition-colors">🔗 Share</span>
                </div>
              </div>
            </div>
          ))}
          {posts.length === 0 && (
            <div className="text-center py-16">
              <div className="text-5xl mb-4 opacity-30">🌍</div>
              <p className="text-white/40">No posts yet. Be the first to share!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
