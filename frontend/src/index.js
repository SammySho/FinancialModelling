import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const NavBar = () => {
  return (
    <nav style={{ padding: "1rem", background: "#f7f7f7" }}>
      <a href="https://sammyshorthouse.com" style={{ marginRight: "1rem" }}>
        Main Portfolio
      </a>
      <a href="https://trading.sammyshorthouse.com">
        Trading Demo
      </a>
    </nav>
  );
};

export default NavBar;

// Create root and render
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);