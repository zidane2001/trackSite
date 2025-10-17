// api/track.js - SUPABASE + TRACKING LIVE
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qoxunfehjvlnjfcdhirm.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY || 'SUPABASE_CLIENT_API_KEY'
const supabase = createClient(supabaseUrl, supabaseKey)

export default async function handler(req, res) {
  const { code } = req.query;

  if (!code) return res.status(400).json({ error: 'Code suivi requis' });

  const { data } = await supabase
    .from('shipments')
    .select('*')
    .eq('tracking_code', code)
    .single();

  if (!data) return res.status(404).json({ error: 'Colis non trouvé' });

  res.json({
    success: true,
    shipment: data,
    map: {
      start: data.depart,
      end: data.arrivee,
      status: data.status
    }
  });
}