import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Label } from "@/components/ui/Label"
import { Slider } from "@/components/ui/Slider"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/Tooltip"
import { HelpCircle } from "lucide-react"

const SLIDER_CONFIG = [
  {
    key: "temperature",
    label: "Temperatur",
    min: 0.1,
    max: 1.0,
    step: 0.05,
    tooltip: "Zufälligkeit der Synthese. Höher = variabler, niedriger = konsistenter",
  },
  {
    key: "lengthScale",
    label: "Länge (Geschwindigkeit)",
    min: 0.5,
    max: 2.0,
    step: 0.05,
    tooltip: "Sprechgeschwindigkeit. < 1 = schneller, > 1 = langsamer",
  },
  {
    key: "noiseScale",
    label: "Tonhöhen-Variation",
    min: 0.0,
    max: 1.0,
    step: 0.05,
    tooltip: "Mikrovariationen in der Tonhöhe für natürlichere Sprache",
  },
  {
    key: "noiseScaleW",
    label: "Prosodie-Freiheit",
    min: 0.0,
    max: 1.0,
    step: 0.05,
    tooltip: "Variation im Rhythmus und der Betonung",
  },
  {
    key: "rhythmicPauses",
    label: "Rhythmische Pausen",
    min: 0.0,
    max: 1.0,
    step: 0.05,
    tooltip: "Länge und Häufigkeit der Pausen zwischen Wörtern",
  },
  {
    key: "volumeBalance",
    label: "Lautstärkeausgleich",
    min: 0.5,
    max: 1.5,
    step: 0.05,
    tooltip: "Dynamik der Lautstärke. 1.0 = normal, > 1 = mehr Dynamik",
  },
  {
    key: "pitchScale",
    label: "Pitch-Skala",
    min: 0.5,
    max: 1.5,
    step: 0.05,
    tooltip: "Gesamte Tonhöhe. < 1 = tiefer, > 1 = höher",
  },
  {
    key: "speakingSpeed",
    label: "Sprechgeschwindigkeit",
    min: 0.5,
    max: 1.5,
    step: 0.05,
    tooltip: "Gesamte Sprechgeschwindigkeit unabhängig von Länge",
  },
]

export function FineTuningPanel({ blockId, values, onChange }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">🎚️ Erweiterte Feineinstellungen</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <TooltipProvider>
          {SLIDER_CONFIG.map((config) => (
            <div key={config.key} className="space-y-2 border-b pb-3 last:border-b-0 last:pb-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Label htmlFor={`${blockId}-${config.key}`} className="font-medium">
                    {config.label}
                  </Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>{config.tooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <span className="font-mono text-sm font-semibold text-primary">
                  {values[config.key]?.toFixed(2) || "0.00"}
                </span>
              </div>
              <Slider
                id={`${blockId}-${config.key}`}
                value={[values[config.key] || config.min]}
                onValueChange={(val) => onChange(config.key, val[0])}
                min={config.min}
                max={config.max}
                step={config.step}
                className="w-full cursor-pointer"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{config.min}</span>
                <span>{config.max}</span>
              </div>
            </div>
          ))}
        </TooltipProvider>
      </CardContent>
    </Card>
  )
}
