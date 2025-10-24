import { Route, Routes } from "react-router-dom";
import { Herosection } from "./components/hero-section";
import { Navbar } from "./components/Navbar";
function App() {
  return (
    <>
      <Navbar />
      <div>
        <Herosection />
      </div>
    </>
  );
}

export default App;
