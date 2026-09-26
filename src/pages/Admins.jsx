import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API = 'http://localhost:5000/api';

/* ── Status badge ── */
const StatusBadge = ({ active }) => (
  <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border ${active ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' : 'bg-red-500/15 text-red-300 border-red-500/30'}`}>
    <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-emerald-400' : 'bg-red-400'}`} />
    {active ? 'Active' : 'Inactive'}
  </span>
);

/* ── Login Button ── */
const LoginBtn = ({ enabled, onChange }) => (
  <button
    onClick={onChange}
    title={enabled ? 'Revoke login access' : 'Grant login access'}
    className={`text-[11px] font-semibold px-3 py-1.5 rounded-lg border transition-all duration-200 ${
      enabled
        ? 'bg-violet-600/20 text-violet-300 border-violet-500/30 hover:bg-violet-600/30'
        : 'bg-white/[0.05] text-slate-400 border-white/[0.1] hover:bg-violet-600/20 hover:text-violet-300 hover:border-violet-500/30'
    }`}
  >
    Login
  </button>
);

/* ── Settings Dropdown (fixed position) ── */
const SettingsMenu = ({ admin, pos, onView, onEdit, onToggleStatus, onDelete, onClose }) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) onClose();
    };
    // Use setTimeout so the click that opened the menu isn't immediately caught
    const timer = setTimeout(() => document.addEventListener('mousedown', handler), 0);
    return () => { clearTimeout(timer); document.removeEventListener('mousedown', handler); };
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      style={{ top: pos.top + 8, right: window.innerWidth - pos.right }}
      className="fixed z-[200] w-44 bg-[#0e1120] border border-white/[0.12] rounded-xl shadow-2xl"
    >
      <button onClick={onView} className="flex items-center gap-2.5 w-full px-4 py-2.5 text-slate-300 hover:bg-white/[0.06] hover:text-white transition-colors text-sm rounded-t-xl">
        <svg className="w-3.5 h-3.5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
        View Details
      </button>
      <button onClick={onEdit} className="flex items-center gap-2.5 w-full px-4 py-2.5 text-slate-300 hover:bg-white/[0.06] hover:text-white transition-colors text-sm">
        <svg className="w-3.5 h-3.5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
        Edit
      </button>
      <button onClick={onToggleStatus} className="flex items-center gap-2.5 w-full px-4 py-2.5 text-slate-300 hover:bg-white/[0.06] hover:text-white transition-colors text-sm">
        {admin.isActive
          ? <><svg className="w-3.5 h-3.5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg> Deactivate</>
          : <><svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> Activate</>
        }
      </button>
      <div className="border-t border-white/[0.06]" />
      <button onClick={onDelete} className="flex items-center gap-2.5 w-full px-4 py-2.5 text-red-400 hover:bg-red-500/10 transition-colors text-sm rounded-b-xl">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
        Delete
      </button>
    </div>
  );
};

/* ── Input Field ── */
const Field = ({ label, id, type = 'text', value, onChange, placeholder, required }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-1.5">{label} {required && <span className="text-red-400">*</span>}</label>
    <input id={id} type={type} value={value} onChange={onChange} placeholder={placeholder} required={required}
      className="w-full bg-white/[0.06] border border-white/[0.1] rounded-xl px-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all"
    />
  </div>
);

/* ── Modal ── */
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-[#0e1120] border border-white/[0.1] rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.08]">
          <h3 className="text-white font-semibold text-lg">{title}</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

/* ── View Modal ── */
const ViewModal = ({ admin, onClose }) => {
  if (!admin) return null;
  const getInitials = (name) => name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || 'A';
  const avatarColors = ['from-violet-500 to-indigo-500','from-cyan-500 to-blue-500','from-pink-500 to-rose-500','from-amber-500 to-orange-500','from-emerald-500 to-teal-500'];
  const color = avatarColors[(admin.name?.charCodeAt(0) || 0) % avatarColors.length];
  const rows = [
    { label: 'Email',        value: admin.email },
    { label: 'Phone',        value: admin.phone || '—' },
    { label: 'Role',         value: admin.role },
    { label: 'Status',       value: admin.isActive ? 'Active' : 'Inactive' },
    { label: 'Login Access', value: admin.canLogin ? 'Granted' : 'Revoked' },
    { label: 'Joined',       value: new Date(admin.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) },
  ];
  return (
    <Modal isOpen={!!admin} onClose={onClose} title="Admin Details">
      <div className="text-center mb-6">
        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-white text-xl font-bold mx-auto mb-3`}>{getInitials(admin.name)}</div>
        <p className="text-white font-semibold text-lg">{admin.name}</p>
        <p className="text-slate-500 text-sm">{admin.email}</p>
      </div>
      <div className="space-y-3">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center justify-between py-2.5 border-b border-white/[0.05]">
            <span className="text-slate-500 text-sm">{r.label}</span>
            <span className="text-slate-200 text-sm font-medium capitalize">{r.value}</span>
          </div>
        ))}
      </div>
    </Modal>
  );
};

/* ── Delete Confirm Modal ── */
const DeleteModal = ({ admin, onConfirm, onClose }) => (
  <Modal isOpen={!!admin} onClose={onClose} title="Delete Admin">
    <div className="text-center">
      <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
        <svg className="w-7 h-7 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
      </div>
      <p className="text-white font-semibold mb-1">Delete {admin?.name}?</p>
      <p className="text-slate-400 text-sm mb-6">This action cannot be undone.</p>
      <div className="flex gap-3">
        <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-white/[0.1] text-slate-300 hover:bg-white/[0.05] transition-all text-sm font-medium">Cancel</button>
        <button onClick={() => onConfirm(admin._id)} className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white transition-all text-sm font-medium">Delete</button>
      </div>
    </div>
  </Modal>
);

/* ── Add / Edit Form ── */
const AdminForm = ({ initial, onSubmit, onClose, loading }) => {
  const [form, setForm] = useState({
    name:     initial?.name     || '',
    email:    initial?.email    || '',
    password: '',
    phone:    initial?.phone    || '',
    role:     initial?.role     || 'admin',
    isActive: initial?.isActive !== undefined ? initial.isActive : true,
  });
  const [showPwd, setShowPwd] = useState(false);
  const set = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));
  const isEdit = !!initial;

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...form };
    if (!payload.password) delete payload.password;
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Full Name" id="admin-name" value={form.name} onChange={set('name')} placeholder="John Doe" required />
        <Field label="Phone" id="admin-phone" value={form.phone} onChange={set('phone')} placeholder="+91 98765 43210" />
      </div>
      <Field label="Email Address" id="admin-email" type="email" value={form.email} onChange={set('email')} placeholder="admin@example.com" required />
      {/* Password */}
      <div>
        <label htmlFor="admin-password" className="block text-sm font-medium text-slate-300 mb-1.5">
          {isEdit ? 'New Password (leave blank to keep)' : 'Password'} {!isEdit && <span className="text-red-400">*</span>}
        </label>
        <div className="relative">
          <input id="admin-password" type={showPwd ? 'text' : 'password'} value={form.password} onChange={set('password')}
            placeholder="Min. 6 characters" required={!isEdit}
            className="w-full bg-white/[0.06] border border-white/[0.1] rounded-xl px-4 pr-11 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all"
          />
          <button type="button" onClick={() => setShowPwd((p) => !p)} tabIndex={-1}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors">
            {showPwd
              ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
              : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
            }
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Role <span className="text-red-400">*</span></label>
          <select id="admin-role" value={form.role} onChange={set('role')}
            className="w-full bg-white/[0.06] border border-white/[0.1] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all appearance-none cursor-pointer">
            <option value="admin" className="bg-[#0e1120]">Admin</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Status</label>
          <select id="admin-status" value={form.isActive ? 'active' : 'inactive'}
            onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.value === 'active' }))}
            className="w-full bg-white/[0.06] border border-white/[0.1] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all appearance-none cursor-pointer">
            <option value="active"   className="bg-[#0e1120]">Active</option>
            <option value="inactive" className="bg-[#0e1120]">Inactive</option>
          </select>
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-white/[0.1] text-slate-300 hover:bg-white/[0.05] transition-all text-sm font-medium">Cancel</button>
        <button id="admin-form-submit" type="submit" disabled={loading}
          className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-sm transition-all disabled:opacity-60 flex items-center justify-center gap-2">
          {loading ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Saving...</> : (isEdit ? 'Update Admin' : 'Create Admin')}
        </button>
      </div>
    </form>
  );
};

/* ══════════════════════════════════════════
   MAIN ADMINS PAGE
══════════════════════════════════════════ */
const Admins = () => {
  const { token } = useAuth();
  const headers   = { Authorization: `Bearer ${token}` };

  const [admins,       setAdmins]       = useState([]);
  const [stats,        setStats]        = useState({ total: 0, active: 0, inactive: 0 });
  const [loading,      setLoading]      = useState(true);
  const [formLoading,  setFormLoading]  = useState(false);
  const [search,       setSearch]       = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showAdd,      setShowAdd]      = useState(false);
  const [editAdmin,    setEditAdmin]    = useState(null);
  const [viewAdmin,    setViewAdmin]    = useState(null);
  const [deleteAdmin,  setDeleteAdmin]  = useState(null);
  const [openMenu,     setOpenMenu]     = useState(null);
  const [openMenuPos,  setOpenMenuPos]  = useState({ top: 0, right: 0 });
  const [toast,        setToast]        = useState(null);
  const [error,        setError]        = useState('');

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchAdmins = useCallback(async () => {
    try {
      setLoading(true); setError('');
      const params = new URLSearchParams();
      if (search)       params.set('search', search);
      if (statusFilter) params.set('status', statusFilter);
      const res = await axios.get(`${API}/admins?${params}`, { headers });
      setAdmins(res.data.admins);
      setStats(res.data.stats);
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to load admins.');
    } finally { setLoading(false); }
  }, [search, statusFilter, token]);

  useEffect(() => { fetchAdmins(); }, [fetchAdmins]);

  const handleCreate = async (data) => {
    try {
      setFormLoading(true);
      await axios.post(`${API}/admins`, data, { headers });
      setShowAdd(false); showToast('Admin created successfully!'); fetchAdmins();
    } catch (e) { showToast(e?.response?.data?.message || 'Failed to create admin.', 'error'); }
    finally { setFormLoading(false); }
  };

  const handleUpdate = async (data) => {
    try {
      setFormLoading(true);
      await axios.put(`${API}/admins/${editAdmin._id}`, data, { headers });
      setEditAdmin(null); showToast('Admin updated successfully!'); fetchAdmins();
    } catch (e) { showToast(e?.response?.data?.message || 'Failed to update admin.', 'error'); }
    finally { setFormLoading(false); }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/admins/${id}`, { headers });
      setDeleteAdmin(null); showToast('Admin deleted.'); fetchAdmins();
    } catch (e) { showToast('Failed to delete.', 'error'); }
  };

  const handleToggleStatus = async (id) => {
    try {
      const res = await axios.patch(`${API}/admins/${id}/toggle`, {}, { headers });
      showToast(res.data.message); fetchAdmins();
    } catch { showToast('Failed to toggle status.', 'error'); }
  };

  const handleLoginToggle = async (id) => {
    try {
      const res = await axios.patch(`${API}/admins/${id}/login-toggle`, {}, { headers });
      showToast(res.data.message); fetchAdmins();
    } catch { showToast('Failed to update login access.', 'error'); }
  };

  const getInitials = (name) => name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || 'A';
  const avatarColors = ['from-violet-500 to-indigo-500','from-cyan-500 to-blue-500','from-pink-500 to-rose-500','from-amber-500 to-orange-500','from-emerald-500 to-teal-500'];
  const getColor = (name) => avatarColors[(name?.charCodeAt(0) || 0) % avatarColors.length];

  return (
    <div className="p-8 space-y-6">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-xl border shadow-2xl ${toast.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-red-500/10 border-red-500/30 text-red-300'}`}>
          {toast.type === 'success'
            ? <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            : <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>}
          <span className="text-sm font-medium">{toast.msg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-2xl font-bold">Admin Management</h1>
          <p className="text-slate-500 text-sm mt-1">Manage all platform administrators</p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/admin-dashboard"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/25 text-cyan-400 font-semibold text-sm transition-all"
            title="Open Admin Dashboard in new tab"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Open Admin Dashboard
          </a>
          <button id="add-admin-btn" onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-violet-500/20">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Add Admin
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Admins',    value: stats.total,    color: 'border-violet-500/20 from-violet-500/10', icon: '👥' },
          { label: 'Active Admins',   value: stats.active,   color: 'border-emerald-500/20 from-emerald-500/10', icon: '✅' },
          { label: 'Inactive Admins', value: stats.inactive, color: 'border-red-500/20 from-red-500/10', icon: '⛔' },
        ].map((s) => (
          <div key={s.label} className={`bg-gradient-to-br ${s.color} to-transparent border ${s.color.split(' ')[0]} rounded-2xl p-5`}>
            <div className="text-2xl mb-1">{s.icon}</div>
            <p className="text-3xl font-bold text-white">{s.value}</p>
            <p className="text-slate-400 text-sm mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input id="admin-search" type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition-all" />
        </div>
        <select id="status-filter" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition-all appearance-none cursor-pointer">
          <option value=""         className="bg-[#0e1120]">All Status</option>
          <option value="active"   className="bg-[#0e1120]">Active</option>
          <option value="inactive" className="bg-[#0e1120]">Inactive</option>
        </select>
        <button onClick={fetchAdmins} title="Refresh"
          className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-slate-400 hover:text-white transition-all">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="grid gap-3 px-5 py-3.5 border-b border-white/[0.06] bg-white/[0.02] text-slate-500 text-xs font-semibold uppercase tracking-wider"
          style={{ gridTemplateColumns: '40px 2fr 2fr 1fr 90px 1fr 1fr 48px' }}>
          <p>SR</p><p>Admin</p><p>Email</p><p>Role</p><p>Login</p><p>Status</p><p>Joined</p>
          <p className="text-center">
            <svg className="w-4 h-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          </p>
        </div>

        {/* Body */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-red-400 text-sm">{error}</p>
            <button onClick={fetchAdmins} className="mt-3 text-violet-400 text-sm hover:underline">Retry</button>
          </div>
        ) : admins.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-14 h-14 rounded-2xl bg-white/[0.05] flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            </div>
            <p className="text-slate-400 font-medium">No admins found</p>
          </div>
        ) : (
          admins.map((admin, idx) => (
            <div key={admin._id}
              className={`grid gap-3 items-center px-5 py-4 hover:bg-white/[0.03] transition-colors relative ${idx !== admins.length - 1 ? 'border-b border-white/[0.05]' : ''}`}
              style={{ gridTemplateColumns: '40px 2fr 2fr 1fr 90px 1fr 1fr 48px' }}>

              {/* SR No. */}
              <p className="text-slate-600 text-sm font-semibold">{idx + 1}</p>

              {/* Name */}
              <div className="flex items-center gap-2.5 min-w-0">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${getColor(admin.name)} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                  {getInitials(admin.name)}
                </div>
                <p className="text-white text-sm font-medium truncate">{admin.name}</p>
              </div>

              {/* Email */}
              <p className="text-slate-400 text-sm truncate">{admin.email}</p>

              {/* Role */}
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full border capitalize bg-violet-500/15 text-violet-300 border-violet-500/30 w-fit">
                {admin.role}
              </span>

              {/* Login btn */}
              <div>
                <LoginBtn enabled={admin.canLogin} onChange={() => handleLoginToggle(admin._id)} />
              </div>

              {/* Status */}
              <div><StatusBadge active={admin.isActive} /></div>

              {/* Joined */}
              <p className="text-slate-500 text-xs">
                {new Date(admin.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
              </p>

              {/* Settings gear */}
              <div className="flex justify-center">
                <button
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    if (openMenu === admin._id) {
                      setOpenMenu(null);
                    } else {
                      setOpenMenu(admin._id);
                      setOpenMenuPos({ top: rect.bottom, right: rect.right });
                    }
                  }}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/[0.08] transition-all"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modals */}
      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Add New Admin">
        <AdminForm onSubmit={handleCreate} onClose={() => setShowAdd(false)} loading={formLoading} />
      </Modal>

      <Modal isOpen={!!editAdmin} onClose={() => setEditAdmin(null)} title="Edit Admin">
        {editAdmin && <AdminForm initial={editAdmin} onSubmit={handleUpdate} onClose={() => setEditAdmin(null)} loading={formLoading} />}
      </Modal>

      <ViewModal admin={viewAdmin} onClose={() => setViewAdmin(null)} />
      <DeleteModal admin={deleteAdmin} onConfirm={handleDelete} onClose={() => setDeleteAdmin(null)} />

      {/* Settings dropdown — rendered at page level to avoid clipping */}
      {openMenu && (() => {
        const admin = admins.find((a) => a._id === openMenu);
        return admin ? (
          <SettingsMenu
            admin={admin}
            pos={openMenuPos}
            onView={() => { setViewAdmin(admin); setOpenMenu(null); }}
            onEdit={() => { setEditAdmin(admin); setOpenMenu(null); }}
            onToggleStatus={() => { handleToggleStatus(admin._id); setOpenMenu(null); }}
            onDelete={() => { setDeleteAdmin(admin); setOpenMenu(null); }}
            onClose={() => setOpenMenu(null)}
          />
        ) : null;
      })()}
    </div>
  );
};

export default Admins;
