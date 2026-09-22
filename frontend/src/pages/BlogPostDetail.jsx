import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, User, ArrowLeft, Share2, Sparkles } from 'lucide-react';
import Breadcrumbs from '../components/common/Breadcrumbs';
import api from '../services/api';

export const BlogPostDetail = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get(`/blogs/slug/${slug}`);
        setPost(res.data.post);
      } catch (err) {
        console.error('Error fetching blog post:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-20 px-4 text-center">
        <div className="w-10 h-10 border-4 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs text-charcoal-muted">Loading article...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-maroon-800">Article Not Found</h2>
        <Link to="/blog" className="text-xs text-maroon-800 font-bold underline">
          Back to Blog List
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Breadcrumbs
        items={[
          { label: 'Blog', link: '/blog' },
          { label: post.title }
        ]}
      />

      <div className="space-y-4 text-center max-w-2xl mx-auto">
        <span className="text-[11px] uppercase font-bold text-gold-700 tracking-widest bg-gold-100 px-3 py-1 rounded-full">
          {post.category}
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-maroon-800 leading-tight">
          {post.title}
        </h1>
        <div className="flex items-center justify-center gap-4 text-xs text-charcoal-muted pt-2">
          <span>By <strong>{post.author}</strong></span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-gold-600" />
            <span>{post.readingTimeMinutes} min read</span>
          </span>
          <span>•</span>
          <span>{new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-PK')}</span>
        </div>
      </div>

      <div className="aspect-[16/9] rounded-2xl overflow-hidden border border-gold-300/60 shadow-lg bg-ivory-100">
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Article Body */}
      <div className="bg-white p-6 sm:p-10 rounded-2xl border border-gold-300/40 shadow-sm space-y-6 text-sm text-charcoal leading-relaxed whitespace-pre-line">
        {post.content}
      </div>

      <div className="pt-6 border-t border-gold-300/40 flex justify-between items-center">
        <Link
          to="/blog"
          className="text-xs font-bold text-maroon-800 hover:text-gold-700 flex items-center gap-1.5 uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Articles</span>
        </Link>
        <Link
          to="/shop"
          className="px-5 py-2.5 bg-maroon-800 text-white font-serif font-bold text-xs uppercase tracking-wider rounded hover:bg-maroon-900"
        >
          Explore Handcrafted Dresses
        </Link>
      </div>
    </article>
  );
};

export default BlogPostDetail;
