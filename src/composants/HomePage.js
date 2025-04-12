// HomePage.js

import React from 'react';
import '../styles/HomePage.css';
import etabista from '../assets/images/etabista.png';
import etab2ista from '../assets/images/etab2ista.png';
import etab3ista from '../assets/images/etab3ista.png';
import etab4ista from '../assets/images/etab4ista.png';
import ofppt from '../assets/images/ofppt.png';


const HomePage = () => {
  return (
    <div className="page-container">
      <div className="homepage-container">
        <div className="homepage-header">
        <img src={ofppt} alt="OCP Logo" className="logo" /> {/* Ajoutez le logo */}
          <h1>OFPPT : Une Formation pour Tous</h1>
          <p>L’OFPPT (Office de la Formation Professionnelle et de la Promotion du Travail) est un acteur clé dans le domaine de la formation professionnelle au Maroc. Il offre des formations diversifiées pour répondre aux besoins du marché du travail et préparer les jeunes à des carrières enrichissantes. Voici un aperçu des filières et des avantages offerts par l’OFPPT.</p>
        </div>
        <div className="sautage-section">
          <h2 style={{ color: "#094e85" }}>Filières Disponibles :</h2>
          <div className="sautage-content">
            <ol>
              <li>Informatique et Développement : Programmation, réseaux, et maintenance.</li>
              <li>Gestion et Commerce : Comptabilité, gestion d’entreprise, et techniques commerciales.</li>
              <li>Industrie : Électromécanique, fabrication mécanique, et maintenance industrielle.</li>
              <li>Bâtiment et Travaux Publics : Dessin de bâtiment, topographie, et génie civil.</li>
              <li>Tourisme et Hôtellerie : Restauration, gestion d’hôtels, et animation touristique.</li>
            </ol>
            <div className="image-container">
              <img src={etabista} alt="Sautage" className="sautage-image" />
              <img src={etab2ista} alt="Sautage 2" className="sautage-image" />
            </div>
          </div>
        </div>
        <div className="tir-section">
          <h2>Avantages :</h2>
          <div className="tir-content">
            <p>
                L’OFPPT est donc une excellente opportunité pour développer des compétences professionnelles et intégrer le marché du travail.
            </p>
            <ol>
              <li>Diplômes Reconnaissables : Formation diplômante avec des certifications reconnues par les entreprises.</li>
              <li>Stages Pratiques : Intégration dans des stages pour acquérir de l’expérience sur le terrain.</li>
              <li>Coût Accessible : Formation à des tarifs abordables, voire gratuite pour certains programmes.</li>
              <li>Accompagnement Professionnel : Aide à l’insertion professionnelle grâce à des partenariats avec les entreprises.</li>
              <li>Infrastructure Moderne : Ateliers bien équipés pour la pratique.</li>
            </ol>
            <div className="image-container">
              <img src={etab3ista} alt="Tir" className="tir-image" />
              <img src={etab4ista} alt="Tir 2" className="tir-image" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
