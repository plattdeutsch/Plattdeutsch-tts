import React, { useState } from 'react'
import TestBlock from './TestBlock'

export default function TestCanvas() {
  const [testBlocks, setTestBlocks] = useState([
    { id: 1, label: 'Test 1' },
    { id: 2, label: 'Test 2' }
  ])

  const addTestBlock = () => {
    const newId = Math.max(...testBlocks.map(b => b.id), 0) + 1
    setTestBlocks([...testBlocks, { id: newId, label: `Test ${newId}` }])
  }

  const removeTestBlock = (id) => {
    setTestBlocks(testBlocks.filter(b => b.id !== id))
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>🧪 Testlabor für Sprachsynthese</h1>
        <p>Vergleichen Sie verschiedene Einstellungen für die Plattdeutsch-Sprachsynthese</p>
      </div>

      <div className="test-canvas">
        {testBlocks.map(block => (
          <TestBlock
            key={block.id}
            id={block.id}
            label={block.label}
            onRemove={() => removeTestBlock(block.id)}
          />
        ))}
      </div>

      <button className="btn-primary" onClick={addTestBlock} style={{ maxWidth: '300px' }}>
        + Testgruppe hinzufügen
      </button>

      <div className="tips-section">
        <h3>💡 Tipps für A/B-Tests:</h3>
        <ul>
          <li><strong>Stimmvarianz:</strong> Niedrigere Werte (0,1-0,3) für konsistente Sprache, höhere (0,7-1,0) für mehr Variation</li>
          <li><strong>Sprechgeschwindigkeit:</strong> Werte unter 1,0 für langsameres Sprechen, über 1,0 für schneller</li>
          <li><strong>Klangvielfalt:</strong> Kontrolliert die Stimmenqualität. Höhere Werte = raueere Klang</li>
          <li><strong>Prosodiefreiheit:</strong> Ermöglicht mehr natürliche Betonung und Rhythmus</li>
          <li>Testen Sie systematisch: Ändern Sie jeweils einen Parameter nach dem anderen</li>
          <li>Verwenden Sie denselben Text für aussagekräftige Vergleiche</li>
        </ul>
      </div>
    </div>
  )
}
