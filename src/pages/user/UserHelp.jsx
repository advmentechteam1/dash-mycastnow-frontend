import { useState, useEffect } from 'react';
import axios from 'axios';
import { useUserAuth } from '../../context/UserAuthContext';

const API_BASE = 'http://localhost:5000/api';

const UserHelp = () => {
  const { userToken } = useUserAuth();

  const [faqs, setFaqs] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [openFaq, setOpenFaq] = useState(null);
  const [loading, setLoading] = useState(true);

  // New ticket state
  const [ticketData, setTicketData] = useState({
    subject: '',
    category: 'Audio Playback & Streaming',
    priority: 'Medium',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [ticketSuccess, setTicketSuccess] = useState('');
  const [ticketError, setTicketError] = useState('');

  const fetchHelpData = async () => {
    try {
      const [faqRes, ticketsRes] = await Promise.all([
        axios.get(`${API_BASE}/user/help/faqs`, { headers: { Authorization: `Bearer ${userToken}` } }),
        axios.get(`${API_BASE}/user/help/tickets`, { headers: { Authorization: `Bearer ${userToken}` } }),
      ]);
      setFaqs(faqRes.data.faqs || []);
      setTickets(ticketsRes.data.tickets || []);
    } catch (err) {
      console.error('Fetch help error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userToken) fetchHelpData();
  }, [userToken]);

  const handleTicketSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTicketSuccess('');
    setTicketError('');

    try {
      const res = await axios.post(`${API_BASE}/user/help/ticket`, ticketData, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      setTicketSuccess(res.data.message || 'Support ticket submitted!');
      setTicketData({
        subject: '',
        category: 'Audio Playback & Streaming',
        priority: 'Medium',
        message: '',
      });
      // refresh tickets
      fetchHelpData();
      setTimeout(() => setTicketSuccess(''), 5000);
    } catch (err) {
      setTicketError(err?.response?.data?.message || 'Failed to submit ticket.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-4 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin" />
          <p className="text-slate-400 text-sm">Loading Listener Help Center...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Listener Help & Support</h1>
        <p className="text-slate-400 text-sm mt-1">Frequently asked questions, playback troubleshooting, and direct support tickets</p>
      </div>

      {/* Quick Help Channels */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.07] hover:border-emerald-500/30 transition-all">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-white">Email Listener Support</h3>
          <p className="text-xs text-slate-400 mt-1">support@mycastnow.com</p>
          <span className="text-[11px] text-emerald-400 mt-2 block font-medium">Average reply &lt; 2 hours</span>
        </div>

        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.07] hover:border-teal-500/30 transition-all">
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 mb-3">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-white">Community & Discord</h3>
          <p className="text-xs text-slate-400 mt-1">Join 40K+ audio enthusiasts</p>
          <span className="text-[11px] text-teal-400 mt-2 block font-medium">discord.gg/mycastnow</span>
        </div>

        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.07] hover:border-cyan-500/30 transition-all">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-3">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-white">Audio Docs & Guides</h3>
          <p className="text-xs text-slate-400 mt-1">Bitrates, caching & apps</p>
          <span className="text-[11px] text-cyan-400 mt-2 block font-medium">docs.mycastnow.com</span>
        </div>
      </div>

      {/* Main Grid: FAQ Accordion + Submit Ticket */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
        {/* FAQs */}
        <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-6 space-y-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Quick solutions for common listener inquiries</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq) => {
              const isOpen = openFaq === faq.id;
              return (
                <div
                  key={faq.id}
                  className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                    className="w-full text-left p-4 flex items-center justify-between gap-3 hover:bg-white/[0.03] transition-colors"
                  >
                    <span className="text-sm font-semibold text-white">{faq.question}</span>
                    <span className="text-emerald-400 text-lg shrink-0">{isOpen ? '−' : '+'}</span>
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs text-slate-300 leading-relaxed border-t border-white/[0.04]">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Create Ticket Form */}
        <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-6 space-y-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-400" />
              Submit a Support Ticket
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Need help with playback, billing or an episode? Send a request</p>
          </div>

          {ticketSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
              <span>✓</span>
              <span>{ticketSuccess}</span>
            </div>
          )}

          {ticketError && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-center gap-2">
              <span>⚠</span>
              <span>{ticketError}</span>
            </div>
          )}

          <form onSubmit={handleTicketSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Subject</label>
              <input
                type="text"
                value={ticketData.subject}
                onChange={(e) => setTicketData({ ...ticketData, subject: e.target.value })}
                placeholder="e.g. Episode buffering stopped at 12:40"
                required
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
                <select
                  value={ticketData.category}
                  onChange={(e) => setTicketData({ ...ticketData, category: e.target.value })}
                  className="w-full bg-[#121820] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                >
                  <option value="Audio Playback & Streaming">Audio Playback & Streaming</option>
                  <option value="Offline Download & Cache">Offline Download & Cache</option>
                  <option value="Creator Subscription & Alerts">Creator Subscription & Alerts</option>
                  <option value="Account & Login">Account & Login</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Priority</label>
                <select
                  value={ticketData.priority}
                  onChange={(e) => setTicketData({ ...ticketData, priority: e.target.value })}
                  className="w-full bg-[#121820] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Description / Error Details</label>
              <textarea
                rows={3}
                value={ticketData.message}
                onChange={(e) => setTicketData({ ...ticketData, message: e.target.value })}
                placeholder="Please describe what happened, show name, and device..."
                required
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white text-sm font-semibold shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-60"
            >
              {submitting ? 'Submitting ticket...' : 'Submit Support Request'}
            </button>
          </form>
        </div>
      </div>

      {/* Previous Tickets Section */}
      <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white">Your Support Tickets ({tickets.length})</h2>
            <p className="text-xs text-slate-400 mt-0.5">Track open queries and resolution status</p>
          </div>
          <button
            onClick={fetchHelpData}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-medium px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 transition-colors"
          >
            Refresh
          </button>
        </div>

        {tickets.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-white/[0.08] rounded-xl">
            <p className="text-slate-400 text-xs">You have no submitted tickets yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tickets.map((t) => (
              <div
                key={t._id}
                className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded ${
                        t.status === 'Resolved'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : t.status === 'In Progress'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-cyan-500/20 text-cyan-300'
                      }`}
                    >
                      {t.status}
                    </span>
                    <span className="text-[11px] text-slate-400">#{t.ticketId || t._id.slice(-6)}</span>
                    <span className="text-[11px] text-slate-500">· {t.category}</span>
                  </div>
                  <p className="text-sm font-semibold text-white">{t.subject}</p>
                  <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{t.message}</p>
                </div>

                <div className="text-xs text-slate-500 shrink-0">
                  {new Date(t.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserHelp;
