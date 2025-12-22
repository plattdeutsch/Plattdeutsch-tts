import React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { BookOpen, Zap, Lightbulb, Volume2 } from "lucide-react"

export function Documentation() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8 pb-8 border-b-2 border-primary/20">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-1.5 w-16 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
          <h1 className="text-4xl font-bold text-foreground">Dokumentation</h1>
        </div>
        <p className="text-base text-muted-foreground mt-3">Lernen Sie alles über Parameter, Presets und optimale Sprachqualität</p>
      </div>

      {/* Overview */}
      <Card className="shadow-md border-primary/10">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardTitle className="flex items-center text-lg">
            <BookOpen className="mr-3 h-5 w-5 text-primary" />
            Plattdeutsch TTS Tester
          </CardTitle>
          <CardDescription className="text-foreground/70 mt-2">
            Professionelle Test- und Evaluierungsplattform für Plattdeutsch Text-to-Speech Synthese
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm pt-6">
          <p>
            Diese Anwendung dient dem systematischen Testen und Evaluieren des VITS-Modells für die Plattdeutsch-Sprachsynthese.
          </p>
        </CardContent>
      </Card>

      {/* Quick Links */}
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/30 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center text-base text-primary">
            <Zap className="mr-2 h-5 w-5" />
            Technische Grundlagen verstehen
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p>
            <strong className="text-primary">Neu:</strong> Umfassende Dokumentation zur Sprachqualität und Inferenzkonfiguration.
          </p>
          <div className="bg-white p-3 rounded border border-blue-100 space-y-2">
            <p className="font-semibold text-blue-900">VITS Sprachqualität: Technische Grundlagen</p>
            <p className="text-gray-700">
              Wissenschaftliche Erklärung von Sprachqualität, Artifakten und wie Inferenzparameter Ihre Sprachausgabe beeinflussen.
            </p>
            <p className="text-xs text-gray-600">
              📄 <code className="bg-gray-100 px-2 py-1 rounded">VITS_SPRACHQUALITAT_TECHNISCHE_GRUNDLAGEN.md</code>
            </p>
            <ul className="text-xs text-gray-600 mt-2 space-y-1 ml-4">
              <li>✓ Wie VITS tatsächlich funktioniert (Wahrscheinlichkeits-Modell, nicht Replay)</li>
              <li>✓ Training vs. Inferenz: Wer kontrolliert was?</li>
              <li>✓ Artifakte erklärt: Roboterartig, Metallisch, Verschwommen, Flach</li>
              <li>✓ Warum zu saubere Audio künstlich klingt</li>
              <li>✓ Jeder Parameter erklärt auf Signal-Ebene</li>
              <li>✓ Praktische Diagnose-Anleitung</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* How VITS Works - Simplified */}
      <Card className="bg-indigo-50 border-indigo-200">
        <CardHeader>
          <CardTitle className="text-base text-indigo-900">🧠 Wie VITS wirklich funktioniert</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="space-y-3">
            <div className="bg-white p-2 rounded border-l-4 border-indigo-500">
              <p className="font-semibold text-indigo-900">1. Nicht "Abspielen", sondern "Erstellen"</p>
              <p className="text-gray-700 text-xs mt-1">
                VITS speichert nicht exakte Kopien von Sprache. Es lernt, wie natürliche Sprache klingt, und erstellt jedes Mal etwas Neues — ähnlich wie ein Mensch, der einen Satz anders sagt, wenn er ihn wiederholt.
              </p>
            </div>
            <div className="bg-white p-2 rounded border-l-4 border-indigo-500">
              <p className="font-semibold text-indigo-900">2. Stichprobenziehung statt Berechnung</p>
              <p className="text-gray-700 text-xs mt-1">
                Parameter sind „Kontrollen für die Stichprobenziehung". Zu eng = immer gleich (roboterartig). Zu breit = inkohärent. Richtig = natürlich und variabel.
              </p>
            </div>
            <div className="bg-white p-2 rounded border-l-4 border-indigo-500">
              <p className="font-semibold text-indigo-900">3. Training ≠ Inferenz</p>
              <p className="text-gray-700 text-xs mt-1">
                Was während des Trainings gelernt wurde (Phonem-Dauer, Tonhöhenmuster, Prosodie) ist getrennt von der Inferenzkonfiguration (wie eng/locker die Parameter sind).
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Artifacts Explained Simply */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">🔊 Häufige Artefakte — Ursachen verstehen</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-xs">
          <div className="space-y-2">
            <div className="border-l-4 border-red-500 pl-3 py-1">
              <p className="font-semibold text-red-700">🤖 Roboterartig / Monoton</p>
              <p className="text-gray-600">
                <strong>Ursache:</strong> Zu enge Abtastung. Das Modell wird gezwungen, immer gleich zu klingen.
              </p>
              <p className="text-gray-600 text-xs mt-1">
                <strong>Fix:</strong> Erhöhe Temperatur, Tonhöhen-Variation (noiseScale), Prosodie-Freiheit
              </p>
            </div>
            <div className="border-l-4 border-yellow-500 pl-3 py-1">
              <p className="font-semibold text-yellow-700">⚡ Metallisch / Kreischend</p>
              <p className="text-gray-600">
                <strong>Ursache:</strong> Zu viel Regularisierung der Harmonischen. Spektrale Energie ist zu konzentriert.
              </p>
              <p className="text-gray-600 text-xs mt-1">
                <strong>Fix:</strong> Reduziere Temperatur oder Tonhöhen-Variation
              </p>
            </div>
            <div className="border-l-4 border-orange-500 pl-3 py-1">
              <p className="font-semibold text-orange-700">🌫️ Verschwommen / Undeutlich</p>
              <p className="text-gray-600">
                <strong>Ursache:</strong> Phoneme sind zu kurz. Konsonanten verlieren ihre Schärfe.
              </p>
              <p className="text-gray-600 text-xs mt-1">
                <strong>Fix:</strong> Erhöhe Länge/Geschwindigkeit (zu niedrig = zu schnell)
              </p>
            </div>
            <div className="border-l-4 border-purple-500 pl-3 py-1">
              <p className="font-semibold text-purple-700">😐 Flach / Ausdruckslos</p>
              <p className="text-gray-600">
                <strong>Ursache:</strong> Alle Wörter klingen gleich betont. Dynamik ist zu normalisiert.
              </p>
              <p className="text-gray-600 text-xs mt-1">
                <strong>Fix:</strong> Erhöhe Prosodie-Freiheit, Reduziere Lautstärke-Ausgleich
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Why Clean Audio Sounds Bad */}
      <Card className="bg-amber-50 border-amber-200">
        <CardHeader>
          <CardTitle className="text-base">⚠️ Paradoxon: Warum "zu saubere" Audio künstlich klingt</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p className="text-gray-700">
            Echte Sprache ist nicht perfekt. Sie enthält:
          </p>
          <ul className="text-xs text-gray-700 space-y-1 ml-4">
            <li>✓ <strong>Atem und Mikro-Pausen</strong> — geben dem Rhythmus Struktur</li>
            <li>✓ <strong>Micro-Hiss</strong> — Reibelaute (s, f, th) haben natürliche Raschheit</li>
            <li>✓ <strong>Amplitude-Schwankung</strong> — Nicht alle Wörter sind gleich laut</li>
            <li>✓ <strong>Spektrale Körnigkeit</strong> — Natürliche Unregelmäßigkeiten in Frequenzen</li>
          </ul>
          <p className="text-xs text-amber-900 font-semibold mt-3">
            Wenn Trainingsdaten zu aggressiv bereinigt werden, lernt das Modell, synthetisch zu klingen — nicht weil die Architektur schlecht ist, sondern weil es nie natürliche Variabilität gesehen hat.
          </p>
        </CardContent>
      </Card>

      {/* Training vs Inference */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">⚙️ Training vs. Inferenz: Wer kontrolliert was?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="grid grid-cols-2 gap-3">
            <div className="border rounded p-2">
              <p className="font-semibold text-blue-900 text-xs">Training (gelernt)</p>
              <ul className="text-xs text-gray-700 space-y-1 mt-2">
                <li>• Phonem-Dauer</li>
                <li>• Tonhöhenmuster</li>
                <li>• Prosodische Bereiche</li>
                <li>• Sprecheridentität</li>
              </ul>
            </div>
            <div className="border rounded p-2 bg-blue-50">
              <p className="font-semibold text-blue-900 text-xs">Inferenz (Kontrolle)</p>
              <ul className="text-xs text-gray-700 space-y-1 mt-2">
                <li>• Stichprobenziehung</li>
                <li>• Parameter-Enge</li>
                <li>• Variations-Freiheit</li>
                <li>• Preset-Bias</li>
              </ul>
            </div>
          </div>
          <p className="text-xs text-gray-700 mt-3 italic">
            Ein perfekt trainiertes Modell kann unnatürlich klingen, wenn die Inferenzkonfiguration falsch ist.
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-base">
            <Lightbulb className="mr-2 h-5 w-5 text-amber-600" />
            So funktioniert es (einfach erklärt)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="bg-amber-50 p-3 rounded border border-amber-100">
            <p className="font-semibold text-amber-900 mb-2">Das VITS-Modell ist nicht deterministische</p>
            <p className="text-gray-700">
              Das Modell speichert nicht „exakte Kopien" von Sprache. Es lernt statistische Muster von natürlicher Sprache und erzeugt jedes Mal etwas Neues — ähnlich wie ein Mensch, der einen Satz anders sagt, wenn er ihn wiederholt.
            </p>
          </div>
          <div className="bg-blue-50 p-3 rounded border border-blue-100">
            <p className="font-semibold text-blue-900 mb-2">Parameter steuern die „Stichprobenziehung"</p>
            <p className="text-gray-700">
              Die 8 Parameter sind nicht „Reparaturen" des Modells. Sie sagen dem Decoder, wie eng oder breit er aus der gelernten Verteilung sampeln soll. Zu eng = roboterartig. Zu breit = instabil. Richtig = natürlich.
            </p>
          </div>
          <div className="bg-green-50 p-3 rounded border border-green-100">
            <p className="font-semibold text-green-900 mb-2">Gute Sprachqualität = System-Eigenschaft</p>
            <p className="text-gray-700">
              Qualität kommt von: guten Trainingsdaten + good Modell-Training + richtige Inferenzkonfiguration. Ein Parameter allein kann nicht alles retten.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Parameter Documentation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Volume2 className="mr-2 h-5 w-5" />
            TTS Parameter
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="border-b pb-3">
              <h4 className="font-semibold text-sm mb-1">🔥 Temperatur</h4>
              <p className="text-sm text-muted-foreground">
                <strong>Einfach:</strong> Wie „kreativ" oder „sicher" das Modell ist.
              </p>
              <p className="text-sm text-gray-700 mt-1">
                Höher (0.85–0.95) = vielfältig, natürlich, aber manchmal inkohärent. 
                Niedriger (0.60–0.75) = konsistent, aber roboterhaft und langweilig.
              </p>
              <p className="text-xs text-muted-foreground mt-2">📍 Sicherer Bereich: 0.75–0.95 | Standard: 0.87</p>
            </div>

            <div className="border-b pb-3">
              <h4 className="font-semibold text-sm mb-1">⏱️ Länge (Geschwindigkeit)</h4>
              <p className="text-sm text-muted-foreground">
                <strong>Einfach:</strong> Wie schnell oder langsam gesprochen wird.
              </p>
              <p className="text-sm text-gray-700 mt-1">
                Unter 1.0 = schneller. Über 1.0 = langsamer.
                Zu schnell (&lt;0.90) = verschwommen. Zu langsam (&gt;1.05) = unnatürliche Pausen.
              </p>
              <p className="text-xs text-muted-foreground mt-2">📍 Sicherer Bereich: 0.90–1.05 | Standard: 0.98</p>
            </div>

            <div className="border-b pb-3">
              <h4 className="font-semibold text-sm mb-1">🎵 Tonhöhen-Variation (Noise Scale)</h4>
              <p className="text-sm text-muted-foreground">
                <strong>Einfach:</strong> Wie viel Wärme und Textur die Stimme hat.
              </p>
              <p className="text-sm text-gray-700 mt-1">
                Höher (0.80–0.95) = warm, lebendig, menschlich. 
                Niedriger (0.60–0.75) = steril, metallisch, künstlich.
              </p>
              <p className="text-xs text-muted-foreground mt-2">📍 Sicherer Bereich: 0.75–0.95 | Standard: 0.85</p>
            </div>

            <div className="border-b pb-3">
              <h4 className="font-semibold text-sm mb-1">🎙️ Prosodie-Freiheit (Noise Scale W)</h4>
              <p className="text-sm text-muted-foreground">
                <strong>Einfach:</strong> Wie ausdrucksvoll oder emotionslos die Sprache ist.
              </p>
              <p className="text-sm text-gray-700 mt-1">
                Höher (0.80–0.98) = ausdrucksvolle Intonation, Betonung wechselt. 
                Niedriger (0.60–0.75) = monoton, flache Intonation, langweilig.
              </p>
              <p className="text-xs text-muted-foreground mt-2">📍 Sicherer Bereich: 0.80–0.98 | Standard: 0.90</p>
            </div>

            <div className="border-b pb-3">
              <h4 className="font-semibold text-sm mb-1">⏸️ Rhythmische Pausen</h4>
              <p className="text-sm text-muted-foreground">
                <strong>Einfach:</strong> Wie natürlich Pausen zwischen Wörtern wirken.
              </p>
              <p className="text-sm text-gray-700 mt-1">
                Höher = variablere Pausen (natürlich). Niedriger = gleichmäßige Pausen (roboterhaft).
              </p>
              <p className="text-xs text-muted-foreground mt-2">📍 Sicherer Bereich: 0.50–0.80</p>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-1">🔊 Lautstärke-Ausgleich</h4>
              <p className="text-sm text-muted-foreground">
                <strong>Einfach:</strong> Wie natürlich die Lautstärke variiert.
              </p>
              <p className="text-sm text-gray-700 mt-1">
                Höher = zu normalisiert, flach, ausdruckslos. Niedriger = natürliche Betonung und Emphasis.
              </p>
              <p className="text-xs text-muted-foreground mt-2">📍 Sicherer Bereich: 0.90–1.05</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Troubleshooting */}
      <Card>
        <CardHeader>
          <CardTitle>❓ Wenn etwas nicht gut klingt...</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="space-y-3">
            <div className="border-l-4 border-red-500 pl-3">
              <p className="font-semibold text-red-700">Roboterartig / Monoton</p>
              <p className="text-gray-700">↑ Erhöhe: Temperatur, Tonhöhen-Variation (noiseScale), Prosodie-Freiheit</p>
            </div>
            <div className="border-l-4 border-yellow-500 pl-3">
              <p className="font-semibold text-yellow-700">Metallisch / Kreischend</p>
              <p className="text-gray-700">↓ Reduziere: Temperatur oder Tonhöhen-Variation</p>
            </div>
            <div className="border-l-4 border-orange-500 pl-3">
              <p className="font-semibold text-orange-700">Verschwommen / Undeutlich</p>
              <p className="text-gray-700">↑ Erhöhe: Länge/Geschwindigkeit (zu niedrig = zu schnell)</p>
            </div>
            <div className="border-l-4 border-purple-500 pl-3">
              <p className="font-semibold text-purple-700">Flach / Ausdruckslos</p>
              <p className="text-gray-700">↓ Reduziere: Lautstärke-Ausgleich | ↑ Erhöhe: Prosodie-Freiheit</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Model Information */}
      <Card>
        <CardHeader>
          <CardTitle>Modell Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-muted-foreground">Modelltyp</p>
              <p className="font-semibold">VITS</p>
            </div>
            <div>
              <p className="text-muted-foreground">Sprache</p>
              <p className="font-semibold">Plattdeutsch</p>
            </div>
            <div>
              <p className="text-muted-foreground">Abtastrate</p>
              <p className="font-semibold">22.050 Hz</p>
            </div>
            <div>
              <p className="text-muted-foreground">Inferenzgerät</p>
              <p className="font-semibold">CPU</p>
            </div>
            <div>
              <p className="text-muted-foreground">Modellgröße</p>
              <p className="font-semibold">951 MB</p>
            </div>
            <div>
              <p className="text-muted-foreground">Framework</p>
              <p className="font-semibold">Coqui TTS</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Testing Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle>🧪 Testrichtlinien</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <ol className="space-y-2 list-decimal list-inside">
            <li><strong>Isolieren Sie Parameter:</strong> Ändern Sie nur einen Parameter zur Zeit, um die Auswirkung zu sehen.</li>
            <li><strong>Wiederhole den gleichen Satz:</strong> Generiere den gleichen Text 2-3x hintereinander. Klingt alles identisch = Temperatur zu niedrig.</li>
            <li><strong>Vergleiche mit einem Preset:</strong> Klicke ein Preset, erzeuge, und merke dir den Sound. Verändere dann einzelne Parameter.</li>
            <li><strong>Achte auf Natürlichkeit:</strong> Ist die Sprache verständlich? Klingt sie wie menschliche Sprache (mit natürlichen Pausen und Betonung)?</li>
            <li><strong>Teste Extreme:</strong> Schiebe einen Parameter ganz nach rechts, dann ganz nach links. Du wirst schnell die „Grenzen der Qualität" finden.</li>
            <li><strong>Notiere deine Ergebnisse:</strong> Gehe zur Seite „Eindrücke" und dokumentiere gute und schlechte Kombinationen.</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  )
}
