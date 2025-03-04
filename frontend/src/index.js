import React from 'react';
import ReactDOM from 'react-dom';
import App from 'App';  // Make sure this path is correct

// Render the App component into the element with the id 'root'
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
