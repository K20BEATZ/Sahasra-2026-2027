'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function RegisterPage() {
  const [teamName, setTeamName] = useState('');
  const [university, setUniversity] = useState('Rajarata University of Sri Lanka');
  
  // Members ලා 15 දෙනා සඳහා States (Array එකක් ලෙස)
  const [members, setMembers] = useState(Array(15).fill(''));
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Member කෙනෙකුගේ නම වෙනස් වන විට 
  const handleMemberChange = (index, value) => {
    const newMembers = [...members];
    newMembers[index] = value;
    setMembers(newMembers);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      // 1. හිස් නොමැති සාමාජිකයන් පමණක් ෆිල්ටර් කර ගණන පරීක්ෂා කිරීම
      const filteredMembers = members.filter(m => m.trim() !== '');

      if (filteredMembers.length < 12) {
        setMessage({ 
          text: `Registration failed! A team must have at least 12 members (You entered ${filteredMembers.length}).`, 
          type: 'error' 
        });
        setLoading(false);
        return;
      }

      // 2. තෝරාගත් විශ්වවිද්‍යාලයෙන් දැනටමත් Team එකක් Register වී ඇත්දැයි පරීක්ෂා කිරීම
      const { data: existingTeams, error: checkError } = await supabase
        .from('teams')
        .select('id, team_name')
        .eq('university', university);

      if (checkError) throw checkError;

      if (existingTeams && existingTeams.length > 0) {
        setMessage({ 
          text: `Registration failed! ${university} has already registered a team ("${existingTeams[0].team_name}"). Only one team per university is allowed.`, 
          type: 'error' 
        });
        setLoading(false);
        return;
      }

      // 3. අලුත් Team එක Database එකට ඇතුළත් කිරීම
      const { error: insertError } = await supabase
        .from('teams')
        .insert([
          {
            team_name: teamName,
            university: university,
            members: filteredMembers, 
            votes: 0
          }
        ]);

      if (insertError) throw insertError;

      setMessage({ text: 'Team registered successfully with all members!', type: 'success' });
      setTeamName('');
      setUniversity('Rajarata University of Sri Lanka');
      setMembers(Array(15).fill(''));
    } catch (error) {
      setMessage({ text: error.message || 'Registration failed. Try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#05060a] text-slate-100 flex flex-col justify-center items-center p-6 relative overflow-hidden">
      {/* Background Glow Effects */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-xl w-full bg-slate-900/80 border border-slate-800 p-8 rounded-3xl shadow-2xl relative z-10 backdrop-blur-xl my-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-black bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
            Team Registration (Min 12 Members)
          </h1>
          <Link href="/" className="text-xs text-slate-400 hover:text-amber-400 transition-colors">
            ← Back to Home
          </Link>
        </div>

        {message.text && (
          <div className={`p-3 rounded-xl text-xs mb-6 text-center font-medium ${
            message.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Team Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Team Name</label>
            <input
              type="text"
              required
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Enter team name"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          {/* University Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">University (Only 1 team allowed per university)</label>
            <select
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-amber-500 transition-colors"
            >
              <option value="Rajarata University of Sri Lanka">Rajarata University of Sri Lanka</option>
              <option value="University of Colombo">University of Colombo</option>
              <option value="University of Peradeniya">University of Peradeniya</option>
              <option value="University of Moratuwa">University of Moratuwa</option>
              <option value="University of Sri Jayewardenepura">University of Sri Jayewardenepura</option>
              <option value="University of Kelaniya">University of Kelaniya</option>
              <option value="University of Jaffna">University of Jaffna</option>
              <option value="University of Ruhuna">University of Ruhuna</option>
              <option value="Sabaragamuwa University of Sri Lanka">Sabaragamuwa University of Sri Lanka</option>
              <option value="Wayamba University of Sri Lanka">Wayamba University of Sri Lanka</option>
              <option value="Uva Wellassa University">Uva Wellassa University</option>
            </select>
          </div>

          {/* Members Input Fields */}
          <div className="pt-2">
            <label className="block text-sm font-bold text-amber-400 mb-1">Team Members (12 to 15 Members)</label>
            <p className="text-[11px] text-slate-400 mb-3">First 12 members are mandatory. Members 13 to 15 are optional.</p>
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
              {members.map((member, index) => (
                <div key={index}>
                  <label className="block text-[11px] text-slate-400 mb-1">
                    Member {index + 1} {index === 0 ? '(Team Leader)' : ''} {index < 12 ? '<span class="text-red-400">*</span>' : '(Optional)'}
                  </label>
                  <input
                    type="text"
                    required={index < 12} // පළමු සාමාජිකයන් 12 දෙනා අනිවාර්යයි
                    value={member}
                    onChange={(e) => handleMemberChange(index, e.target.value)}
                    placeholder={index === 0 ? "e.g. L.A.Kavindu Navodyana Liyana arachchi" : `Enter member ${index + 1} name`}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 rounded-xl transition-all duration-300 shadow-lg shadow-amber-500/20 disabled:opacity-50 mt-4"
          >
            {loading ? 'Submitting...' : 'Register Team with Members'}
          </button>
        </form>
      </div>
    </main>
  );
}
