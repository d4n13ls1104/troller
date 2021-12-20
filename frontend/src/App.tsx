import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider, createClient } from 'urql';
import "./index.css";

import Login from "pages/Login";
import Register from 'pages/Register';

const client = createClient({ url: "http://localhost:4000/graphql" })

const App: React.FC = () => {
  return (
    <Provider value={client}>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
    </Provider>
  );
}

export default App;
