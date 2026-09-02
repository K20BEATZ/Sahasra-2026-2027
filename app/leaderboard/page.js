'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function LeaderboardPage() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [votingId, setVotingId] = useState(null);

  // Admin පාලක පුවරුවෙන් පාලනය වන ස්ටේටස්
  const [isOpen, setIsOpen] = useState(true);
  const [deadline, setDeadline] = useState(null);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [votingEnded, setVotingEnded] = useState(false);

  // ඩේටා සහ සෙටින්ග්ස් ලබා ගැනීම (Real-time වගේ හැම තිස්සෙම චෙක් වේ)
  const fetchData = async () => {
    try {
      setLoading(true);

      // 1. Admin Settings ලබා ගැනීම (is_open සහ deadline)
      const { data: settingsData } = await supabase
        .from('voting_settings')
        .select('*')
        .eq('id', 1)
        .single();

      if (settingsData) {
        setIsOpen(settingsData.is_open);
        setDeadline(settingsData.deadline);
      }

      // 2. ටීම් ලැයිස්තුව ලබා ගැනීම
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .order('votes', { ascending: false });

      if (error) throw error;
      setTeams(data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // තත්පර 3කට වරක් Admin Settings ස්වයංක්‍රීයව චෙක් කිරීම (Admin Close කළ සැණින් යුසර්ගේ පේජ් එකද ක්ෂණිකව වැසීමට)
    const intervalCheck = setInterval(() => {
      fetchData();
    }, 3000);

    return () => clearInterval(intervalCheck);
  }, []);

  // Admin ඩෙඩ්ලයින් එකට සමානව ක්‍රියාත්මක වන Live Countdown ටයිමර් එක
  useEffect(() => {
    if (!deadline) return;

    const targetDate = new Date(deadline).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
        setVotingEnded(false);
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setVotingEnded(true);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [deadline]);

  // IP Restriction සහ ඡන්දය සටහන් කිරීම
  const handleVote = async (id, currentVotes) => {
    // Admin විසින් Close කර ඇත්නම් හෝ ටයිමර් එක අවසන් නම්
    if (!isOpen || votingEnded) {
      alert('⚠️ Voting is currently closed by administrators!');
      return;
    }

    setVotingId(id);
    try {
      // 1. යුසර්ගේ IP Address එක ලබා ගැනීම
      let userIp = 'unknown_ip';
      try {
        const ipRes = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipRes.json();
        userIp = ipData.ip;
      } catch (err) {
        console.warn('Could not fetch IP');
      }

      // 2. මෙම IP එකෙන් මීට පෙර ඡන්දයක් දී ඇත්දැයි පරීක්ෂා කිරීම
      const { data: existingVotes, error: checkError } = await supabase
        .from('votes')
        .select('*')
        .eq('ip_address', userIp);

      if (checkError) throw checkError;

      if (existingVotes && existingVotes.length > 0) {
        alert('❌ You have already cast your vote from this device/network! Multiple votes are not allowed.');
        setVotingId(null);
        return;
      }

      // 3. votes ටේබල් එකට IP එක සහ Team ID එක ඇතුළත් කිරීම
      const { error: voteInsertError } = await supabase
        .from('votes')
        .insert([{ team_id: id, ip_address: userIp }]);

      if (voteInsertError) throw voteInsertError;

      // 4. ටීම් එකේ ඡන්ද ගණන 1කින් වැඩි කිරීම
      const { error } = await supabase
        .from('teams')
        .update({ votes: currentVotes + 1 })
        .eq('id', id);

      if (error) throw error;
      
      alert('✅ Your vote has been successfully recorded!');
      fetchData();
    } catch (error) {
      console.error('Error voting:', error);
      alert('Error voting: ' + error.message);
    } finally {
      setVotingId(null);
    }
  };

  // මෙහිදී Admin විසින් is_open false කළහොත් හෝ votingEnded true වුවහොත් පිටුව Blur වේ
  const isClosed = !isOpen || votingEnded;

  return (
    <main className="min-h-screen bg-[#05060a] text-slate-100 p-6 md:p-12 relative overflow-hidden flex flex-col justify-center items-center">
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* ඡන්දය Admin විසින් වැසී ඇත්නම් හෝ කාලය අවසන් නම් මතුවන Blur / Overlay Pop-up Screen එක */}
      {isClosed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="max-w-md w-full bg-slate-900/90 border border-slate-800 p-8 rounded-3xl text-center shadow-2xl space-y-4 animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center justify-center mx-auto text-red-400 text-2xl font-black">
              ⏳
            </div>
            <span className="bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
              Session Terminated
            </span>
            <h2 className="text-3xl font-black bg-gradient-to-r from-red-400 to-amber-500 bg-clip-text text-transparent">
              VOTING CLOSED!
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Voting has been officially closed by the administrators or the designated timeframe has expired. Thank you for participating!
            </p>
            <div className="pt-2">
              <Link 
                href="/" 
                className="inline-block w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-3 rounded-xl text-xs transition-all border border-slate-700"
              >
                Return to Home Page
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ප්‍රධාන කන්ටෙන්ට් එක (isClosed නම් පිටුව Blur වී පසුපසට යයි) */}
      <div className={`max-w-4xl w-full relative z-10 space-y-8 transition-all duration-500 ${isClosed ? 'blur-sm pointer-events-none select-none' : ''}`}>
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
