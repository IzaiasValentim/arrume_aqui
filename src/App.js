import React, { useState, useEffect } from 'react';
import Home from './pages/Home';
import Denunciar from './pages/Denunciar';
import Login from './pages/Login';
import PainelAdmin from './pages/PainelAdmin';

// Main App component to handle routing
const App = () => {
  // State to manage the current path for simple routing
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  // Effect to listen for path changes (e.g., when browser history changes)
  useEffect(() => {
    const onLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    // Add event listener for popstate (back/forward buttons)
    window.addEventListener('popstate', onLocationChange);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('popstate', onLocationChange);
    };
  }, []);

  // Function to navigate to a new path
  const navigate = (path) => {
    window.history.pushState({}, '', path); // Update browser history
    setCurrentPath(path); // Update current path state
  };

  // Render different components based on the current path
  const renderPage = () => {
    switch (currentPath) {
      case '/':
        return <Home navigate={navigate} />;
      case '/denunciar':
        return <Denunciar navigate={navigate} />;
      case '/admin/login':
        return <Login navigate={navigate} />;
      case '/admin':
        // For the admin panel, we'll need a simple authentication check
        // For now, it's accessible directly, but will be protected by Login later
        return <PainelAdmin navigate={navigate} />;
      default:
        // Fallback for unknown paths
        return (
          <div className="container mt-5 text-center">
            <h1 className="display-4">404 - Página Não Encontrada</h1>
            <p className="lead">A página que você está procurando não existe.</p>
            <button className="btn btn-primary mt-3" onClick={() => navigate('/')}>
              Voltar para a Página Inicial
            </button>
          </div>
        );
    }
  };

  return (
    <>
      {/* Bootstrap CSS */}
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" xintegrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossOrigin="anonymous" />
      {/* Bootstrap JS */}
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" xintegrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossOrigin="anonymous"></script>
      {/* Font Inter */}
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {renderPage()}
    </>
  );
};

export default App;
