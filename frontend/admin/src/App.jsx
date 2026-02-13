import { Route, Routes } from "react-router-dom"
import Dashboard from "./pages/Dashboard"

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/dashboard" element={<Dashboard /> } />
      </Routes>
    </div>
  )
}

export default App