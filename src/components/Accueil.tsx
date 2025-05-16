import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Acceuil.css';

const Accueil: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="accueil-container">
            <h1 className="accueil-title">Bienvenue sur le Pokedex</h1>
            <p className="accueil-description">Choisissez une action ci-dessous</p>
            <div className="button-container">
                <button
                    className="accueil-button"
                    onClick={() => navigate('/login')}
                >
                    Login
                </button>
                <button
                    className="accueil-button"
                    onClick={() => navigate('/signup')}
                >
                    Sign Up
                </button>
            </div>
        </div>
    );
};

export default Accueil;
