'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

// Advanced Passwords සමඟ සකස් කළ Coordinator Credentials ලැයිස්තුව
const ADMIN_CREDENTIALS = [
  { id: 'main_boy', pass: 'Sah@sra#2026_SecureKey!99', role: 'Main Coordinator (Boy)' },
  { id: 'main_girl', pass: 'Admin_Portal$2026#X9v', role: 'Main Coordinator (Girl)' },
  { id: 'event_boy1', pass: 'Rajarata#System_2026_Key!77', role: 'Event Coordinator (Boy 1)' },
  { id: 'event_boy2', pass: 'Sahasra_SuperAdmin*2026%Pass', role: 'Event Coordinator (Boy 2)' },
  { id: 'event_girl', pass: 'Sah@sra#2026_SecureKey!99', role: 'Event Coordinator (Girl)' },
  { id: 'doc_boy', pass: 'Admin_Portal$2026#X9v', role: 'Documentary Coordinator (Boy)' },
  { id: 'doc_girl', pass: 'Rajarata#System_2026_Key!77', role: 'Documentary Coordinator (Girl)' },
  { id: 'admin_root', pass: 'Sahasra_SuperAdmin*2026%Pass', role: 'Super Admin' }
];

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentRole, setCurrentRole] = useState('');
  const [inputId, setInputId] = useState('');
  const [inputPass, setInputPass] = useState('');
  const [loginError, setLoginError] = useState('');

  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError('');

    const matched = ADMIN_CREDENTIALS.find(
      (cred) => cred.id === inputId.trim() && cred.pass === inputPass.trim()
    );

    if (matched) {
      setIsLoggedIn(true);
      setCurrentRole(matched.role);
    } else {
      setLoginError('Invalid Coordinator ID or Password!');
    }
  };

  useEffect(() => {
    const targetDate = new Date('2026-12-31T23:59:59').getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .order('votes', { ascending: false });

      if (error) {
        console.error('Supabase error details:', error.message || error);
        throw error;
      }
      setTeams(data || []);
    } catch (error) {
      console.error('Error fetching teams:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchTeams();
    }
  }, [isLoggedIn]);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this team?')) return;

    try {
      const { error } = await supabase.from('teams').delete().eq('id', id);
      if (error) throw error;
      fetchTeams();
    } catch (error) {
      console.error('Error deleting team:', error);
    }
  };

  if (!isLoggedIn) {
    return (
      <main className="min-h-screen bg-[#05060a] text-slate-100 flex flex-col justify-center items-center p-6 relative overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-md w-full bg-slate-900/85 border border-slate-800 p-8 rounded-3xl shadow-2xl relative z-10 backdrop-blur-xl">
          <div className="flex justify-between items-center mb-6">
            <div>
              <span className="bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                Secure Portal
              </span>
              <h1 className="text-2xl font-black bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent mt-2">
                Coordinator Login
              </h1>
            </div>
            <Link href="/" className="text-xs text-slate-400 hover:text-amber-400 transition-colors">
              ← Home
            </Link>
          </div>

          {loginError && (
            <div className="p-3 rounded-xl text-xs mb-4 text-center font-medium bg-red-500/10 border border-red-500/30 text-red-400">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Coordinator ID</label>
              <input
                type="text"
                required
                value={inputId}
                onChange={(e) => setInputId(e.target.value)}
                placeholder="Enter assigned ID"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Advanced Password</label>
              <input
                type="password"
                required
                value={inputPass}
                onChange={(e) => setInputPass(e.target.value)}
                placeholder="Enter secure password"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 rounded-xl transition-all shadow-lg shadow-amber-500/20 mt-2"
            >
              Login to Portal
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#05060a] text-slate-100 p-6 md:p-12 relative overflow-hidden">
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10 space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest">
              {currentRole}
            </span>
            <h1 className="text-3xl md:text-5xl font-black bg-gradient-to-r from-amber-300 via-amber-400 to-amber-200 bg-clip-text text-transparent mt-3">
              MANAGEMENT PORTAL
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsLoggedIn(false)}
              className="text-xs text-red-400 hover:text-red-300 transition-colors border border-red-500/30 bg-red-500/10 px-4 py-2 rounded-xl font-semibold"
            >
              Logout
            </button>
            <Link href="/" className="text-xs text-slate-400 hover:text-amber-400 transition-colors border border-slate-800 bg-slate-900/80 px-4 py-2 rounded-xl">
              ← Home
            </Link>
          </div>
        </div>

        {/* Countdown Timer Box */}
        <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl backdrop-blur-xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-sm font-bold text-slate-200">Voting Ends In</h3>
            <p className="text-xs text-slate-400">Competition schedule closure countdown</p>
          </div>
          <div className="grid grid-cols-4 gap-3 text-center">
            <div className="bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl min-w-[60px]">
              <span className="text-lg font-black text-amber-400">{timeLeft.days}</span>
              <p className="text-[10px] text-slate-500 uppercase">Days</p>
            </div>
            <div className="bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl min-w-[60px]">
              <span className="text-lg font-black text-amber-400">{timeLeft.hours}</span>
              <p className="text-[10px] text-slate-500 uppercase">Hours</p>
            </div>
            <div className="bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl min-w-[60px]">
              <span className="text-lg font-black text-amber-400">{timeLeft.minutes}</span>
              <p className="text-[10px] text-slate-500 uppercase">Mins</p>
            </div>
            <div className="bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl min-w-[60px]">
              <span className="text-lg font-black text-amber-400">{timeLeft.seconds}</span>
              <p className="text-[10px] text-slate-500 uppercase">Secs</p>
            </div>
          </div>
        </div>

        {/* Teams Management */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-200">Registered Teams Control Panel</h2>
          {loading ? (
            <div className="text-center py-20 text-slate-400">Loading teams...</div>
          ) : teams.length === 0 ? (
            <div className="text-center py-20 bg-slate-900/50 border border-slate-800 rounded-3xl text-slate-400 text-sm">
              No registered teams found.
            </div>
          ) : (
            <div className="space-y-3">
              {teams.map((team) => (
                <div 
                  key={team.id}
                  className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 backdrop-blur-xl"
                >
                  <div>
                    <h3 className="text-sm font-bold text-slate-100">{team.team_name}</h3>
                    <p className="text-xs text-amber-400 font-medium">{team.university}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Votes: <span className="text-slate-300 font-bold">{team.votes || 0}</span></p>
                  </div>
                  <button
                    onClick={() => handleDelete(team.id)}
                    className="bg-red-500/10 hover:bg-red-500 border border-red-500/30 hover:border-red-500 text-red-400 hover:text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition-all"
                  >
                    Delete Team
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}