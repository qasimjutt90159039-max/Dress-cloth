import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, User, ArrowRight } from 'lucide-react';
import Breadcrumbs from '../components/common/Breadcrumbs';
import api from '../services/api';

export const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await api.get('/blogs');
        setPosts(res.data.posts || []);
      } catch (err) {
        console.error('Error fetching blogs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Breadcrumbs items={[{ label: 'Artisan Blog & Styling Guides' }]} />

      <div className="text-center max-w-2xl mx-auto space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-gold-700 font-bold">
          Multan Textile Stories
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-maroon-800">
          The Needlecraft Chronicles
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">
          Guides, artisan history, and styling advice on Pakistani hand-embroidered traditions.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-pulse">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-80 bg-ivory-200 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article
              key={post._id}
              className="bg-white rounded-xl border border-gold-300/40 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-xl transition-all duration-300 group"
            >
              <div>
                <div className="aspect-[16/10] overflow-hidden bg-ivory-100">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="p-5 space-y-2.5">
                  <div className="flex items-center gap-2 text-[11px] text-gold-700 font-bold">
                    <span>{post.category}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-gray-400 font-normal">
                      <Clock className="w-3 h-3" />
                      <span>{post.readingTimeMinutes} min read</span>
                    </span>
                  </div>

                  <Link to={`/blog/${post.slug}`}>
                    <h3 className="font-serif text-lg font-bold text-charcoal group-hover:text-maroon-800 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                  </Link>

                  <p className="text-xs text-charcoal-muted line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 flex items-center justify-between border-t border-gray-100 mt-4 text-xs font-semibold text-maroon-800">
                <span className="text-[11px] text-gray-400">{post.author}</span>
                <Link
                  to={`/blog/${post.slug}`}
                  className="flex items-center gap-1 hover:text-gold-700"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default Blog;
