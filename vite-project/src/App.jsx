import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import AuditPage from './pages/AuditPage'
import ResultsPage from './pages/ResultsPage'
import PublicAuditPage from './pages/PublicAuditPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/audit" element={<AuditPage />} />
      <Route path="/results" element={<ResultsPage />} />
      <Route path="/audit/:shareableId" element={<PublicAuditPage />} />
    </Routes>
  )
}

export default App