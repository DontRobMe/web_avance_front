import React, { useState, useContext } from 'react';
import {Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import '../styles/LoginForm.css';


const LoginForm: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const { login } = useContext(UserContext);
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const isLoggedIn = login(username, password);

        if (isLoggedIn) {
            navigate('/dashboard');
        } else {
            setError('Identifiants incorrects. Veuillez réessayer.');
        }
    };

    return (
        <div className="login-container">
            <h2 className="login-title">Connexion</h2>
            <form className="login-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Nom d’utilisateur :</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Mot de passe :</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="login-button">Se connecter</button>
            </form>
            {error && <p className="error-message">{error}</p>}

            <p>
                Pas encore de compte ? <Link to="/signup">S'inscrire</Link>
            </p>
        </div>
    );
};

export default LoginForm;
