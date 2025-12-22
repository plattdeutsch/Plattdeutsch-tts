import React, { useState } from "react"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Textarea } from "@/components/ui/Textarea"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { MessageSquare, Plus, Trash2 } from "lucide-react"

const FEEDBACK_TAGS = [
  "natürlich",
  "monoton",
  "warm",
  "kühl",
  "schnell",
  "langsam",
  "präzise",
  "verschwommen",
  "ausdrucksvoll",
  "emotionslos",
]

export function Impressions() {
  const [entries, setEntries] = useState([
    {
      id: 1,
      text: "Erste Tests zeigen gute Ergebnisse bei Standard-Parameter.",
      tags: ["natürlich", "präzise"],
      date: "2025-12-21",
    },
  ])
  const [newText, setNewText] = useState("")
  const [selectedTags, setSelectedTags] = useState([])

  const addEntry = () => {
    if (newText.trim()) {
      setEntries([
        ...entries,
        {
          id: Date.now(),
          text: newText,
          tags: selectedTags,
          date: new Date().toISOString().split("T")[0],
        },
      ])
      setNewText("")
      setSelectedTags([])
    }
  }

  const deleteEntry = (id) => {
    setEntries(entries.filter((e) => e.id !== id))
  }

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag))
    } else {
      setSelectedTags([...selectedTags, tag])
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8 pb-8 border-b-2 border-primary/20">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-1.5 w-16 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
          <h1 className="text-4xl font-bold text-foreground">Eindrücke & Bewertungen</h1>
        </div>
        <p className="text-base text-muted-foreground mt-3">Dokumentieren Sie Ihre Eindrücke zur Sprachqualität und nutzen Sie Tags zur Organisation</p>
      </div>

      {/* Input Section */}
      <Card className="shadow-md border-primary/10">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardTitle className="flex items-center text-lg">
            <MessageSquare className="mr-2 h-5 w-5 text-primary" />
            Neue Bewertung hinzufügen
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          {/* Textarea */}
          <div className="space-y-2">
            <Label htmlFor="feedback" className="text-foreground font-semibold">Notizen & Feedback</Label>
            <Textarea
              id="feedback"
              placeholder="Beschreiben Sie Ihre Eindrücke und Beobachtungen..."
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags (optional)</Label>
            <div className="flex flex-wrap gap-2">
              {FEEDBACK_TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    selectedTags.includes(tag)
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-accent"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <Button onClick={addEntry} disabled={!newText.trim()} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Bewertung hinzufügen
          </Button>
        </CardContent>
      </Card>

      {/* Entries List */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Letzte Bewertungen ({entries.length})</h2>
        {entries.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center h-32">
              <p className="text-muted-foreground">Keine Bewertungen vorhanden</p>
            </CardContent>
          </Card>
        ) : (
          entries.map((entry) => (
            <Card key={entry.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-3">
                  <p className="text-xs text-muted-foreground">{entry.date}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteEntry(entry.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
                <p className="mb-3 text-sm">{entry.text}</p>
                {entry.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {entry.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-block px-2 py-1 bg-accent/20 text-accent rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
