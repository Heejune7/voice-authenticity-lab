import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Activity, ArrowRight, Check, Headphones, RotateCcw, ShieldCheck, Sparkles, X } from 'lucide-react'
import { getSamples, submitTrial } from './lib'
import './styles.css'

const labels = ['Real voice', 'Deepfake']
function App() {
  const [samples, setSamples] = useState([]), [index, setIndex] = useState(0), [choice, setChoice] = useState(null)
  const [result, setResult] = useState(null), [loading, setLoading] = useState(true), [started, setStarted] = useState(false), [error, setError] = useState('')
  const startedAt = useRef(null)
  useEffect(() => { getSamples().then(setSamples).catch(e => setError(e.message)).finally(() => setLoading(false)) }, [])
  const sample = samples[index]
  const progress = samples.length ? ((index + (result ? 1 : 0)) / samples.length) * 100 : 0
  const isLast = index === samples.length - 1
  const select = value => { setChoice(value); setResult(null) }
  const next = async () => {
    if (!choice || !sample) return
    setLoading(true); setError('')
    try { setResult(await submitTrial({ sample_id: sample.id, answer: choice, response_ms: startedAt.current ? Date.now() - startedAt.current : null })) }
    catch (e) { setError('응답을 저장하지 못했습니다. Supabase 설정을 확인해주세요.') }
    finally { setLoading(false) }
  }
  const advance = () => { if (isLast) setStarted(false); else { setIndex(i => i + 1); setChoice(null); setResult(null); startedAt.current = Date.now() } }
  const restart = () => { setIndex(0); setChoice(null); setResult(null); setStarted(true); startedAt.current = Date.now() }
  if (!started) return <main className="shell"><header><div className="brand"><span className="mark"><Activity size={18}/></span><span>VOICE / AUTHENTICITY LAB</span></div><span className="status"><i/> EXPERIMENT 01</span></header><section className="hero"><div className="eyebrow"><Sparkles size={15}/> HUMAN OR SYNTHETIC?</div><h1>귀로 듣고, 목소리의<br/><em>진위를 판단하세요.</em></h1><p className="lead">동일한 포맷으로 정규화된 음성 샘플을 듣고 실제 음성인지, 딥페이크인지 분류하는 짧은 실험입니다.</p><div className="meta-grid"><div><b>02</b><span>음성 샘플</span></div><div><b>44.1<span>kHz</span></b><span>샘플링 레이트</span></div><div><b>01</b><span>정답 선택 / 샘플</span></div></div><button className="primary" onClick={() => {setStarted(true); startedAt.current=Date.now()}}>실험 시작하기 <ArrowRight size={18}/></button><div className="privacy"><ShieldCheck size={16}/><span>응답 데이터는 익명으로 저장되며, 연구 목적에만 사용됩니다.</span></div></section></main>
  return <main className="shell"><header><div className="brand"><span className="mark"><Activity size={18}/></span><span>VOICE / AUTHENTICITY LAB</span></div><span className="counter">{String(index + 1).padStart(2,'0')} / {String(samples.length).padStart(2,'0')}</span></header><div className="progress"><span style={{width:`${progress}%`}}/></div>{loading && !sample ? <div className="loading">샘플을 불러오는 중...</div> : <section className="trial"><div className="trial-top"><div><div className="eyebrow">LISTEN & CLASSIFY</div><h2>{sample?.name || '음성 샘플'}</h2><p>헤드폰을 권장합니다. 필요한 만큼 반복해서 들어보세요.</p></div><div className="sample-no">SAMPLE <strong>{String(index+1).padStart(2,'0')}</strong></div></div><div className="player"><div className="player-icon"><Headphones size={24}/></div><div className="wave">{Array.from({length:52},(_,i)=><i key={i} style={{height:`${18 + ((i*17)%48)}%`}}/> )}</div><audio controls src={sample?.url}/><div className="audio-note">MONO · 44,100 Hz · WAV</div></div><div className="question">이 음성은 무엇이라고 판단하시나요?</div><div className="choices">{labels.map((label,i)=><button key={label} className={`choice ${choice===i?'chosen':''}`} onClick={()=>select(i)}><span className="radio">{choice===i && <i/>}</span><span><b>{label}</b><small>{i===0?'사람이 직접 발화한 음성':'AI로 생성 또는 변환된 음성'}</small></span></button>)}</div>{error && <div className="error">{error}</div>}{result && <div className={`feedback ${result.is_correct===true?'correct':''}`}>{result.is_correct===true?<Check size={18}/>:result.is_correct===false?<X size={18}/>:<Activity size={18}/>} {result.message || (result.is_correct?'정확합니다.':'다음 샘플에서 다시 시도해보세요.')}</div>}<div className="actions"><button className="ghost" onClick={restart}><RotateCcw size={16}/> 처음부터</button>{result ? <button className="primary" onClick={advance}>{isLast?'결과 보기':'다음 샘플'} <ArrowRight size={17}/></button> : <button className="primary" disabled={!choice || loading} onClick={next}>판단 제출 <ArrowRight size={17}/></button>}</div></section>}<footer><span>ANONYMIZED RESEARCH PROTOCOL</span><span>BUILD 01.0</span></footer></main>
}
export default App
