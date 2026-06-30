import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Send, CheckCircle } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', phone: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', phone: '', subject: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-mint font-sans">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-green hover:text-green/80 mb-8 font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        
        <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-sm border border-sage">
          <h1 className="text-3xl font-display font-bold text-slate mb-2">Enquiry</h1>
          <p className="text-slate/80 mb-8">Send us an enquiry and our team will get back to you shortly.</p>

          {status === 'success' ? (
            <div className="bg-mint border border-sage rounded-2xl p-6 text-center text-green flex flex-col items-center">
              <CheckCircle className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-bold font-display">Enquiry Sent!</h3>
              <p className="text-sm mt-2 text-slate/80">We have received your message and will reach out soon.</p>
              <button onClick={() => setStatus('idle')} className="mt-6 px-6 py-2 bg-green text-white rounded-full text-sm font-medium hover:bg-green/90">
                Send Another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate mb-2">Your Name</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-sage/50 bg-mint/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green/20 focus:border-green transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate mb-2">Phone Number</label>
                  <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-sage/50 bg-mint/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green/20 focus:border-green transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate mb-2">Subject</label>
                <input required type="text" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-sage/50 bg-mint/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green/20 focus:border-green transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate mb-2">Message</label>
                <textarea required rows={5} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-sage/50 bg-mint/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green/20 focus:border-green transition-all resize-none"></textarea>
              </div>
              {status === 'error' && <p className="text-red-500 text-sm">Failed to send enquiry. Please try again.</p>}
              <button disabled={status === 'submitting'} type="submit" className="w-full flex items-center justify-center gap-2 bg-green text-white py-4 rounded-xl font-bold hover:bg-green/90 transition-colors disabled:opacity-70">
                {status === 'submitting' ? 'Sending...' : 'Send Message'} <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
