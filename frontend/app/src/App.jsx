import { Route, Routes } from "react-router-dom"
import { Home } from "./pages/Home"

const App = () => {
  return (
    <div className="text-xl">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </div>
  )
}

export default App