import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Layout } from "@/components/Layout"
import { Workspace } from "@/pages/Workspace"
import { Admin } from "@/pages/Admin"
import { Documentation } from "@/pages/Documentation"
import { Impressions } from "@/pages/Impressions"
import { Impressum } from "@/pages/Impressum"
import "@/index.css"

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Workspace />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/documentation" element={<Documentation />} />
          <Route path="/impressions" element={<Impressions />} />
          <Route path="/impressum" element={<Impressum />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
