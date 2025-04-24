import React from 'react';
import { useNavigate } from 'react-router-dom';

const Accueil: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <h1>Bienvenue sur le Pokedex</h1>
            <p>Choisissez une action ci-dessous</p>
            <div style={{ marginTop: '1rem' }}>
                <button
                    onClick={() => navigate('/login')}
                    style={{ marginRight: '1rem', padding: '0.5rem 1rem', fontSize: '1rem' }}
                >
                    Login
                </button>
                <button
                    onClick={() => navigate('/signup')}
                    style={{ padding: '0.5rem 1rem', fontSize: '1rem' }}
                >
                    Sign Up
                </button>
            </div>
        </div>
    );
};

export default Accueil;
