import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { PokedexContext } from '../context/PokedexContext';
import { PokedexEntry } from '../types/Pokedex';

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
        //clear cache
        localStorage.removeItem('currentUser');
        navigate('/');
    };

    return (
        <div>
            <h2>Dashboard</h2>
            <p>Bienvenue, {currentUser.username} !</p>
            <button onClick={handleLogout}>Déconnexion</button>

            <h3>Mon Pokédex</h3>
            {entries.length > 0 ? (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {entries.map((entry: PokedexEntry, index: number) => (
                        <li key={index} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
                            <img src={entry.isShiny ? entry.sprites.shiny : entry.sprites.regular} alt={entry.name} width={96} height={96} />
                            <h4>{entry.name} {entry.isShiny && <span style={{ color: 'gold' }}>✨</span>}</h4>
                            <p>Type(s): {entry.types.map(t => (
                                <img key={t.name} src={t.image} alt={t.name} style={{ width: '24px', verticalAlign: 'middle', marginRight: '4px' }} />
                            ))}</p>
                            <p>Niveau: {entry.level}</p>
                            <p>Capturé le: {new Date(entry.caughtAt).toLocaleDateString()}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Tu n'as pas encore capturé de Pokémon.</p>
            )}
        </div>
    );
};

export default Dashboard;
