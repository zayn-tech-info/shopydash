import { Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";


function App() {
  return (
    <>
      <div>
        <Navbar />
        <Home />
        <Footer />
      </div>
    </>
  );
}

export default App;
