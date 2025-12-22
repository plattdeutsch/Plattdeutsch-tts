import React from 'react'

export default function NavBar({ currentPage, onPageChange }) {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span>🎤</span>
        <div>
          <div>Plattdeutsch TTS</div>
          <div className="navbar-brand-subtitle">Interaktives Sprach-Synthesetool</div>
        </div>
      </div>
      
      <div className="navbar-nav">
        <a 
          href="#" 
          onClick={(e) => { e.preventDefault(); onPageChange('testlab') }}
          style={{ fontWeight: currentPage === 'testlab' ? 'bold' : 'normal' }}
        >
          Testlabor
        </a>
        <a 
          href="#" 
          onClick={(e) => { e.preventDefault(); onPageChange('admin') }}
          style={{ fontWeight: currentPage === 'admin' ? 'bold' : 'normal' }}
        >
          Verwaltung
        </a>
        <a 
          href="#" 
          onClick={(e) => { e.preventDefault(); onPageChange('docs') }}
          style={{ fontWeight: currentPage === 'docs' ? 'bold' : 'normal' }}
        >
          Dokumentation
        </a>
      </div>
      
      <div className="navbar-actions">
        <button 
          className="btn-add-group"
          onClick={() => onPageChange('testlab')}
        >
          + Testgruppe
        </button>
      </div>
    </nav>
  )
}
