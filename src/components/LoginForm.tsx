// LoginForm.tsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { setCurrentUser } from '../store/slice/UserSlice';
import '../styles/LoginForm.css';
import User from "../types/User.tsx";

const LoginForm: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const usersStr = localStorage.getItem('users');
        if (!usersStr) {
            setError('Aucun utilisateur enregistré.');
            return;
        }

        const users: User[] = JSON.parse(usersStr);
        const foundUser = users.find(
            (u: User) => u.username.toLowerCase() === username.toLowerCase() && u.password === password
        );


        if (foundUser) {
            localStorage.setItem('user', JSON.stringify(foundUser));
            dispatch(setCurrentUser(foundUser as User));
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
