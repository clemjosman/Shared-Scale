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
    console.log(`Le projet ${projet.id} (${projet.nom}) a été cliqué.`);
    navigate(`/projets/${projet.nom}`);
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
            <div>{projet.nom}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projets;
