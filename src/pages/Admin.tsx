import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, LogOut, ArrowLeft, Calendar, MessageSquare } from 'lucide-react';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'appointments' | 'enquiries'>('appointments');
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [appointments, setAppointments] = useState<any[]>([]);
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [enquiryToDelete, setEnquiryToDelete] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsAuthenticated(true);
      fetchData(token);
    }
    setLoading(false);
  }, []);

  const fetchData = async (token: string) => {
    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      
      const appRes = await fetch('/api/admin/appointments', { headers });
      if (!appRes.ok) throw new Error('Not authorized or failed to fetch appointments');
      const appData = await appRes.json();
      setAppointments(appData);

      const inqRes = await fetch('/api/admin/enquiries', { headers });
      if (inqRes.ok) {
        setEnquiries(await inqRes.json());
      }
    } catch (err: any) {
      setError(err.message);
      setIsAuthenticated(false);
      localStorage.removeItem('adminToken');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('adminToken', data.token);
        setIsAuthenticated(true);
        fetchData(data.token);
      } else {
        const errData = await res.json();
        setError(errData.error || 'Login failed');
      }
    } catch (err: any) {
      setError('Network error');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
  };

  const handleUpdateStatus = async (id: number, status: string) => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;
    try {
      const res = await fetch(`/api/admin/appointments/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setAppointments(apps => apps.map(a => a.id === id ? { ...a, status } : a));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const confirmDeleteEnquiry = async () => {
    if (enquiryToDelete === null) return;
    
    const token = localStorage.getItem('adminToken');
    if (!token) return;
    try {
      const res = await fetch(`/api/admin/enquiries/${enquiryToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        setEnquiries(inqs => inqs.filter(i => i.id !== enquiryToDelete));
        setEnquiryToDelete(null);
      } else {
        console.error('Failed to delete enquiry');
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="min-h-screen bg-mint flex items-center justify-center font-sans">Loading...</div>;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-mint font-sans flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-sage max-w-sm w-full text-center">
          <ShieldCheck className="w-12 h-12 text-green mx-auto mb-4" />
          <h2 className="text-2xl font-bold font-display text-slate mb-2">Admin Portal</h2>
          <p className="text-slate/80 mb-6 text-sm">Please sign in with your credentials.</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input 
                type="text" 
                placeholder="Username" 
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-sage/50 bg-mint/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green/20 focus:border-green transition-all"
                required
              />
            </div>
            <div>
              <input 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-sage/50 bg-mint/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green/20 focus:border-green transition-all"
                required
              />
            </div>
            <button type="submit" className="w-full bg-green text-white py-3 rounded-xl font-medium hover:bg-green/90 transition-colors">
              Sign In
            </button>
          </form>
          
          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
          <div className="mt-8">
            <Link to="/" className="text-sm text-green hover:underline">Back to Home</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mint font-sans">
      <div className="bg-white border-b border-sage sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-slate hover:text-green">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="font-bold text-slate text-lg">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="hidden sm:inline text-slate/80">Admin</span>
            <button onClick={handleLogout} className="flex items-center gap-1.5 text-red-500 hover:text-red-600 font-medium">
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200">
            {error} (Make sure your account has the 'admin' role in the database)
          </div>
        ) : (
          <div className="bg-white rounded-[32px] border border-sage overflow-hidden shadow-sm">
            <div className="flex border-b border-sage">
              <button 
                onClick={() => setActiveTab('appointments')}
                className={`flex-1 py-4 px-6 text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 ${activeTab === 'appointments' ? 'bg-mint text-green border-b-2 border-green' : 'text-slate/60 hover:bg-slate/5'}`}
              >
                <Calendar className="w-4 h-4" /> Appointments
              </button>
              <button 
                onClick={() => setActiveTab('enquiries')}
                className={`flex-1 py-4 px-6 text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 ${activeTab === 'enquiries' ? 'bg-mint text-green border-b-2 border-green' : 'text-slate/60 hover:bg-slate/5'}`}
              >
                <MessageSquare className="w-4 h-4" /> Enquiries
              </button>
            </div>

            <div className="p-6 overflow-x-auto">
              {activeTab === 'appointments' && (
                <div className="space-y-4">
                  <div className="bg-yellow-50 text-yellow-800 p-3 rounded-lg border border-yellow-200 text-sm flex items-center gap-2">
                    <span className="font-bold uppercase tracking-wider text-xs bg-yellow-200 px-2 py-0.5 rounded text-yellow-900">Note</span> 
                    Patient appointment data is automatically cleared from the database 5 days after the appointment date.
                  </div>
                  <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-sage text-slate/60 text-sm">
                      <th className="py-3 px-4 font-medium">Date & Time</th>
                      <th className="py-3 px-4 font-medium">Patient</th>
                      <th className="py-3 px-4 font-medium">Contact</th>
                      <th className="py-3 px-4 font-medium">Status</th>
                      <th className="py-3 px-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.length === 0 ? (
                      <tr><td colSpan={5} className="py-8 text-center text-slate/50">No appointments found.</td></tr>
                    ) : appointments.map(app => (
                      <tr key={app.id} className="border-b border-sage/30 hover:bg-mint/30">
                        <td className="py-4 px-4">
                          <div className="font-medium text-slate">{app.date}</div>
                          <div className="text-sm text-slate/70">{app.time}</div>
                        </td>
                        <td className="py-4 px-4 text-slate">
                          <div className="font-bold">{app.patientName}</div>
                          {app.reason && <div className="text-xs text-slate/60 mt-1 max-w-[200px] truncate">{app.reason}</div>}
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm text-slate">{app.phone}</div>
                          <div className="text-sm text-slate/70">{app.email}</div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${app.status === 'confirmed' ? 'bg-green/10 text-green' : app.status === 'cancelled' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-700'}`}>
                            {app.status}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <select 
                            value={app.status}
                            onChange={(e) => handleUpdateStatus(app.id, e.target.value)}
                            className="bg-white border border-sage rounded-lg px-2 py-1 text-sm focus:outline-none focus:border-green"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirm</option>
                            <option value="cancelled">Cancel</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
              )}

              {activeTab === 'enquiries' && (
                <div className="space-y-4">
                  <div className="bg-yellow-50 text-yellow-800 p-3 rounded-lg border border-yellow-200 text-sm flex items-center gap-2">
                    <span className="font-bold uppercase tracking-wider text-xs bg-yellow-200 px-2 py-0.5 rounded text-yellow-900">Note</span> 
                    Enquiry data is automatically cleared from the database 10 days after the creation date.
                  </div>
                  <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-sage text-slate/60 text-sm">
                      <th className="py-3 px-4 font-medium">Date</th>
                      <th className="py-3 px-4 font-medium">Sender</th>
                      <th className="py-3 px-4 font-medium">Subject</th>
                      <th className="py-3 px-4 font-medium">Message</th>
                      <th className="py-3 px-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enquiries.length === 0 ? (
                      <tr><td colSpan={5} className="py-8 text-center text-slate/50">No enquiries found.</td></tr>
                    ) : enquiries.map(inq => (
                      <tr key={inq.id} className="border-b border-sage/30 hover:bg-mint/30">
                        <td className="py-4 px-4 text-sm text-slate/80">{new Date(inq.createdAt).toLocaleDateString()}</td>
                        <td className="py-4 px-4">
                          <div className="font-bold text-slate">{inq.name}</div>
                          <div className="text-sm text-slate/70">{inq.phone}</div>
                        </td>
                        <td className="py-4 px-4 font-medium text-slate">{inq.subject}</td>
                        <td className="py-4 px-4 text-sm text-slate/80 max-w-xs truncate" title={inq.message}>{inq.message}</td>
                        <td className="py-4 px-4">
                          <button
                            onClick={() => setEnquiryToDelete(inq.id)}
                            className="text-red-500 hover:text-red-700 text-sm font-medium px-3 py-1 rounded-lg border border-red-200 hover:bg-red-50 transition-colors"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {enquiryToDelete !== null && (
        <div className="fixed inset-0 bg-slate/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-lg border border-sage text-center">
            <h3 className="text-xl font-bold text-slate mb-4">Confirm Deletion</h3>
            <p className="text-slate/80 mb-8">Are you sure you want to delete this enquiry? This action cannot be undone.</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setEnquiryToDelete(null)}
                className="px-6 py-2 rounded-full border border-sage text-slate font-medium hover:bg-mint transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteEnquiry}
                className="px-6 py-2 rounded-full bg-red-500 text-white font-medium hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
