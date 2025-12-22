import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"

export function Impressum() {
  return (
    <div className="space-y-6">
      <div className="mb-8 pb-8 border-b-2 border-primary/20">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-1.5 w-16 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
          <h1 className="text-4xl font-bold text-foreground">Impressum</h1>
        </div>
        <p className="text-base text-muted-foreground mt-3">Rechtliche Informationen und Kontaktdaten</p>
      </div>

      <div className="grid gap-6">
        {/* Responsible Organization */}
        <Card className="shadow-md border-primary/10">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
            <CardTitle className="text-lg text-foreground">Verantwortliche Stelle</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div>
              <p className="font-semibold text-lg text-primary">Heimatverein Riesenbeck e.V.</p>
              <p className="text-muted-foreground mt-1">Ein Projekt des</p>
            </div>
            
            <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-4 rounded-lg border border-primary/20 space-y-2">
              <div>
                <p className="font-semibold text-foreground">Heimatverein Riesenbeck e.V.</p>
                <p className="text-sm text-muted-foreground">Am Vogelsang 75</p>
                <p className="text-sm text-muted-foreground">48477 Hörstel</p>
              </div>
              
              <div className="pt-3 border-t border-primary/10">
                <p className="text-sm">
                  <span className="font-semibold text-primary">Vereinsregister:</span> <span className="font-mono">10517</span>
                </p>
                <p className="text-sm">
                  <span className="font-semibold text-primary">Registergericht:</span> Amtsgericht Steinfurt
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Project Information */}
        <Card>
          <CardHeader>
            <CardTitle>Projektbeschreibung</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p>
              <strong>Plattdeutsch TTS</strong> ist ein Projekt des Heimatvereins Riesenbeck e.V. zur Förderung und Erhaltung der plattdeutschen Sprache.
            </p>
            <p>
              Das System ermöglicht die Text-to-Speech-Synthese in Plattdeutsch und stellt Tools zur Evaluierung und zum Testen der Sprachqualität bereit.
            </p>
          </CardContent>
        </Card>

        {/* Technical Information */}
        <Card>
          <CardHeader>
            <CardTitle>Technische Informationen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="font-semibold">Technologie-Stack</p>
              <ul className="text-sm text-muted-foreground mt-2 space-y-1 list-inside">
                <li>• React 18.2.0 (Frontend)</li>
                <li>• Flask (Backend)</li>
                <li>• Coqui TTS VITS (Sprachsynthese)</li>
                <li>• Tailwind CSS & shadcn/ui (UI Components)</li>
              </ul>
            </div>

            <div className="pt-3 border-t border-border">
              <p className="font-semibold">Versionen</p>
              <p className="text-sm text-muted-foreground mt-2">
                Frontend: <span className="font-mono">2.1.0</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Backend: <span className="font-mono">2.0.0</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Data Protection */}
        <Card>
          <CardHeader>
            <CardTitle>Datenschutz</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="font-semibold mb-2">Datenspeicherung</p>
              <p className="text-sm text-muted-foreground">
                Ihre Test-Blöcke und Parameter werden lokal im Browser gespeichert (localStorage). 
                Keine Daten werden an externe Server übertragen, mit Ausnahme der Anfragen an den TTS-API.
              </p>
            </div>

            <div className="pt-3 border-t border-border">
              <p className="font-semibold mb-2">Cookies & Tracking</p>
              <p className="text-sm text-muted-foreground">
                Diese Anwendung verwendet keine Tracking-Tools, Analytics oder Werbung. 
                Nur funktionelle Cookies (localStorage) werden verwendet.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <Card>
          <CardHeader>
            <CardTitle>Haftungsausschluss</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Diese Anwendung wird bereitgestellt "wie es ist" (as-is). Der Heimatverein Riesenbeck e.V. 
              übernimmt keine Haftung für:
            </p>
            <ul className="text-sm text-muted-foreground space-y-1 list-inside">
              <li>• Genauigkeit oder Qualität der synthetisierten Sprache</li>
              <li>• Verfügbarkeit oder ununterbrochener Betrieb der Anwendung</li>
              <li>• Datenverlust oder Datenbeschädigungen</li>
              <li>• Indirekte oder Folgeschäden</li>
            </ul>
            <p className="text-sm text-muted-foreground pt-3 border-t border-border">
              Die Nutzung der Anwendung erfolgt auf eigenes Risiko.
            </p>
          </CardContent>
        </Card>

        {/* License */}
        <Card>
          <CardHeader>
            <CardTitle>Lizenzierung</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Dieses Projekt nutzt quelloffene Software und Bibliotheken, die unter verschiedenen Lizenzen veröffentlicht sind.
            </p>
            <div className="bg-gray-50 p-3 rounded text-sm text-muted-foreground space-y-1">
              <p>• <strong>React:</strong> MIT License</p>
              <p>• <strong>Coqui TTS:</strong> MPL-2.0 License</p>
              <p>• <strong>Tailwind CSS:</strong> MIT License</p>
              <p>• <strong>shadcn/ui:</strong> MIT License</p>
            </div>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-900">Kontakt & Fragen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm">
              Für Fragen oder Anmerkungen zum Projekt kontaktieren Sie bitte:
            </p>
            <div className="bg-white p-3 rounded border border-blue-200">
              <p className="font-semibold">Heimatverein Riesenbeck e.V.</p>
              <p className="text-sm">Am Vogelsang 75</p>
              <p className="text-sm">48477 Hörstel</p>
              <p className="text-sm pt-2 text-blue-600">Deutschland</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="pt-6 border-t border-border">
        <p className="text-xs text-muted-foreground text-center">
          Plattdeutsch TTS — ein Projekt von Heimatverein Riesenbeck e.V.
        </p>
        <p className="text-xs text-muted-foreground text-center mt-1">
          Zur Förderung und Erhaltung der plattdeutschen Sprache
        </p>
      </div>
    </div>
  )
}
