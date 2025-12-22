import React from "react"
import { Link, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/Button"
import { Zap, Settings, BookOpen, MessageSquare, Info } from "lucide-react"
import logo from "@/pages/logo.png"

export function Sidebar() {
  const location = useLocation()

  const navItems = [
    { path: "/", label: "Arbeitsbereich", icon: Zap },
    { path: "/admin", label: "Verwaltung", icon: Settings },
    { path: "/documentation", label: "Dokumentation", icon: BookOpen },
    { path: "/impressions", label: "Eindrücke", icon: MessageSquare },
    { path: "/impressum", label: "Impressum", icon: Info },
  ]

  return (
    <aside className="w-64 border-r-2 border-primary/20 bg-gradient-to-b from-card to-card/95 shadow-lg">
      {/* Logo */}
      <div className="p-6 border-b-2 border-primary/20 bg-gradient-to-b from-primary/10 to-transparent">
        {/* Logo on top */}
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-gradient-to-br from-primary to-secondary rounded-lg shadow-md">
            <img src={logo} alt="Plattdeutsch TTS" className="h-14 w-14 object-contain drop-shadow-sm" />
          </div>
        </div>
        {/* Name below logo */}
        <div className="text-center mb-3">
          <h1 className="text-xl font-bold leading-tight text-foreground">Plattdeutsch</h1>
          <p className="text-sm font-semibold text-primary">TTS</p>
        </div>
        <p className="text-xs text-muted-foreground text-center font-medium">Tester & Evaluierung</p>
        <p className="text-xs text-muted-foreground text-center mt-4 pt-4 border-t-2 border-primary/20">ein Projekt von<br /><span className="font-bold text-primary">Heimatverein Riesenbeck e.V.</span></p>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {navItems.map(({ path, label, icon: Icon }) => {
          const isActive = location.pathname === path
          return (
            <Link key={path} to={path}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={isActive ? "w-full justify-start bg-primary hover:bg-primary/90 text-primary-foreground shadow-md" : "w-full justify-start text-foreground hover:bg-primary/10"}
              >
                <Icon className="mr-2 h-4 w-4" />
                {label}
              </Button>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 w-64 p-4 border-t-2 border-primary/20 bg-gradient-to-t from-primary/10 to-card space-y-2">
        <p className="text-xs text-muted-foreground text-center font-semibold">v2.1.0 | Plattdeutsch TTS</p>
        <Link to="/impressum" className="block">
          <Button variant="ghost" size="sm" className="w-full text-xs text-primary hover:bg-primary/10 font-medium">
            <Info className="mr-1 h-3 w-3" />
            Impressum
          </Button>
        </Link>
      </div>
    </aside>
  )
}

export function Layout({ children }) {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  )
}
