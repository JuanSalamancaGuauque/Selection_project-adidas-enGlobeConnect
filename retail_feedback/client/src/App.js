import React, { useState, useEffect } from 'react';
import Form from './components/Form';
import Dashboard from './components/Dashboard';
import DashClient from './components/DashClient';
import './App.css';
import { BrowserRouter } from 'react-router';
const routes = {
  '/form': <Form />,
  '/dashboard': <Dashboard />,
  '/dashclient': <DashClient />,
  '/': <Form />
};

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const onPopState = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  return (
    <BrowserRouter>
      <div>
        <nav className="nav-buttons">
          <button onClick={() => navigate('/form')}>Formulario</button>
          <button onClick={() => navigate('/dashboard')}>Dashboard</button>
          <button onClick={() => navigate('/dashclient')}>Public Dashboard</button>
        </nav>
        <main>
          {routes[currentPath] || <h1>404 - Página no encontrada</h1>}
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
