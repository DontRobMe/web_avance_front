import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { PokedexContext } from '../context/PokedexContext';
import { PokedexEntry } from '../types/Pokedex';
import '../styles/Dashboard.css';

const Dashboard: React.FC = () => {
    const { currentUser, logout } = useContext(UserContext);
    const { entries } = useContext(PokedexContext);
    const navigate = useNavigate();

    if (!currentUser) {
        navigate('/');
        return null;
    }

    const handleLogout = () => {
        logout();
        localStorage.removeItem('currentUser');
        navigate('/');
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h2>Dashboard</h2>
                <button className="logout-btn" onClick={handleLogout}>Déconnexion</button>
            </div>
            <p>Bienvenue, {currentUser.username} !</p>

            <h3>Mon Pokédex</h3>
            {entries.length > 0 ? (
                <div className="pokedex-grid">
                    {entries.map((entry: PokedexEntry) => (
                        <div
                            key={entry.pokedex_id}
                            className="pokedex-card"
                            onClick={() => navigate(`/pokemon/${entry.name.toLowerCase()}`)}
                        >
                            <img
                                src={entry.isShiny ? entry.sprites.shiny : entry.sprites.regular}
                                alt={entry.name}
                                className="pokemon-image"
                            />
                            <div className="pokemon-name">
                                {entry.name}
                                {entry.isShiny && <span className="shiny-star">✨</span>}
                            </div>
                            <div className="pokemon-type">
                                {entry.types.map(t => (
                                    <img
                                        key={t.name}
                                        src={t.image}
                                        alt={t.name}
                                        className="type-icon"
                                    />
                                ))}
                            </div>
                            <div style={{ fontSize: "0.8rem", color: "#666" }}>
                                Niveau: {entry.level}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>Tu n'as pas encore capturé de Pokémon.</p>
            )}
        </div>
    );
};

export default Dashboard;
