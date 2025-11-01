import { Routes, Route, useLocation } from 'react-router-dom';
import { Suspense, lazy, useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import SplashScreen from './components/SplashScreen';

const Home = lazy(() => import('./pages/Home'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

function App() {
  const location = useLocation();
  const showNavbar = !location.pathname.includes('/admin');
  const [showSplash, setShowSplash] = useState(true);

  // Only show splash screen on first visit
  useEffect(() => {
    const hasVisited = sessionStorage.getItem('hasVisited');
    if (hasVisited) {
      setShowSplash(false);
    } else {
      sessionStorage.setItem('hasVisited', 'true');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <AnimatePresence mode="wait">
        {showSplash ? (
          <SplashScreen key="splash" onComplete={() => setShowSplash(false)} />
        ) : (
          <>
            {showNavbar && <Navbar />}
            <Suspense
              fallback={
                <div className="flex items-center justify-center min-h-screen">
                  <div className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
                    Loading...
                  </div>
                </div>
              }
            >
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Home />} />
                <Route path="/admin/login" element={<AdminDashboard />} />
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </Suspense>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
