import logo from "./logo.svg";
import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";


const App = () => {
  const [msg, setMsg] = useState("");

  const handleClick = async () => {
    const data = await window.fetch("/api/data");
    const json = await data.json();
    const msg = json.msg;
    console.log(json);
    setMsg(msg);
  };


  return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload{" "}
          </p>
          <Link to="/projets"><button>Voir les projets</button></Link>
          <p>{msg}</p>
        </header>
      </div>
  );
};

export default App;