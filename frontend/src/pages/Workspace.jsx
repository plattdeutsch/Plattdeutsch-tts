import React, { useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Textarea } from "@/components/ui/Textarea"
import { Label } from "@/components/ui/Label"
import { Progress } from "@/components/ui/Progress"
import { Alert, AlertDescription } from "@/components/ui/Alert"
import { Plus, Download, Zap, Loader2, Trash2, AlertCircle, FileAudio } from "lucide-react"
import { useTestBlockStore } from "@/store/testBlockStore"
import { PresetButtons } from "@/components/PresetButtons"
import { FineTuningPanel } from "@/components/FineTuningPanel"
import { wavToMp3, downloadAudio } from "@/lib/audioConverter.js"




export function TestBlock({ blockId }) {
  const block = useTestBlockStore((state) =>
    state.blocks.find((b) => b.id === blockId)
  )
  const updateBlock = useTestBlockStore((state) => state.updateBlock)
  const removeBlock = useTestBlockStore((state) => state.removeBlock)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isConverting, setIsConverting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [audioBlob, setAudioBlob] = useState(null)
  const [audioUrl, setAudioUrl] = useState(null)
  const [error, setError] = useState(null)

  if (!block) return null

  const handleTextChange = (text) => {
    updateBlock(blockId, { text })
  }

  const handleParameterChange = (key, value) => {
    updateBlock(blockId, { [key]: value })
  }

  const handleGenerate = useCallback(async () => {
    if (!block.text.trim()) {
      setError("Bitte geben Sie einen Text ein")
      return
    }

    setError(null)
    setIsGenerating(true)
    setProgress(0)

    try {
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90))
      }, 200)

      const response = await fetch("http://127.0.0.1:5000/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: block.text.trim(),
          temperature: block.temperature || 0.7,
          length_scale: block.lengthScale || 1.03,
          noise_scale: block.noiseScale || 0.78,
          noise_scale_w: block.noiseScaleW || 0.92,
        }),
      })

      clearInterval(progressInterval)

      if (response.ok) {
        const blob = await response.blob()
        setAudioBlob(blob)
        const url = URL.createObjectURL(blob)
        setAudioUrl(url)
        setProgress(100)
        setTimeout(() => setProgress(0), 1000)
      } else {
        setError("Fehler bei der Audiogenerierung")
        setProgress(0)
      }
    } catch (err) {
      console.error("Error:", err)
      setError("Fehler: " + err.message)
      setProgress(0)
    } finally {
      setIsGenerating(false)
    }
  }, [block.text, block.temperature, block.lengthScale, block.noiseScale, block.noiseScaleW])

  const handleDownload = useCallback(async (format) => {
    if (!audioBlob) return

    try {
      setIsConverting(true)
      const link = document.createElement("a")
      const timestamp = Date.now()

      if (format === "wav") {
        // Direct WAV download
        const url = URL.createObjectURL(audioBlob)
        link.href = url
        link.download = `plattdeutsch-${timestamp}.wav`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      } else if (format === "mp3") {
        // Convert to MP3
        const mp3Blob = await wavToMp3(audioBlob, 192)
        const url = URL.createObjectURL(mp3Blob)
        link.href = url
        link.download = `plattdeutsch-${timestamp}.mp3`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      }
    } catch (err) {
      console.error("Download error:", err)
      setError(`Fehler beim Download: ${err.message}`)
    } finally {
      setIsConverting(false)
    }
  }, [audioBlob])

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Testblock {blockId}</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => removeBlock(blockId)}
            className="hover:bg-destructive/20"
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-4 overflow-y-auto">
        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Text Input */}
        <div className="space-y-2">
          <Label htmlFor={`text-${blockId}`}>Plattdeutsch Text</Label>
          <Textarea
            id={`text-${blockId}`}
            placeholder="Geben Sie Plattdeutsch-Text ein..."
            value={block.text}
            onChange={(e) => handleTextChange(e.target.value)}
            className="min-h-[100px]"
          />
          <p className="text-xs text-muted-foreground">
            {block.text.length} Zeichen
          </p>
        </div>

        {/* Preset Buttons */}
        <div className="pt-2">
          <PresetButtons blockId={blockId} />
        </div>

        {/* Fine-Tuning Panel */}
        <FineTuningPanel
          blockId={blockId}
          values={{
            temperature: block.temperature || 0.7,
            lengthScale: block.lengthScale || 1.03,
            noiseScale: block.noiseScale || 0.78,
            noiseScaleW: block.noiseScaleW || 0.92,
            rhythmicPauses: block.rhythmicPauses || 0.5,
            volumeBalance: block.volumeBalance || 1.0,
            pitchScale: block.pitchScale || 1.0,
            speakingSpeed: block.speakingSpeed || 1.0,
          }}
          onChange={handleParameterChange}
        />

        {/* Progress */}
        {progress > 0 && (
          <div className="space-y-1 mt-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Generierung läuft...</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} />
          </div>
        )}

        {/* Audio Player */}
        {audioUrl && (
          <div className="bg-accent/10 p-3 rounded-md">
            <p className="text-xs font-semibold text-muted-foreground mb-2">
              📻 Ergebnis
            </p>
            <audio controls className="w-full" src={audioUrl} />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4 sticky bottom-0 bg-white">
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !block.text.trim()}
            className="flex-1"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generiert...
              </>
            ) : (
              <>
                <Zap className="mr-2 h-4 w-4" />
                Generieren
              </>
            )}
          </Button>
          
          {/* Download Menu */}
          {audioBlob && (
            <div className="flex gap-1 flex-1">
              <Button
                onClick={() => handleDownload("wav")}
                disabled={isConverting}
                variant="secondary"
                className="flex-1 text-xs"
              >
                {isConverting ? (
                  <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                ) : (
                  <FileAudio className="mr-1 h-3 w-3" />
                )}
                WAV
              </Button>
              <Button
                onClick={() => handleDownload("mp3")}
                disabled={isConverting}
                variant="secondary"
                className="flex-1 text-xs"
              >
                {isConverting ? (
                  <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                ) : (
                  <Download className="mr-1 h-3 w-3" />
                )}
                MP3
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export function Workspace() {
  const blocks = useTestBlockStore((state) => state.blocks)
  const addBlock = useTestBlockStore((state) => state.addBlock)
  const initialized = useTestBlockStore((state) => state._hasInitialized)

  // Initialize with one block on first load
  useEffect(() => {
    if (!initialized && blocks.length === 0) {
      addBlock()
      useTestBlockStore.setState({ _hasInitialized: true })
    }
  }, [initialized, blocks.length, addBlock])

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="mb-8 pb-8 border-b-2 border-primary/20">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-1.5 w-16 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
              <h1 className="text-4xl font-bold text-foreground">Arbeitsbereich</h1>
            </div>
            <p className="text-base text-muted-foreground mt-3">
              Erstellen und verwalten Sie Testblöcke für die Sprachsynthese
            </p>
          </div>
          <Button onClick={() => addBlock()} size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg">
            <Plus className="mr-2 h-5 w-5" />
            Block hinzufügen
          </Button>
        </div>
      </div>

      {/* Canvas Grid */}
      {blocks.length === 0 ? (
        <Card className="flex items-center justify-center h-96 border-2 border-dashed border-primary/20 bg-gradient-to-b from-primary/5 to-transparent">
          <div className="text-center">
            <FileAudio className="h-16 w-16 text-primary/40 mx-auto mb-4" />
            <p className="text-muted-foreground mb-4 text-lg font-medium">Keine Testblöcke vorhanden</p>
            <Button onClick={() => addBlock()} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Plus className="mr-2 h-4 w-4" />
              Ersten Block erstellen
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-max">
          {blocks.map((block) => (
            <TestBlock key={block.id} blockId={block.id} />
          ))}
        </div>
      )}

      {/* Info Card */}
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/30 shadow-md">
        <CardContent className="pt-6">
          <p className="text-sm text-foreground">
            <strong className="text-primary">💡 Tipp:</strong> Nutzen Sie die Preset-Buttons, um schnell verschiedene Sprachstile
            auszuprobieren. Passen Sie dann einzelne Parameter an, um das perfekte Ergebnis zu erhalten.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

