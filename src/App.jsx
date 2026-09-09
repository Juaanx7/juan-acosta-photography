import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import Home from "./pages/Home";
import Gallery from "./pages/Gallery";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ScrollToTop from "./components/utils/ScrollToTop";
import HowToBuy from "./pages/HowToBuy";
import EventCategories from "./pages/EventCategories";

const PlateEditor = import.meta.env.PLATES_EDITOR
  ? lazy(() => import("./internal/PlateEditor"))
  : null;

function App() {
  return (
    <>
      <ScrollToTop />
      <Navbar />

      <main>
        <Routes>
          {import.meta.env.PLATES_EDITOR && <Route path="/internal/plates" element={
            <Suspense fallback={<p>Cargando editor…</p>}><PlateEditor /></Suspense>
          } />}
          <Route path="/" element={<Home />} />
            <Route path="/evento/:eventId" element={<EventCategories />} />
            <Route path="/evento/:eventId/galeria" element={<Gallery />} />
            <Route path="/evento/:eventId/:categoryId" element={<Gallery />} />
            <Route path="/como-comprar" element={<HowToBuy />} />
        </Routes>
      </main>

      <Footer />
    </>
  );
}

export default App;
