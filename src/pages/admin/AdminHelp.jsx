import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAdminAuth } from '../../context/AdminAuthContext';

const API = 'http://localhost:5000/api';

const AdminHelp = () => {
  const { adminToken } = useAdminAuth();

  const [faqs, setFaqs] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [searchFaq, setSearchFaq] = useState('');
  const [openFaq, setOpenFaq] = useState(null);

  // Ticket Form State
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('Broadcasting');
  const [priority, setPriority] = useState('Medium');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [ticketSuccess, setTicketSuccess] = useState('');
  const [ticketError, setTicketError] = useState('');

  // Fetch FAQs and Previous Tickets
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [faqRes, ticketRes] = await Promise.all([
          axios.get(`${API}/admin/help/faqs`, {
            headers: { Authorization: `Bearer ${adminToken}` },
          }),
          axios.get(`${API}/admin/help/tickets`, {
            headers: { Authorization: `Bearer ${adminToken}` },
          }),
        ]);
        setFaqs(faqRes.data.faqs || []);
        setTickets(ticketRes.data.tickets || []);
      } catch (err) {
        console.error('Failed to load help data:', err);
      }
    };
    fetchData();
  }, [adminToken]);

  const handleSubmitTicket = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTicketSuccess('');
    setTicketError('');

    try {
      const res = await axios.post(
        `${API}/admin/help/ticket`,
        { subject, category, priority, message },
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );
      setTicketSuccess(res.data.message || 'Ticket submitted successfully!');
      if (res.data.ticket) {
        setTickets((prev) => [res.data.ticket, ...prev]);
      }
      setSubject('');
      setMessage('');
      setTimeout(() => setTicketSuccess(''), 5000);
    } catch (err) {
      setTicketError(err?.response?.data?.message || 'Failed to submit ticket.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchFaq.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchFaq.toLowerCase()) ||
      faq.category.toLowerCase().includes(searchFaq.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Help Banner */}
      <div className="bg-gradient-to-r from-cyan-950/40 via-blue-950/30 to-violet-950/20 border border-cyan-500/20 rounded-2xl p-6 sm:p-8 relative overflow-hidden backdrop-blur-xl">
        <div className="absolute right-0 top-0 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 inline-block mb-3">
            Admin Support & Documentation
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            How can we help your broadcasting operations?
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            Explore frequent guides, configure streaming codecs, or submit an urgent support ticket directly to our engineers.
          </p>

          {/* FAQ Search Bar */}
          <div className="mt-5 relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchFaq}
              onChange={(e) => setSearchFaq(e.target.value)}
              placeholder="Search help topics, encoder setup, credentials..."
              className="w-full bg-white/[0.08] border border-white/[0.12] rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
            />
          </div>
        </div>
      </div>

      {/* Quick Documentation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.08] hover:border-cyan-500/30 rounded-2xl p-5 transition-all">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-3">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-white">Broadcasting Guide</h3>
          <p className="text-xs text-slate-400 mt-1">Complete setup guide for OBS, Mixxx, and hardware encoders.</p>
          <span className="text-xs text-cyan-400 font-medium inline-flex items-center gap-1 mt-3">
            Read docs →
          </span>
        </div>

        <div className="bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.08] hover:border-cyan-500/30 rounded-2xl p-5 transition-all">
          <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-400 mb-3">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-white">Audio Quality Tuning</h3>
          <p className="text-xs text-slate-400 mt-1">Optimize sample rate, loudness normalisation, and EQ filters.</p>
          <span className="text-xs text-violet-400 font-medium inline-flex items-center gap-1 mt-3">
            Best practices →
          </span>
        </div>

        <div className="bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.08] hover:border-cyan-500/30 rounded-2xl p-5 transition-all">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-3">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-white">Security & Permissions</h3>
          <p className="text-xs text-slate-400 mt-1">Learn how admin roles and login permissions are managed.</p>
          <span className="text-xs text-emerald-400 font-medium inline-flex items-center gap-1 mt-3">
            View guidelines →
          </span>
        </div>
      </div>

      {/* Main Grid: FAQs & Submit Ticket Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (7 Cols): FAQs Accordion */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Frequently Asked Questions</h2>
            <span className="text-xs text-slate-400">{filteredFaqs.length} questions found</span>
          </div>

          <div className="space-y-3">
            {filteredFaqs.map((faq) => {
              const isOpen = openFaq === faq.id;
              return (
                <div
                  key={faq.id}
                  className="bg-white/[0.03] border border-white/[0.08] hover:border-white/[0.14] rounded-xl overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                    className="w-full text-left p-4 flex items-center justify-between gap-3"
                  >
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-cyan-400 block mb-1">
                        {faq.category}
                      </span>
                      <span className="text-sm font-medium text-white">{faq.question}</span>
                    </div>
                    <div className={`w-6 h-6 rounded-lg bg-white/[0.05] flex items-center justify-center shrink-0 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-cyan-400' : ''}`}>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs text-slate-300 border-t border-white/[0.04] leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}

            {filteredFaqs.length === 0 && (
              <div className="text-center py-8 text-slate-400 text-xs bg-white/[0.02] rounded-xl border border-white/[0.06]">
                No FAQs matching "{searchFaq}". Submit a support inquiry below.
              </div>
            )}
          </div>
        </div>

        {/* Right Column (5 Cols): Submit Support Ticket Form */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/[0.06]">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Direct Support Inquiry</h3>
                <p className="text-[11px] text-slate-400">Our engineering desk responds within 1 hour</p>
              </div>
            </div>

            {ticketSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>{ticketSuccess}</span>
              </div>
            )}

            {ticketError && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{ticketError}</span>
              </div>
            )}

            <form onSubmit={handleSubmitTicket} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Icecast Stream Key Connection Issue"
                  required
                  className="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  >
                    <option value="Broadcasting" className="bg-[#0b101c]">Broadcasting</option>
                    <option value="Account & Access" className="bg-[#0b101c]">Account & Access</option>
                    <option value="Audio Stream Quality" className="bg-[#0b101c]">Audio Quality</option>
                    <option value="Billing & Limits" className="bg-[#0b101c]">Billing & Limits</option>
                    <option value="Other" className="bg-[#0b101c]">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  >
                    <option value="Low" className="bg-[#0b101c]">Low</option>
                    <option value="Medium" className="bg-[#0b101c]">Medium</option>
                    <option value="High" className="bg-[#0b101c]">High</option>
                    <option value="Urgent" className="bg-[#0b101c]">Urgent (Broadcast Down)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Detailed Description</label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Explain the error message, reproduction steps, or question..."
                  required
                  className="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium py-2.5 rounded-xl transition-all text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 disabled:opacity-50"
              >
                {submitting ? 'Submitting ticket...' : 'Submit Support Ticket'}
              </button>
            </form>
          </div>

          {/* Previous Tickets List */}
          {tickets.length > 0 && (
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5">
              <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
                Your Recent Tickets ({tickets.length})
              </h3>
              <div className="space-y-2.5">
                {tickets.slice(0, 3).map((t) => (
                  <div key={t._id} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-slate-200 truncate">{t.subject}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/10 text-cyan-400">
                        {t.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                      <span>{t.category}</span>
                      <span>·</span>
                      <span>{new Date(t.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminHelp;
