import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Gallery from "./pages/Gallery";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ScrollToTop from "./components/utils/ScrollToTop";
import HowToBuy from "./pages/HowToBuy";
import EventCategories from "./pages/EventCategories";

function App() {
  return (
    <>
      <ScrollToTop />
      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/evento/:eventId" element={<Gallery />} />
          <Route path="/evento/:eventId/:categoryId" element={<Gallery />} />
          <Route path="/como-comprar" element={<HowToBuy />} />
        </Routes>
      </main>

      <Footer />
    </>
  );
}

export default App;