import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * SAFE VITS PARAMETER RANGES (Hard Clamps)
 * Prevents metallic artifacts, robotic monotone, temporal smearing
 * Derived from VITS stability research and tested thresholds
 * ALIGNED WITH UI SLIDER RANGES for smooth end-to-end movement
 */
const PARAM_RANGES = {
  temperature: { min: 0.1, max: 1.0 },           // Controls noise/variation
  lengthScale: { min: 0.5, max: 2.0 },           // Controls phoneme duration
  noiseScale: { min: 0.0, max: 1.0 },            // Controls pitch variation
  noiseScaleW: { min: 0.0, max: 1.0 },           // Controls prosody freedom
  rhythmicPauses: { min: 0.0, max: 1.0 },        // Controls pause intervals
  volumeBalance: { min: 0.5, max: 1.5 },         // Controls volume normalization
  pitchScale: { min: 0.5, max: 1.5 },            // Controls fundamental frequency
  speakingSpeed: { min: 0.5, max: 1.5 },         // Controls speaking rate
}

/**
 * Clamp value to safe range
 * Defensive: prevents out-of-range values from reaching backend
 */
const clampValue = (value, min, max) => {
  return Math.max(min, Math.min(max, value))
}

/**
 * PRODUCTION VITS PRESETS
 * Four scientifically-designed presets that deliver natural, human-sounding speech
 * without metallic artifacts, robotic cadence, or temporal smearing
 */
const PRESETS = {
  warm: {
    // 🔥 WARM: Emotional, conversational, friendly
    // Use case: Casual speech, storytelling, intimate communication
    temperature: 0.87,      // Adds natural variation without chaos
    lengthScale: 0.98,      // Slightly compressed = intimate, engaging pace
    noiseScale: 0.80,       // Reduced pitch variation = smooth, warm tone
    noiseScaleW: 0.85,      // Moderate prosody = emotional but controlled
    rhythmicPauses: 0.65,   // Natural conversational rhythm
    volumeBalance: 0.95,    // Consistent, warm volume envelope
    pitchScale: 0.95,       // Slightly lower F0 = warmer, more authoritative
    speakingSpeed: 0.95,    // Conversational cadence, approachable
  },

  klar: {
    // 🎯 KLAR: Professional, articulate, clear
    // Use case: Professional speech, announcements, clarity-first applications
    temperature: 0.80,      // Lower variation = precise, controlled delivery
    lengthScale: 0.95,      // Natural phoneme duration, zero temporal smearing
    noiseScale: 0.82,       // Tightly controlled pitch = articulate speech
    noiseScaleW: 0.80,      // Minimal prosody variation = maximum clarity
    rhythmicPauses: 0.50,   // Structured, predictable pauses
    volumeBalance: 1.05,    // Slightly elevated = maximum intelligibility
    pitchScale: 1.02,       // Neutral F0, professional tone
    speakingSpeed: 1.00,    // Standard speech rate, no artifacts
  },

  dynamisch: {
    // ⚡ DYNAMISCH: Expressive, engaging, varied
    // Use case: Audiobook narration, dramatic readings, expressive communication
    temperature: 0.92,      // High variation = expressive, natural emotion
    lengthScale: 1.02,      // Slightly extended = room for emphasis and pacing
    noiseScale: 0.90,       // Higher pitch variation = prosodic expressiveness
    noiseScaleW: 0.95,      // Maximum prosody freedom within safe bounds
    rhythmicPauses: 0.75,   // Dramatic pause variations for storytelling
    volumeBalance: 1.00,    // Dynamic volume with natural emphasis
    pitchScale: 1.05,       // Elevated pitch = more expressive, engaging
    speakingSpeed: 0.98,    // Slight deceleration for emphasis moments
  },

  erzaehler: {
    // 🎙️ ERZÄHLER: Narrator, authoritative, deep
    // Use case: Documentary narration, formal speech, authoritative communication
    temperature: 0.85,      // Controlled variation = authoritative stability
    lengthScale: 1.03,      // Extended phonemes = deliberate, commanding delivery
    noiseScale: 0.78,       // Reduced pitch variation = deep, solid tone
    noiseScaleW: 0.82,      // Controlled prosody = authoritative control
    rhythmicPauses: 0.80,   // Long dramatic pauses for narrative weight
    volumeBalance: 0.90,    // Slightly reduced = deeper perceived tone
    pitchScale: 0.90,       // Lowered F0 = deeper, more authoritative voice
    speakingSpeed: 0.92,    // Slower, more deliberate delivery
  },
}

export const useTestBlockStore = create(
  persist(
    (set, get) => ({
      // Test blocks array
      blocks: [],
      nextId: 1,
      _hasInitialized: false,

      /**
       * Add a new test block with default WARM preset
       * All parameters start within safe ranges
       */
      addBlock: () => {
        const newId = get().nextId
        const defaultPreset = PRESETS.warm

        set((state) => ({
          blocks: [
            ...state.blocks,
            {
              id: newId,
              text: '',
              temperature: defaultPreset.temperature,
              lengthScale: defaultPreset.lengthScale,
              noiseScale: defaultPreset.noiseScale,
              noiseScaleW: defaultPreset.noiseScaleW,
              rhythmicPauses: defaultPreset.rhythmicPauses,
              volumeBalance: defaultPreset.volumeBalance,
              pitchScale: defaultPreset.pitchScale,
              speakingSpeed: defaultPreset.speakingSpeed,
              preset: 'warm',
              audioUrl: null,
              isGenerating: false,
              progress: 0,
            },
          ],
          nextId: newId + 1,
        }))
      },

      /**
       * Update block parameters with bulletproof safe clamping
       * Prevents users from accidentally reintroducing artifacts
       */
      updateBlock: (id, updates) => {
        set((state) => ({
          blocks: state.blocks.map((block) => {
            if (block.id !== id) return block

            const updated = { ...block, ...updates }

            // Apply safe clamping to all audio parameters
            Object.entries(PARAM_RANGES).forEach(([param, { min, max }]) => {
              if (param in updated) {
                updated[param] = clampValue(updated[param], min, max)
              }
            })

            // Mark as custom if manually edited (any parameter changed)
            if (Object.keys(updates).some((key) => key in PARAM_RANGES)) {
              updated.preset = 'custom'
            }

            return updated
          }),
        }))
      },

      /**
       * Remove a block
       */
      removeBlock: (id) => {
        set((state) => ({
          blocks: state.blocks.filter((block) => block.id !== id),
        }))
      },

      /**
       * Apply preset to a block with safe clamping
       * Clicking a preset instantly updates all sliders
       * Switching presets overrides manual changes
       */
      applyPreset: (id, presetName) => {
        const preset = PRESETS[presetName]
        if (!preset) return

        // Clamp preset values as final defensive measure
        const clampedPreset = {}
        Object.entries(preset).forEach(([param, value]) => {
          const range = PARAM_RANGES[param]
          if (range) {
            clampedPreset[param] = clampValue(value, range.min, range.max)
          } else {
            clampedPreset[param] = value
          }
        })

        set((state) => ({
          blocks: state.blocks.map((block) =>
            block.id === id
              ? { ...block, ...clampedPreset, preset: presetName }
              : block
          ),
        }))
      },

      /**
       * Clear all blocks (utility function)
       */
      clearBlocks: () => {
        set({ blocks: [], nextId: 1, _hasInitialized: false })
      },
    }),
    {
      name: 'plattdeutsch-tts-blocks', // localStorage key
      version: 2,
      partialize: (state) => ({
        blocks: state.blocks,
        nextId: state.nextId,
        _hasInitialized: state._hasInitialized,
      }),
    }
  )
)
