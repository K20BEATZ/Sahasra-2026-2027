'use server';

import { createClient } from '@supabase/supabase-js';
import { headers } from 'next/headers';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL, 
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// 1. ඡන්දය සටහන් කිරීම (1 IP = 1 Vote)
export async function castVote(teamId) {
  try {
    const headersList = await headers();
    
    // පරිශීලකයාගේ IP ලිපිනය ලබා ගැනීම
    const forwardedFor = headersList.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';

    // මෙම IP එක මඟින් මීට පෙර ඡන්දය ප්‍රකාශ කර ඇද්දැයි පරීක්ෂා කිරීම
    const { data: existingVote, error: checkError } = await supabase
      .from('votes')
      .select('*')
      .eq('ip_address', ip)
      .maybeSingle();

    if (checkError) {
      console.error('Check error:', checkError);
      return { success: false, message: 'දෝෂයක් ඇති විය. කරුණාකර නැවත උත්සාහ කරන්න.' };
    }

    if (existingVote) {
      return { success: false, message: 'ඔබ මෙම උපාංගයෙන් දැනටමත් ඡන්දය ප්‍රකාශ කර ඇත!' };
    }

    // අලුත් ඡන්දය votes table එකට ඇතුළත් කිරීම
    const { error: insertError } = await supabase
      .from('votes')
      .insert([{ ip_address: ip, team_id: teamId }]);

    if (insertError) {
      console.error('Insert error:', insertError);
      return { success: false, message: 'ඡන්දය සටහන් කරගැනීමට නොහැකි විය.' };
    }

    return { success: true, message: 'ඔබේ ඡන්දය සාර්ථකව ලබා දෙන ලදී!' };

  } catch (err) {
    console.error('Server error:', err);
    return { success: false, message: 'අනපේක්ෂිත දෝෂයක් සිදු විය.' };
  }
}

// 2. අදාළ ටීම් එකට ලැබී ඇති මුළු ඡන්ද ගණන ලබා ගැනීම
export async function getTeamVotesCount(teamId) {
  const { count, error } = await supabase
    .from('votes')
    .select('*', { count: 'exact', head: true })
    .eq('team_id', teamId);

  if (error) {
    console.error('Error fetching votes count:', error);
    return 0;
  }

  return count || 0;
}

// 3. අදාළ ටීම් එකේ සියලුම ඡන්ද ඉවත් කර 0 කිරීමට (Reset Votes)
export async function resetTeamVotes(teamId) {
  try {
    const { error } = await supabase
      .from('votes')
      .delete()
      .eq('team_id', teamId);

    if (error) {
      console.error('Reset votes error:', error);
      return { success: false, message: 'ඡන්ද ශුන්‍ය කිරීමට නොහැකි විය.' };
    }

    return { success: true, message: 'මෙම කණ්ඩායමේ ඡන්ද සියල්ල සාර්ථකව ශුන්‍ය (0) කරන ලදී!' };
  } catch (err) {
    console.error('Server error:', err);
    return { success: false, message: 'අනපේක්ෂිත දෝෂයක් සිදු විය.' };
  }
}
