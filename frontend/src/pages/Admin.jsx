import React, { useState } from "react"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Upload, Trash2, BarChart3, Download, AlertCircle, CheckCircle } from "lucide-react"

export function Admin() {
  // ==================== STATE ====================
  const [activeTab, setActiveTab] = useState("logs")
  
  const [models, setModels] = useState([
    { id: 1, name: "Plattdeutsch VITS v1.0", date: "2025-12-21", status: "Aktiv" },
    { id: 2, name: "Plattdeutsch VITS v0.9", date: "2025-12-15", status: "Archiviert" },
  ])

  const [stats] = useState({
    totalGenerations: 247,
    successRate: 98.5,
    avgDuration: 8.3,
    activeUsers: 12,
  })

  // Mock inference logs
  const [inferenceLogs] = useState([
    {
      id: "req-001",
      timestamp: "2025-12-22T14:32:15Z",
      textLength: 24,
      preset: "warm",
      temperature: 0.87,
      lengthScale: 0.98,
      noiseScale: 0.80,
      noiseScaleW: 0.85,
      duration: 8200,
      audioDuration: 3.2,
      rtf: 2.56,
      status: "success",
      warnings: []
    },
    {
      id: "req-002",
      timestamp: "2025-12-22T14:31:45Z",
      textLength: 18,
      preset: "klar",
      temperature: 0.80,
      lengthScale: 0.95,
      noiseScale: 0.82,
      noiseScaleW: 0.80,
      duration: 7950,
      audioDuration: 2.8,
      rtf: 2.84,
      status: "success",
      warnings: []
    },
    {
      id: "req-003",
      timestamp: "2025-12-22T14:30:20Z",
      textLength: 35,
      preset: "manual",
      temperature: 0.65,
      lengthScale: 0.88,
      noiseScale: 0.70,
      noiseScaleW: 0.75,
      duration: 9100,
      audioDuration: 4.1,
      rtf: 2.22,
      status: "warning",
      warnings: ["temperature below recommended (0.75)", "noiseScale below recommended (0.75)"]
    },
  ])

  const [selectedLog, setSelectedLog] = useState(null)
  
  // Test mode
  const [testText, setTestText] = useState("Dit is en Plattdeutsch Text zum Testen.")
  const [testPreset, setTestPreset] = useState("warm")
  const [testResults, setTestResults] = useState([])
  const [isTesting, setIsTesting] = useState(false)

  // ==================== HANDLERS ====================
  const deleteModel = (id) => {
    setModels(models.filter((m) => m.id !== id))
  }

  const runDiagnosticTest = async () => {
    setIsTesting(true)
    const results = []
    
    for (let i = 0; i < 3; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000))
      results.push({
        run: i + 1,
        duration: 8100 + Math.random() * 400,
        status: "success",
        timestamp: new Date().toISOString()
      })
    }
    
    setTestResults(results)
    setIsTesting(false)
  }

  const exportLogs = (format) => {
    const data = {
      exportDate: new Date().toISOString(),
      systemInfo: {
        modelVersion: "VITS v1.0",
        modelHash: "abc123def456",
        hardware: "CPU",
        memoryUsage: "245MB"
      },
      logs: inferenceLogs
    }

    let content = ""
    if (format === "json") {
      content = JSON.stringify(data, null, 2)
    } else if (format === "csv") {
      content = "Timestamp,TextLength,Preset,Temperature,Duration(ms),Status\n"
      inferenceLogs.forEach(log => {
        content += `${log.timestamp},${log.textLength},${log.preset},${log.temperature},${log.duration},${log.status}\n`
      })
    } else if (format === "txt") {
      content = `PLATTDEUTSCH TTS - INFERENCE LOG EXPORT\n`
      content += `Exported: ${new Date().toISOString()}\n`
      content += `Model: ${data.systemInfo.modelVersion}\n`
      content += `Hardware: ${data.systemInfo.hardware}\n`
      content += `\n${"=".repeat(80)}\n\n`
      inferenceLogs.forEach(log => {
        content += `Request ID: ${log.id}\n`
        content += `Timestamp: ${log.timestamp}\n`
        content += `Text Length: ${log.textLength} chars\n`
        content += `Preset: ${log.preset}\n`
        content += `Temperature: ${log.temperature}\n`
        content += `Duration: ${log.duration}ms\n`
        content += `Audio Duration: ${log.audioDuration}s\n`
        content += `Status: ${log.status}\n`
        if (log.warnings.length > 0) {
          content += `Warnings: ${log.warnings.join("; ")}\n`
        }
        content += `\n`
      })
    }

    const blob = new Blob([content], { type: "text/plain" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `inference-logs-${Date.now()}.${format}`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  // ==================== RENDER ====================
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8 pb-8 border-b-2 border-secondary/30">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-1.5 w-16 bg-gradient-to-r from-secondary to-primary rounded-full"></div>
              <h1 className="text-4xl font-bold text-foreground">Verwaltung & Diagnose</h1>
            </div>
            <p className="text-base text-muted-foreground mt-3">Überwachen Sie System-Performance, Modelle und Inference-Logs</p>
          </div>
          <div className="text-xs font-semibold text-secondary bg-secondary/10 px-4 py-2 rounded-lg border border-secondary/30">
            🔐 ADMIN PANEL — Nur für Operatoren
          </div>
        </div>
      </div>

      {/* System Health */}
      <Card className="border-l-4 border-secondary shadow-md">
        <CardHeader className="bg-gradient-to-r from-secondary/5 to-transparent">
          <CardTitle className="text-sm flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-secondary" />
            System-Status
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-4 gap-4 text-sm pt-6">
          <div className="pb-4 border-b border-border">
            <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Modell</p>
            <p className="font-semibold text-foreground mt-2">✓ VITS v1.0</p>
          </div>
          <div className="pb-4 border-b border-border">
            <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Speicher</p>
            <p className="font-semibold text-foreground mt-2">245 MB</p>
          </div>
          <div className="pb-4 border-b border-border">
            <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Hardware</p>
            <p className="font-semibold text-foreground mt-2">CPU</p>
          </div>
          <div className="pb-4 border-b border-border">
            <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Letzter Fehler</p>
            <p className="font-semibold">keine</p>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Generierungen</p>
            <p className="text-3xl font-bold text-primary">{stats.totalGenerations}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Erfolgsquote</p>
            <p className="text-3xl font-bold text-primary">{stats.successRate}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Ø Dauer</p>
            <p className="text-3xl font-bold text-primary">{stats.avgDuration}s</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Aktive Nutzer</p>
            <p className="text-3xl font-bold text-primary">{stats.activeUsers}</p>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b">
        {["logs", "tester", "models", "export"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab === "logs" && "📊 Logs"}
            {tab === "tester" && "🧪 Diagnose-Test"}
            {tab === "models" && "📦 Modelle"}
            {tab === "export" && "📥 Export"}
          </button>
        ))}
      </div>

      {/* TAB: Logs */}
      {activeTab === "logs" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Inference Log Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-3 py-2 text-left">Timestamp</th>
                    <th className="px-3 py-2 text-left">Preset</th>
                    <th className="px-3 py-2 text-left">Dauer</th>
                    <th className="px-3 py-2 text-left">RTF</th>
                    <th className="px-3 py-2 text-left">Status</th>
                    <th className="px-3 py-2 text-left">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {inferenceLogs.map(log => (
                    <tr key={log.id} className="hover:bg-muted/50">
                      <td className="px-3 py-2 text-xs">{new Date(log.timestamp).toLocaleTimeString()}</td>
                      <td className="px-3 py-2 font-semibold capitalize">{log.preset}</td>
                      <td className="px-3 py-2">{log.duration}ms</td>
                      <td className="px-3 py-2">{log.rtf.toFixed(2)}x</td>
                      <td className="px-3 py-2">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          log.status === "success" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {log.status === "success" ? "✓ OK" : "⚠ Warning"}
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedLog(log)}
                        >
                          Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Expanded Log View */}
            {selectedLog && (
              <div className="border-t pt-4 mt-4 space-y-3 bg-gray-50 p-3 rounded">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm">Detailierte Ansicht: {selectedLog.id}</h4>
                  <button onClick={() => setSelectedLog(null)} className="text-muted-foreground hover:text-foreground">✕</button>
                </div>
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div>
                    <p className="text-muted-foreground">Temperature</p>
                    <p className="font-mono font-semibold">{selectedLog.temperature}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Length Scale</p>
                    <p className="font-mono font-semibold">{selectedLog.lengthScale}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Noise Scale</p>
                    <p className="font-mono font-semibold">{selectedLog.noiseScale}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Noise Scale W</p>
                    <p className="font-mono font-semibold">{selectedLog.noiseScaleW}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Audio Duration</p>
                    <p className="font-mono font-semibold">{selectedLog.audioDuration}s</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Real-Time Factor</p>
                    <p className="font-mono font-semibold">{selectedLog.rtf.toFixed(2)}x</p>
                  </div>
                </div>
                {selectedLog.warnings.length > 0 && (
                  <div className="border-l-4 border-yellow-500 bg-yellow-50 p-2 rounded">
                    <p className="text-xs font-semibold text-yellow-900 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      Warnungen:
                    </p>
                    <ul className="text-xs text-yellow-800 mt-1 space-y-1">
                      {selectedLog.warnings.map((w, i) => (
                        <li key={i}>• {w}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* TAB: Diagnostic Tester */}
      {activeTab === "tester" && (
        <Card className="border-l-4 border-purple-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🧪 Admin Diagnose-Test
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-red-50 border border-red-200 p-3 rounded text-xs text-red-900">
              ⚠️ TEST MODE — Führe mehrfach Tests durch, um Inferenzvariabilität zu diagnostizieren
            </div>

            <div className="space-y-2">
              <Label htmlFor="test-text">Test-Text</Label>
              <textarea
                id="test-text"
                value={testText}
                onChange={(e) => setTestText(e.target.value)}
                className="w-full p-2 border rounded text-sm"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="test-preset">Preset</Label>
                <select
                  id="test-preset"
                  value={testPreset}
                  onChange={(e) => setTestPreset(e.target.value)}
                  className="w-full p-2 border rounded text-sm"
                >
                  <option value="warm">🔥 Warm</option>
                  <option value="klar">🎯 Klar</option>
                  <option value="dynamisch">⚡ Dynamisch</option>
                  <option value="erzaehler">🎙️ Erzähler</option>
                </select>
              </div>
              <div className="flex items-end">
                <Button
                  onClick={runDiagnosticTest}
                  disabled={isTesting}
                  className="w-full"
                >
                  {isTesting ? "⏳ Laufe..." : "Starte 3x Test"}
                </Button>
              </div>
            </div>

            {testResults.length > 0 && (
              <div className="border-t pt-4 space-y-3">
                <h4 className="font-semibold text-sm">Test-Ergebnisse</h4>
                <div className="grid grid-cols-3 gap-2">
                  {testResults.map(result => (
                    <div key={result.run} className="border rounded p-2 bg-gray-50">
                      <p className="text-xs text-muted-foreground">Run {result.run}</p>
                      <p className="font-mono font-semibold text-sm">{result.duration.toFixed(0)}ms</p>
                      <p className="text-xs text-green-600">✓ {result.status}</p>
                    </div>
                  ))}
                </div>
                {testResults.length >= 2 && (
                  <div className="bg-blue-50 border border-blue-200 p-2 rounded text-xs">
                    <p className="font-semibold text-blue-900">Variabilität-Analyse:</p>
                    <p className="text-blue-800 mt-1">
                      Min: {Math.min(...testResults.map(r => r.duration)).toFixed(0)}ms |
                      Max: {Math.max(...testResults.map(r => r.duration)).toFixed(0)}ms |
                      Bereich: {(Math.max(...testResults.map(r => r.duration)) - Math.min(...testResults.map(r => r.duration))).toFixed(0)}ms
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* TAB: Models */}
      {activeTab === "models" && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Modell importieren</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="model-upload">Modell-Datei (.pth)</Label>
                  <div className="flex gap-2">
                    <Input id="model-upload" type="file" accept=".pth,.pt" className="flex-1" />
                    <Button>
                      <Upload className="mr-2 h-4 w-4" />
                      Hochladen
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="config-upload">Konfiguration (.json)</Label>
                  <div className="flex gap-2">
                    <Input id="config-upload" type="file" accept=".json" className="flex-1" />
                    <Button>
                      <Upload className="mr-2 h-4 w-4" />
                      Hochladen
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="mr-2 h-5 w-5" />
                Verfügbare Modelle
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {models.map(model => (
                  <div key={model.id} className="flex items-center justify-between p-3 border rounded bg-gray-50">
                    <div>
                      <p className="font-semibold text-sm">{model.name}</p>
                      <p className="text-xs text-muted-foreground">{model.date}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded ${
                        model.status === "Aktiv" ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-800"
                      }`}>
                        {model.status}
                      </span>
                      <Button size="sm" variant="ghost" onClick={() => deleteModel(model.id)}>
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* TAB: Export */}
      {activeTab === "export" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Log Export & Audit
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 p-3 rounded text-sm text-blue-900">
              💾 Exportiere strukturierte Logs für QA-Audits, Bug-Reports und Performance-Benchmarking
            </div>

            <div className="grid grid-cols-3 gap-3">
              <Button onClick={() => exportLogs("json")} className="bg-blue-600 hover:bg-blue-700">
                📄 JSON exportieren
              </Button>
              <Button onClick={() => exportLogs("csv")} className="bg-green-600 hover:bg-green-700">
                📊 CSV exportieren
              </Button>
              <Button onClick={() => exportLogs("txt")} className="bg-purple-600 hover:bg-purple-700">
                📝 TXT-Report
              </Button>
            </div>

            <div className="border-t pt-4 space-y-2">
              <h4 className="font-semibold text-sm">Was wird exportiert:</h4>
              <ul className="text-xs text-muted-foreground space-y-1 list-inside">
                <li>✓ System-Metadaten (Model Hash, Hardware, Memory)</li>
                <li>✓ Alle Inference-Parameter</li>
                <li>✓ Timing-Breakdowns (Start/End, Duration)</li>
                <li>✓ Warnungen und Anomalien</li>
                <li>✓ Request-UUIDs für Rückverfolgbarkeit</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
