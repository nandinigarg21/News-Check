import React, { Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Main from "./pages/Main";

// ✅ Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <>
      <ScrollToTop />
      <Nav />

      <main className="min-h-[80vh]">
        {/* ✅ Suspense for future lazy routes */}
        <Suspense fallback={<div className="text-center text-white p-10">Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/main" element={<Main />} />
          </Routes>
        </Suspense>
      </main>

      <Footer />
    </>
  );
}

export default App;
