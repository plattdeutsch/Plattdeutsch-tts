/**
 * Audio Format Converter
 * Converts WAV audio to MP3 format using lamejs library
 */

/**
 * Convert WAV audio Blob to MP3 format
 * @param {Blob} wavBlob - WAV audio file as Blob
 * @param {number} bitRate - MP3 bitrate (default: 192 kbps)
 * @returns {Promise<Blob>} - MP3 audio as Blob
 */
export async function wavToMp3(wavBlob, bitRate = 192) {
  try {
    // Read WAV file
    const arrayBuffer = await wavBlob.arrayBuffer()

    // Parse WAV header using Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    const decoded = await audioContext.decodeAudioData(arrayBuffer)

    // Get audio data
    const sampleRate = decoded.sampleRate
    const numberOfChannels = decoded.numberOfChannels
    const duration = decoded.length

    // Import lamejs - handle different export formats
    let Mp3Encoder
    try {
      const lameModule = await import("lamejs")
      // Try different possible export paths
      Mp3Encoder = lameModule.default?.Mp3Encoder || lameModule.Mp3Encoder || lameModule.default
      if (!Mp3Encoder || !Mp3Encoder.Mp3Encoder) {
        // If still not found, try getting from window (global)
        if (window.lamejs && window.lamejs.Mp3Encoder) {
          Mp3Encoder = window.lamejs.Mp3Encoder
        } else {
          throw new Error("Could not find Mp3Encoder in lamejs module")
        }
      }
    } catch (importError) {
      console.error("Import error:", importError)
      throw new Error(`Failed to import lamejs: ${importError.message}`)
    }

    // Convert stereo to mono if needed
    let monoSamples
    if (numberOfChannels === 2) {
      const left = decoded.getChannelData(0)
      const right = decoded.getChannelData(1)
      monoSamples = new Float32Array(duration)
      for (let i = 0; i < duration; i++) {
        monoSamples[i] = (left[i] + right[i]) / 2
      }
    } else {
      monoSamples = decoded.getChannelData(0)
    }

    // Convert float samples to Int16
    const int16Samples = new Int16Array(duration)
    for (let i = 0; i < duration; i++) {
      const sample = monoSamples[i]
      int16Samples[i] = sample < 0 ? sample * 0x8000 : sample * 0x7fff
    }

    // Create encoder for mono (1 channel)
    let encoder
    try {
      encoder = new Mp3Encoder(1, sampleRate, bitRate)
    } catch (encoderError) {
      console.error("Encoder creation error:", encoderError)
      throw new Error(`Failed to create MP3 encoder: ${encoderError.message}`)
    }

    // Encode in chunks
    const maxSamples = 1152
    const mp3Data = []

    for (let i = 0; i < duration; i += maxSamples) {
      const chunkSize = Math.min(maxSamples, duration - i)
      const chunk = int16Samples.subarray(i, i + chunkSize)

      try {
        const encoded = encoder.encodeBuffer(chunk)
        if (encoded && encoded.length > 0) {
          mp3Data.push(new Uint8Array(encoded))
        }
      } catch (encodeError) {
        console.error(`Chunk ${i} encoding error:`, encodeError)
        // Continue with next chunk
      }
    }

    // Flush encoder
    try {
      const finalData = encoder.flush()
      if (finalData && finalData.length > 0) {
        mp3Data.push(new Uint8Array(finalData))
      }
    } catch (flushError) {
      console.error("Flush error:", flushError)
    }

    if (mp3Data.length === 0) {
      throw new Error("MP3 encoding produced no output")
    }

    return new Blob(mp3Data, { type: "audio/mpeg" })
  } catch (error) {
    console.error("Error converting WAV to MP3:", error)
    throw new Error(`MP3 conversion failed: ${error.message}`)
  }
}

/**
 * Download audio file with specified format
 * @param {Blob} audioBlob - Audio file as Blob
 * @param {string} filename - Filename for download
 * @param {string} format - Audio format (wav or mp3)
 */
export function downloadAudio(audioBlob, filename, format = "wav") {
  const url = URL.createObjectURL(audioBlob)
  const link = document.createElement("a")
  link.href = url
  link.download = `${filename}.${format}`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
