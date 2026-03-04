import { BrowserRouter, Routes, Route } from "react-router-dom"
import DarkVeil from "./components/DarkVeil"
import GradientText from "./components/GradientText"
import Home from "./pages/Home"
import Stock from "./pages/Stock"
import "./App.css"

function App() {
  return (
    <BrowserRouter>
      <div className="fixed inset-0 overflow-hidden">
        
        {/* Background layer */}
        <div className="absolute inset-0 -z-10">
          <DarkVeil
            hueShift={0}
            noiseIntensity={0}
            scanlineIntensity={0}
            speed={0.5}
            scanlineFrequency={0}
            warpAmount={0}
            resolutionScale={1}
          />
        </div>

        {/* Content layer */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/stock" element={<Stock />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App