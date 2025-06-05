import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState, AppDispatch } from '../store';
import { setCurrentUser } from '../store/slice/UserSlice';
import { setUserPokedex } from '../store/slice/PokedexSlice';
import { PokedexEntry } from '../types/Pokedex';
import '../styles/Dashboard.css';

const Dashboard: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();
    const currentUser = useSelector((state: RootState) => state.user.currentUser);
    const entries = useSelector((state: RootState) => state.pokedex.pokemonList);
    const loading = useSelector((state: RootState) => state.pokedex.loading);

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (!userStr) {
            navigate('/');
            return;
        }
        const user = JSON.parse(userStr);
        if (!currentUser || currentUser.id !== user.id) {
            dispatch(setCurrentUser(user));
        }
        const pokedexStr = localStorage.getItem(`pokedex_${user.id}`);
        const pokedex: PokedexEntry[] = pokedexStr ? JSON.parse(pokedexStr) : [];
        dispatch(setUserPokedex(pokedex));
    }, [dispatch, navigate]);

    const handleLogout = () => {
        dispatch(setCurrentUser(null));
        localStorage.removeItem('user');
        navigate('/');
    };

    if (!currentUser) return null;

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h2>Dashboard</h2>
                <button className="logout-btn" onClick={handleLogout}>Déconnexion</button>
            </div>
            <p>Bienvenue, {currentUser.username} !</p>

            <h3>Mon Pokédex</h3>
            {loading ? (
                <p>Chargement...</p>
            ) : entries.length > 0 ? (
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
                                width={96}
                                height={96}
                            />

                            <div className="pokemon-name">
                                {entry.name}
                            </div>
                            <div className="pokemon-type">
                                {entry.types.map((t) => (
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
