'use server';

import { headers } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL, 
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function castVote(teamId) {
  try {
    const headersList = await headers();
    
    // පරිශීලකයාගේ IP ලිපිනය ලබා ගැනීම
    const forwardedFor = headersList.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';

    // 1. මෙම IP එකෙන් දැනටමත් voted කර ඇද්දැයි පරීක්ෂා කිරීම
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

    // 2. අලුත් ඡන්දය votes table එකට ඇතුළත් කිරීම
    const { error: insertError } = await supabase
      .from('votes')
      .insert([{ ip_address: ip, team_id: teamId }]);

    if (insertError) {
      console.error('Insert error:', insertError);
      return { success: false, message: 'ඡන්දය සටහන් කරගැනීමට නොහැකි විය.' };
    }

    return { success: true, message: 'ඔේබේ ඡන්දය සාර්ථකව ලබා දෙන ලදී!' };

  } catch (err) {
    console.error('Server error:', err);
    return { success: false, message: 'අනපේක්ෂිත දෝෂයක් සිදු විය.' };
  }
}
