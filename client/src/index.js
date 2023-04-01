import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Projets from "./components/ListProject";
import Projet from "./components/Project";
import { BrowserRouter,Route, Routes } from "react-router-dom";
import { Provider } from 'react-redux';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<App/>} />
          <Route path="/projets" element={<Projets/>} />
          <Route path="/projets/:projet" element={<Projet />} />
        </Routes>
      </BrowserRouter>
);
