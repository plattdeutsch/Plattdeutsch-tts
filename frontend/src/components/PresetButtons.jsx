import React from "react"
import { Button } from "@/components/ui/Button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/Tooltip"
import { useTestBlockStore } from "@/store/testBlockStore"

const PRESETS = [
  {
    id: "warm",
    label: "Warm",
    icon: "🔥",
    tooltip: "Emotional, freundlich und konversativ - Für Geschichten und intime Kommunikation",
  },
  {
    id: "klar",
    label: "Klar",
    icon: "🎯",
    tooltip: "Professionell, artikuliert und deutlich - Für Ankündigungen und Klarheit",
  },
  {
    id: "dynamisch",
    label: "Dynamisch",
    icon: "⚡",
    tooltip: "Ausdrucksvoll, abwechslungsreich und engagierend - Für Audiobooks und Drama",
  },
  {
    id: "erzaehler",
    label: "Erzähler",
    icon: "🎙️",
    tooltip: "Autorität, Tiefe und dramatisch - Für dokumentarische Erzählungen",
  },
]

export function PresetButtons({ blockId }) {
  const applyPreset = useTestBlockStore((state) => state.applyPreset)
  const currentPreset = useTestBlockStore((state) =>
    state.blocks.find((b) => b.id === blockId)?.preset
  )

  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-foreground">Vordefinierte Einstellungen</p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <TooltipProvider>
          {PRESETS.map((preset) => (
            <Tooltip key={preset.id}>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => applyPreset(blockId, preset.id)}
                  variant={currentPreset === preset.id ? "default" : "outline"}
                  className="h-auto flex-col gap-1 p-2 text-xs"
                >
                  <span className="text-lg">{preset.icon}</span>
                  <span>{preset.label}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>{preset.tooltip}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>
    </div>
  )
}
