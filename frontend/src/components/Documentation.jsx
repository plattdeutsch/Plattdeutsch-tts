import React from 'react'

export default function Documentation() {
  return (
    <div className="container">
      <div className="page-header">
        <h1>📚 Dokumentation</h1>
        <p>Erfahren Sie mehr über die Akustischen Parameter und Best Practices</p>
      </div>

      <div className="admin-panel">
        <div className="admin-section">
          <h3>🎚️ Akustische Parameter</h3>
          
          <div style={{ marginBottom: 'var(--spacing-xl)' }}>
            <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: 'var(--spacing-md)' }}>
              Stimmvarianz (Temperature)
            </h4>
            <div style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: '1.6' }}>
              <p style={{ marginBottom: 'var(--spacing-md)' }}>
                <strong>Bereich:</strong> 0,1 - 1,0
              </p>
              <p style={{ marginBottom: 'var(--spacing-md)' }}>
                <strong>Beschreibung:</strong> Kontrolliert die Variabilität in der Sprachausgabe. Niedrigere Werte führen zu konsistenterer, robotischere Sprache. Höhere Werte erzeugen natürlichere, variablere Sprache.
              </p>
              <p style={{ marginBottom: 'var(--spacing-md)' }}>
                <strong>Empfehlungen:</strong>
              </p>
              <ul style={{ marginLeft: 'var(--spacing-lg)', marginBottom: 'var(--spacing-md)' }}>
                <li>0,3 - 0,5: Formelle Präsentationen, konsistente Lesevorgänge</li>
                <li>0,6 - 0,8: Normale Konversation, ausgewogene Natürlichkeit</li>
                <li>0,9 - 1,0: Expressive Lesevorgänge, maximale Variation</li>
              </ul>
            </div>
          </div>

          <div style={{ marginBottom: 'var(--spacing-xl)' }}>
            <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: 'var(--spacing-md)' }}>
              Sprechgeschwindigkeit (Length Scale)
            </h4>
            <div style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: '1.6' }}>
              <p style={{ marginBottom: 'var(--spacing-md)' }}>
                <strong>Bereich:</strong> 0,5 - 2,0
              </p>
              <p style={{ marginBottom: 'var(--spacing-md)' }}>
                <strong>Beschreibung:</strong> Steuert die Sprechgeschwindigkeit und die Länge des Audios. Werte unter 1,0 verlangsamen die Sprache, Werte über 1,0 beschleunigen sie.
              </p>
              <p style={{ marginBottom: 'var(--spacing-md)' }}>
                <strong>Empfehlungen:</strong>
              </p>
              <ul style={{ marginLeft: 'var(--spacing-lg)', marginBottom: 'var(--spacing-md)' }}>
                <li>0,7 - 0,9: Langsame, deutliche Sprache</li>
                <li>1,0: Standard-Sprechgeschwindigkeit</li>
                <li>1,2 - 1,5: Schnellere Sprache</li>
              </ul>
            </div>
          </div>

          <div style={{ marginBottom: 'var(--spacing-xl)' }}>
            <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: 'var(--spacing-md)' }}>
              Klangvielfalt (Noise Scale)
            </h4>
            <div style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: '1.6' }}>
              <p style={{ marginBottom: 'var(--spacing-md)' }}>
                <strong>Bereich:</strong> 0,0 - 1,0
              </p>
              <p style={{ marginBottom: 'var(--spacing-md)' }}>
                <strong>Beschreibung:</strong> Beeinflusst die Menge an hochfrequentiösem Rauschen und die Stimmenklarheit. Niedrigere Werte erzeugen glattere, klare Sprache. Höhere Werte fügen mehr Rauhheit und Charakter hinzu.
              </p>
              <p style={{ marginBottom: 'var(--spacing-md)' }}>
                <strong>Empfehlungen:</strong>
              </p>
              <ul style={{ marginLeft: 'var(--spacing-lg)', marginBottom: 'var(--spacing-md)' }}>
                <li>0,2 - 0,4: Sehr sauberer Sound, ideal für professionelle Audio</li>
                <li>0,5 - 0,7: Ausgewogener Sound mit natürlichem Charakter</li>
                <li>0,8 - 1,0: Rauherer, charakteristischere Qualität</li>
              </ul>
            </div>
          </div>

          <div style={{ marginBottom: 'var(--spacing-xl)' }}>
            <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: 'var(--spacing-md)' }}>
              Prosodiefreiheit (Noise Scale W)
            </h4>
            <div style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: '1.6' }}>
              <p style={{ marginBottom: 'var(--spacing-md)' }}>
                <strong>Bereich:</strong> 0,0 - 1,0
              </p>
              <p style={{ marginBottom: 'var(--spacing-md)' }}>
                <strong>Beschreibung:</strong> Kontrolliert die spektralen Merkmale und erlaubt mehr Freiheit bei der Prosodie (Rhythmus und Intonation). Höhere Werte ermöglichen natürlichere Satzmelodie.
              </p>
              <p style={{ marginBottom: 'var(--spacing-md)' }}>
                <strong>Empfehlungen:</strong>
              </p>
              <ul style={{ marginLeft: 'var(--spacing-lg)', marginBottom: 'var(--spacing-md)' }}>
                <li>0,4 - 0,6: Konsistente Prosodie</li>
                <li>0,7 - 0,9: Natürlichere Betonung und Rhythmus</li>
                <li>1,0: Maximale Prosodievariation</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="admin-section">
          <h3>📖 Voreinstellungen</h3>
          
          <div style={{ marginBottom: 'var(--spacing-lg)' }}>
            <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: 'var(--spacing-sm)' }}>
              Natürlich
            </h4>
            <div style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: 'var(--spacing-md)' }}>
              Temperatur: 0,5 | Geschwindigkeit: 1,0 | Klang: 0,4 | Prosodie: 0,6<br />
              <em>Für gleichmäßige, konsistente Sprache mit natürlicher Qualität</em>
            </div>
          </div>

          <div style={{ marginBottom: 'var(--spacing-lg)' }}>
            <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: 'var(--spacing-sm)' }}>
              Ausgeglichen
            </h4>
            <div style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: 'var(--spacing-md)' }}>
              Temperatur: 0,7 | Geschwindigkeit: 1,0 | Klang: 0,6 | Prosodie: 0,8<br />
              <em>Gute Balance zwischen Natürlichkeit und Klarheit</em>
            </div>
          </div>

          <div style={{ marginBottom: 'var(--spacing-lg)' }}>
            <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: 'var(--spacing-sm)' }}>
              Ausdrucksstark
            </h4>
            <div style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: 'var(--spacing-md)' }}>
              Temperatur: 0,9 | Geschwindigkeit: 1,1 | Klang: 0,8 | Prosodie: 0,9<br />
              <em>Für emotionale und expressive Lesevorgänge</em>
            </div>
          </div>

          <div style={{ marginBottom: 'var(--spacing-lg)' }}>
            <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: 'var(--spacing-sm)' }}>
              Sanft
            </h4>
            <div style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: 'var(--spacing-md)' }}>
              Temperatur: 0,3 | Geschwindigkeit: 0,9 | Klang: 0,3 | Prosodie: 0,5<br />
              <em>Für sanfte, beruhigende Sprache</em>
            </div>
          </div>
        </div>

        <div className="admin-section">
          <h3>💡 Best Practices</h3>
          <ul style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: '1.8' }}>
            <li style={{ marginBottom: 'var(--spacing-md)' }}>
              <strong>A/B-Tests durchführen:</strong> Vergleichen Sie verschiedene Parametereinstellungen mit demselben Text, um die beste Konfiguration zu finden.
            </li>
            <li style={{ marginBottom: 'var(--spacing-md)' }}>
              <strong>Schrittweise anpassen:</strong> Ändern Sie jeweils einen Parameter nach dem anderen, um dessen Auswirkung zu verstehen.
            </li>
            <li style={{ marginBottom: 'var(--spacing-md)' }}>
              <strong>Beispieltexte verwenden:</strong> Testen Sie mit verschiedenen Arten von Plattdeutsch-Text: Sätze, Dialoge, Narrative.
            </li>
            <li style={{ marginBottom: 'var(--spacing-md)' }}>
              <strong>Gehörprüfung:</strong> Verlassen Sie sich auf Ihr Gehör. Was in den Metriken gut aussieht, könnte in der Praxis anders klingen.
            </li>
            <li style={{ marginBottom: 'var(--spacing-md)' }}>
              <strong>Dokumentieren:</strong> Notieren Sie sich gute Konfigurationen für zukünftige Referenz.
            </li>
          </ul>
        </div>

        <div className="admin-section">
          <h3>🎯 Häufige Szenarien</h3>
          
          <div style={{ marginBottom: 'var(--spacing-lg)' }}>
            <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: 'var(--spacing-sm)' }}>
              Audiobook / Storytelling
            </h4>
            <div style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
              Verwenden Sie die <strong>Ausdrucksstarke</strong> Voreinstellung und erhöhen Sie die Sprechgeschwindigkeit für natürlicheres Erzählen.
            </div>
          </div>

          <div style={{ marginBottom: 'var(--spacing-lg)' }}>
            <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: 'var(--spacing-sm)' }}>
              Formelle Präsentationen
            </h4>
            <div style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
              Verwenden Sie die <strong>Natürliche</strong> Voreinstellung mit leicht niedrigerer Sprechgeschwindigkeit (0,9) für Klarheit.
            </div>
          </div>

          <div style={{ marginBottom: 'var(--spacing-lg)' }}>
            <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: 'var(--spacing-sm)' }}>
              Sprachassistent / Telefonie
            </h4>
            <div style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
              Verwenden Sie die <strong>Sanfte</strong> Voreinstellung mit höherer Klarheit für natürliche, aber verständliche Sprache.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
