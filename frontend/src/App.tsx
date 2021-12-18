import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

import Login from "pages/Login";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
