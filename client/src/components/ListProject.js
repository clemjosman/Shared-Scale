import React, { useState, useEffect } from "react";
import "./ListProject.css";
import { useNavigate } from "react-router-dom";

const Projets = () => {
  const [projets, setProjets] = useState([]);
  useEffect(() => {
    fetch("/projets")
      .then((response) => response.json())
      .then((data) => setProjets(data));
  }, []);
  const navigate = useNavigate();
  const handleBoxClick = (projet) => {
    console.log(`La boîte ${projet} a été cliquée.`);
    navigate(`/projets/${projet}`);
  };

  return (
    <div className="projets-container">
      <h1 className="projets-title">Liste des projets</h1>
      <div className="projets-list">
        {projets.map((projet, index) => (
          <div
            key={index}
            className="projet-box"
            onClick={() => handleBoxClick(projet)}
          >
            {projet}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projets;
