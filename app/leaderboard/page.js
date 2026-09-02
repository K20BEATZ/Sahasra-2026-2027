'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function LeaderboardPage() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [votingId, setVotingId] = useState(null);

  // Countdown Timer State
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

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
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .order('votes', { ascending: false });

      if (error) throw error;
      setTeams(data || []);
    } catch (error) {
      console.error('Error fetching teams:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleVote = async (id, currentVotes) => {
    setVotingId(id);
    try {
      const { error } = await supabase
        .from('teams')
        .update({ votes: currentVotes + 1 })
        .eq('id', id);

      if (error) throw error;
      fetchTeams();
    } catch (error) {
      console.error('Error voting:', error);
    } finally {
      setVotingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-[#05060a] text-slate-100 p-6 md:p-12 relative overflow-hidden">
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10 space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest">
              Live Rankings
            </span>
            <h1 className="text-3xl md:text-5xl font-black bg-gradient-to-r from-amber-300 via-amber-400 to-amber-200 bg-clip-text text-transparent mt-3">
              LEADERBOARD
            </h1>
          </div>
          <Link href="/" className="text-xs text-slate-400 hover:text-amber-400 transition-colors border border-slate-800 bg-slate-900/80 px-4 py-2 rounded-xl">
            ← Back to Home
          </Link>
        </div>

        {/* Countdown Timer Box */}
        <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl backdrop-blur-xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-sm font-bold text-slate-200">Voting Time Remaining</h3>
            <p className="text-xs text-slate-400">Cast your votes before the timer runs out!</p>
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

        {/* Teams List & Voting */}
        {loading ? (
          <div className="text-center py-20 text-slate-400">Loading leaderboard...</div>
        ) : teams.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/50 border border-slate-800 rounded-3xl">
            <p className="text-slate-400 text-sm">No teams registered yet.</p>
            <Link href="/register" className="inline-block mt-4 bg-amber-500 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs">
              Register a Team
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {teams.map((team, index) => (
              <div 
                key={team.id || index}
                className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 backdrop-blur-xl shadow-xl transition-all hover:border-amber-500/50"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm ${
                    index === 0 ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/30' :
                    index === 1 ? 'bg-slate-300 text-slate-950' :
                    index === 2 ? 'bg-amber-700/50 text-amber-200' : 'bg-slate-800 text-slate-400'
                  }`}>
                    #{index + 1}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-100">{team.team_name}</h3>
                    <p className="text-xs text-amber-400/80 font-medium">{team.university}</p>
                    {team.members && team.members.length > 0 && (
                      <p className="text-[11px] text-slate-500 mt-1 max-w-md truncate">
                        Members: {team.members.filter(Boolean).join(', ')}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between w-full md:w-auto gap-6 border-t md:border-t-0 pt-3 md:pt-0 border-slate-800">
                  <div className="text-left md:text-right">
                    <span className="text-xl font-black text-amber-400">{team.votes || 0}</span>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest">Votes</p>
                  </div>
                  <button
                    onClick={() => handleVote(team.id, team.votes || 0)}
                    disabled={votingId === team.id}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50"
                  >
                    {votingId === team.id ? 'Voting...' : '🔥 Vote'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}