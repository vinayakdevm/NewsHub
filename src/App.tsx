import { useState, useEffect } from 'react';
import Welcome from './components/Welcome';
import NewsHub from './components/NewsHub';

function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  if (showWelcome) {
    return <Welcome onEnter={() => setShowWelcome(false)} />;
  }

  return <NewsHub darkMode={darkMode} setDarkMode={setDarkMode} />;
}

export default App;
