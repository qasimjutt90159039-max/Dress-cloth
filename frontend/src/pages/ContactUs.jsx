import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Send,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import Breadcrumbs from '../components/common/Breadcrumbs';
import api from '../services/api';

export const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Store Inquiry',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/messages', formData);
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', subject: 'Store Inquiry', message: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit message. Please contact via WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Breadcrumbs items={[{ label: 'Contact Us & Store Location' }]} />

      <div className="text-center max-w-2xl mx-auto my-8 space-y-2">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-maroon-800">
          Get in Touch with Our Multan Boutique
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">
          Have an inquiry about sizing, bridal appointments, custom order quotes, or delivery to your city? Our customer team in Multan is here to assist you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-10">
        {/* Left: Contact Info & Business Details */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gold-300/60 shadow-sm space-y-6">
            <h2 className="font-serif text-2xl font-bold text-maroon-800 border-b border-gold-200 pb-3">
              Store Information
            </h2>

            <div className="space-y-4 text-xs text-charcoal leading-relaxed">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-ivory-200 flex items-center justify-center text-maroon-800 shrink-0">
                  <MapPin className="w-5 h-5 text-gold-600" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-maroon-800">Multan Boutique Address</h4>
                  <p className="text-charcoal-muted mt-0.5">
                    Shop No. 7, Bata Wali, Hussain Agahi Main Chowk Bazar, Ghali Colony, near Firdouse Market, Inner City, Multan, 66000, Pakistan
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-ivory-200 flex items-center justify-center text-maroon-800 shrink-0">
                  <Phone className="w-5 h-5 text-gold-600" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-maroon-800">Phone / WhatsApp</h4>
                  <p className="text-charcoal-muted mt-0.5">
                    Local: <strong>03186229753</strong><br />
                    International: <strong>+92 318 6229753</strong>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-ivory-200 flex items-center justify-center text-maroon-800 shrink-0">
                  <Mail className="w-5 h-5 text-gold-600" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-maroon-800">Official Email</h4>
                  <p className="text-charcoal-muted mt-0.5">
                    info@handembroidered.pk<br />
                    orders@handembroidered.pk
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-ivory-200 flex items-center justify-center text-maroon-800 shrink-0">
                  <Clock className="w-5 h-5 text-gold-600" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-maroon-800">Operating Hours</h4>
                  <p className="text-charcoal-muted mt-0.5">
                    Monday - Saturday: <strong>10:00 AM - 10:00 PM (PKT)</strong><br />
                    Sunday: By Appointment for Bridal Consultations
                  </p>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Click-to-chat */}
            <div className="pt-2">
              <a
                href="https://wa.me/923186229753?text=As-salamu%20alaykum!%20I%20am%20contacting%20Hand%20Embroidered%20Dresses%20Multan%20with%20an%20inquiry."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Chat Instantly on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right: Contact Form */}
        <div className="lg:col-span-7">
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gold-300/60 shadow-sm space-y-6">
            <h2 className="font-serif text-2xl font-bold text-maroon-800 border-b border-gold-200 pb-3">
              Send Us a Message
            </h2>

            {submitted ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h3 className="font-serif text-xl font-bold text-emerald-900">Message Dispatched!</h3>
                <p className="text-xs text-emerald-800 leading-relaxed max-w-md mx-auto">
                  Thank you for reaching out to Hand Embroidered Dresses. Our customer support team will get in touch with you shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-xs text-emerald-900 underline font-semibold mt-2"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Ayesha Khan"
                      className="w-full p-2.5 bg-ivory-50 border border-gold-300 rounded focus:bg-white focus:outline-none focus:border-maroon-800"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your.email@gmail.com"
                      className="w-full p-2.5 bg-ivory-50 border border-gold-300 rounded focus:bg-white focus:outline-none focus:border-maroon-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold mb-1">Contact Phone (Optional)</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="03186229753"
                      className="w-full p-2.5 bg-ivory-50 border border-gold-300 rounded"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">Subject *</label>
                    <input
                      type="text"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="e.g. Bridal dress inquiry, order tracking..."
                      className="w-full p-2.5 bg-ivory-50 border border-gold-300 rounded"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Your Message *</label>
                  <textarea
                    name="message"
                    rows={4}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Write your inquiry or question here..."
                    className="w-full p-2.5 bg-ivory-50 border border-gold-300 rounded focus:bg-white focus:outline-none focus:border-maroon-800"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-maroon-800 hover:bg-maroon-900 disabled:opacity-50 text-white font-serif font-bold text-xs uppercase tracking-wider rounded-lg shadow-md transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5 text-gold-300" />
                  <span>{loading ? 'Sending Message...' : 'Send Message'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Embedded Interactive Google Map of Multan Store */}
      <div className="mt-16 bg-white p-4 rounded-2xl border border-gold-300/60 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-maroon-800 font-serif font-bold text-lg p-2">
          <MapPin className="w-5 h-5 text-gold-600" />
          <span>Multan Store Location Map (Hussain Agahi Bazar)</span>
        </div>
        <div className="w-full h-80 rounded-xl overflow-hidden border border-gray-200">
          <iframe
            title="Hand Embroidered Dresses Multan Store Location"
            src="https://maps.google.com/maps?q=Hussain%20Agahi%20Bazar%20Multan&t=&z=16&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
