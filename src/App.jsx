import { Routes, Route, useLocation } from "react-router-dom";
import { lazy, Suspense } from "react";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ScrollToTop from "./components/utils/ScrollToTop";
import HowToBuy from "./pages/HowToBuy";
import Portfolio from "./pages/Portfolio";
import { routePaths } from "./data/routes";

// Los catálogos deportivos se cargan al entrar a la tienda, no en la portada.
const SportsShop = lazy(() => import("./pages/Home"));
const Gallery = lazy(() => import("./pages/Gallery"));
const EventCategories = lazy(() => import("./pages/EventCategories"));
const SanMarcosSeries = lazy(() => import("./pages/SanMarcosSeries"));

function App() {
  const { pathname } = useLocation();
  return (
    <>
      <Navbar />

      <main id="contenido">
        <Suspense fallback={<p className="container" role="status">Cargando fotografías…</p>}>
          <ScrollToTop />
          <Routes key={pathname}>
            <Route path={routePaths.portfolio} element={<Portfolio />} />
            <Route path={routePaths.sanMarcos} element={<SanMarcosSeries />} />
            <Route path={routePaths.sportsShop} element={<SportsShop />} />
            <Route path={routePaths.event} element={<EventCategories />} />
            <Route path={routePaths.eventGallery} element={<Gallery />} />
            <Route path={routePaths.categoryGallery} element={<Gallery />} />
            <Route path={routePaths.howToBuy} element={<HowToBuy />} />
          </Routes>
        </Suspense>
      </main>

      <Footer />
    </>
  );
}

export default App;
