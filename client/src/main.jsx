import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";


createRoot(document.getElementById('root')).render(
  <StrictMode>
    
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>

  </StrictMode>,
  
)
reportWebVitals();


