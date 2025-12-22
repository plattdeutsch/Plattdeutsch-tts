import React, { useState, useRef } from 'react'

export default function TestBlock({ id, label, onRemove }) {
  const [text, setText] = useState('Dat is en Test vun de Plattdüütsche TTS.')
  const [temperature, setTemperature] = useState(0.7)
  const [lengthScale, setLengthScale] = useState(1.0)
  const [noiseScale, setNoiseScale] = useState(0.6)
  const [noiseScaleW, setNoiseScaleW] = useState(0.8)
  const [status, setStatus] = useState(null)
  const [audioUrl, setAudioUrl] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const audioRef = useRef(null)

  const presets = {
    'Natürlich': { temperature: 0.5, lengthScale: 1.0, noiseScale: 0.4, noiseScaleW: 0.6 },
    'Ausgeglichen': { temperature: 0.7, lengthScale: 1.0, noiseScale: 0.6, noiseScaleW: 0.8 },
    'Ausdrucksstark': { temperature: 0.9, lengthScale: 1.1, noiseScale: 0.8, noiseScaleW: 0.9 },
    'Sanft': { temperature: 0.3, lengthScale: 0.9, noiseScale: 0.3, noiseScaleW: 0.5 }
  }

  const applyPreset = (presetName) => {
    const preset = presets[presetName]
    if (preset) {
      setTemperature(preset.temperature)
      setLengthScale(preset.lengthScale)
      setNoiseScale(preset.noiseScale)
      setNoiseScaleW(preset.noiseScaleW)
    }
  }

  const generateSpeech = async () => {
    if (!text.trim()) {
      setStatus({ type: 'error', message: 'Bitte geben Sie Text ein' })
      return
    }

    setIsLoading(true)
    setStatus({ type: 'loading', message: 'Generiere Sprache...' })
    setAudioUrl(null)

    try {
      const response = await fetch('http://127.0.0.1:5000/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          temperature,
          length_scale: lengthScale,
          noise_scale: noiseScale,
          noise_scale_w: noiseScaleW
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Fehler bei der Generierung')
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      setAudioUrl(url)
      setStatus({ type: 'success', message: 'Sprache erfolgreich generiert!' })
    } catch (error) {
      console.error('TTS Error:', error)
      setStatus({ type: 'error', message: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  const downloadAudio = () => {
    if (audioUrl) {
      const a = document.createElement('a')
      a.href = audioUrl
      a.download = `tts_${id}_${Date.now()}.wav`
      a.click()
    }
  }

  return (
    <div className="test-block">
      <div className="test-block-header">
        <div className="test-block-title">{label}</div>
        <div className="test-block-actions">
          <button className="btn-small" title="Klonen" onClick={() => {}}>📋</button>
          <button className="btn-small" title="Entfernen" onClick={onRemove}>✕</button>
        </div>
      </div>

      <div className="form-section">
        <div className="section-title">Text & Rhythmus</div>
        <div className="input-group">
          <label>Plattdeutsch Text</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Geben Sie Plattdeutsch-Text ein..."
          />
        </div>
      </div>

      <div className="form-section">
        <div className="section-title">Akustische Parameter</div>
        
        <div className="slider-group">
          <div className="slider-label">
            <span>Stimmvarianz (Variation)</span>
            <span>{temperature.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="1.0"
            step="0.05"
            value={temperature}
            onChange={(e) => setTemperature(parseFloat(e.target.value))}
          />
        </div>

        <div className="slider-group">
          <div className="slider-label">
            <span>Sprechgeschwindigkeit</span>
            <span>{lengthScale.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="2.0"
            step="0.1"
            value={lengthScale}
            onChange={(e) => setLengthScale(parseFloat(e.target.value))}
          />
        </div>

        <div className="slider-group">
          <div className="slider-label">
            <span>Klangvielfalt (Noise Scale)</span>
            <span>{noiseScale.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0.0"
            max="1.0"
            step="0.05"
            value={noiseScale}
            onChange={(e) => setNoiseScale(parseFloat(e.target.value))}
          />
        </div>

        <div className="slider-group">
          <div className="slider-label">
            <span>Prosodiefreiheit (Noise Scale W)</span>
            <span>{noiseScaleW.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0.0"
            max="1.0"
            step="0.05"
            value={noiseScaleW}
            onChange={(e) => setNoiseScaleW(parseFloat(e.target.value))}
          />
        </div>

        <div>
          <div className="section-title" style={{ marginTop: 'var(--spacing-lg)' }}>Voreinstellungen</div>
          <div className="preset-grid">
            {Object.keys(presets).map(preset => (
              <button
                key={preset}
                className="preset-btn"
                onClick={() => applyPreset(preset)}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        className="btn-primary"
        onClick={generateSpeech}
        disabled={isLoading}
      >
        {isLoading ? '⏳ Generiere...' : '🎵 Sprache generieren'}
      </button>

      {status && (
        <div className={`status-message status-${status.type}`}>
          {status.message}
        </div>
      )}

      {audioUrl && (
        <div className="audio-output">
          <div className="audio-output-label">📻 Audioausgabe</div>
          <audio ref={audioRef} controls src={audioUrl} />
          <button className="btn-download" onClick={downloadAudio}>
            ⬇️ WAV herunterladen
          </button>
        </div>
      )}
    </div>
  )
}
