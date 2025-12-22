import React, { useState } from 'react'

export default function AdminPanel() {
  const [testSentences, setTestSentences] = useState([
    'Dat is en Test vun de Plattdüütsche TTS.',
    'Moin, wie geiht dat di?',
    'De Welt is schön un groot.'
  ])
  const [newSentence, setNewSentence] = useState('')
  const [systemInfo, setSystemInfo] = useState(null)

  const addTestSentence = () => {
    if (newSentence.trim()) {
      setTestSentences([...testSentences, newSentence])
      setNewSentence('')
    }
  }

  const removeTestSentence = (index) => {
    setTestSentences(testSentences.filter((_, i) => i !== index))
  }

  const fetchSystemInfo = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/info')
      const data = await response.json()
      setSystemInfo(data)
    } catch (error) {
      console.error('Error fetching system info:', error)
    }
  }

  const runBatchTest = async () => {
    if (testSentences.length === 0) {
      alert('Bitte fügen Sie Testsätze hinzu')
      return
    }

    alert(`Starte Stapeltest mit ${testSentences.length} Sätzen...`)
    
    for (const sentence of testSentences) {
      try {
        const response = await fetch('http://127.0.0.1:5000/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: sentence,
            temperature: 0.7,
            length_scale: 1.0,
            noise_scale: 0.6,
            noise_scale_w: 0.8
          })
        })

        if (response.ok) {
          const blob = await response.blob()
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `batch_test_${Date.now()}.wav`
          a.click()
        }
      } catch (error) {
        console.error('Batch test error:', error)
      }
    }

    alert('Stapeltest abgeschlossen!')
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>⚙️ Verwaltungspanel</h1>
        <p>Verwalten Sie Modelleinstellungen und führen Sie Tests durch</p>
      </div>

      <div className="admin-panel">
        <div className="admin-section">
          <h3>📋 Testsätze verwalten</h3>
          <div className="input-group">
            <label>Neuen Testsatz hinzufügen</label>
            <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
              <input
                type="text"
                value={newSentence}
                onChange={(e) => setNewSentence(e.target.value)}
                placeholder="Plattdeutsch-Text eingeben..."
                style={{ flex: 1 }}
              />
              <button className="btn-primary" onClick={addTestSentence} style={{ width: 'auto' }}>
                Hinzufügen
              </button>
            </div>
          </div>

          <div style={{ marginTop: 'var(--spacing-lg)' }}>
            <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontSize: '12px', fontWeight: '600' }}>
              Gespeicherte Testsätze ({testSentences.length})
            </label>
            {testSentences.map((sentence, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 'var(--spacing-md)',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border)',
                  borderRadius: '4px',
                  marginBottom: 'var(--spacing-sm)',
                  fontSize: '13px'
                }}
              >
                <span>{sentence}</span>
                <button
                  className="btn-small"
                  onClick={() => removeTestSentence(index)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <button
            className="btn-primary"
            onClick={runBatchTest}
            style={{ marginTop: 'var(--spacing-lg)' }}
          >
            ▶️ Stapeltest ausführen
          </button>
        </div>

        <div className="admin-section">
          <h3>ℹ️ Systeminformationen</h3>
          <button className="btn-primary" onClick={fetchSystemInfo}>
            🔄 Informationen abrufen
          </button>

          {systemInfo && (
            <div className="system-info" style={{ marginTop: 'var(--spacing-lg)' }}>
              <div className="info-item">
                <div className="info-label">Modellname</div>
                <div className="info-value">{systemInfo.model_name || 'N/A'}</div>
              </div>
              <div className="info-item">
                <div className="info-label">Sprache</div>
                <div className="info-value">{systemInfo.language || 'N/A'}</div>
              </div>
              <div className="info-item">
                <div className="info-label">Modelltyp</div>
                <div className="info-value">{systemInfo.model_type || 'N/A'}</div>
              </div>
              <div className="info-item">
                <div className="info-label">Sample Rate</div>
                <div className="info-value">{systemInfo.sample_rate || 'N/A'} Hz</div>
              </div>
            </div>
          )}
        </div>

        <div className="admin-section">
          <h3>🔧 Modellverwaltung</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: 'var(--spacing-lg)' }}>
            Das Modell wird automatisch beim Start geladen. Die ModellDateen befinden sich in:
          </p>
          <div style={{
            padding: 'var(--spacing-md)',
            background: 'var(--bg-primary)',
            border: '1px solid var(--border)',
            borderRadius: '4px',
            fontSize: '12px',
            fontFamily: 'monospace',
            wordBreak: 'break-all',
            color: 'var(--text-secondary)'
          }}>
            model/best_model.pth<br />
            model/config.json
          </div>
        </div>
      </div>
    </div>
  )
}
