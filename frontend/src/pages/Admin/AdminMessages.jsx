import React, { useState, useEffect } from 'react';
import { Mail, Trash2, CheckCircle2, MessageSquare, Phone } from 'lucide-react';
import api from '../../services/api';

export const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState({});

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await api.get('/messages');
      setMessages(res.data.messages || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await api.put(`/messages/${id}/read`);
      fetchMessages();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReplyNote = async (id) => {
    const text = replyText[id];
    if (!text) return;
    try {
      await api.put(`/messages/${id}/reply`, { replyNote: text });
      fetchMessages();
    } catch (err) {
      alert('Failed to save reply');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await api.delete(`/messages/${id}`);
      fetchMessages();
    } catch (err) {
      alert('Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-bold text-maroon-800">
          Contact Inquiries & Customer Inbox
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Messages received from the website contact form and newsletter subscribers.
        </p>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-16 text-xs text-gray-400">Loading inbox...</div>
        ) : messages.length === 0 ? (
          <div className="bg-white p-12 text-center text-xs text-gray-400 rounded-xl border">
            No contact messages in inbox.
          </div>
        ) : (
          messages.map((m) => (
            <div
              key={m._id}
              className={`p-5 rounded-xl border transition-all text-xs space-y-3 ${
                m.isRead ? 'bg-white border-gray-200' : 'bg-ivory-50 border-gold-400 shadow-sm'
              }`}
            >
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 pb-2 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-maroon-800">{m.name}</span>
                  <span className="text-gray-400">&bull;</span>
                  <span className="text-gray-600">{m.email}</span>
                  {m.phone && (
                    <>
                      <span className="text-gray-400">&bull;</span>
                      <span className="text-maroon-800 font-medium">{m.phone}</span>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-3 text-gray-400 text-[11px]">
                  <span>{new Date(m.createdAt).toLocaleString('en-PK')}</span>
                  <button
                    onClick={() => handleDelete(m._id)}
                    className="text-red-500 hover:text-red-700"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div>
                <span className="font-bold text-charcoal">{m.subject}:</span>
                <p className="text-gray-600 mt-1 leading-relaxed">{m.message}</p>
              </div>

              {m.replyNote && (
                <div className="bg-emerald-50 p-2.5 rounded border border-emerald-200 text-emerald-900">
                  <strong>Staff Note / Action:</strong> {m.replyNote}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2 pt-1">
                {!m.isRead && (
                  <button
                    onClick={() => handleMarkRead(m._id)}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-charcoal font-semibold rounded text-[11px]"
                  >
                    Mark as Read
                  </button>
                )}

                {m.phone && (
                  <a
                    href={`https://wa.me/${m.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                      `As-salamu alaykum ${m.name}! Thank you for contacting Hand Embroidered Dresses Multan.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 bg-[#25D366] text-white font-semibold rounded text-[11px] flex items-center gap-1"
                  >
                    <Phone className="w-3 h-3" />
                    <span>WhatsApp Reply</span>
                  </a>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminMessages;
