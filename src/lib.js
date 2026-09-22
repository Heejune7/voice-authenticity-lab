import { createClient } from '@supabase/supabase-js'
export const supabase = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY
  ? createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY) : null

export const localSamples = [
  { id: 'local-1', name: '샘플 01', storage_path: '1__F_SYE_21-1_통일_44100Hz.wav', sample_rate: 44100 },
  { id: 'local-2', name: '샘플 02', storage_path: '1__F_SYE_21-2_통일_44100Hz.wav', sample_rate: 44100 }
]
export async function getSamples() {
  if (!supabase) return localSamples.map(s => ({ ...s, url: `/audio/${encodeURIComponent(s.storage_path)}` }))
  const { data, error } = await supabase.from('audio_samples').select('id,name,storage_path,sample_rate').eq('is_active', true).order('created_at')
  if (error) throw error
  return data.map(s => ({ ...s, url: supabase.storage.from('audio').getPublicUrl(s.storage_path).data.publicUrl }))
}
export async function submitTrial(payload) {
  if (!supabase) return { is_correct: null, message: '로컬 미리보기에서는 채점 결과를 표시하지 않습니다.' }
  const { data, error } = await supabase.functions.invoke('submit-trial', { body: payload })
  if (error) throw error
  return data
}
