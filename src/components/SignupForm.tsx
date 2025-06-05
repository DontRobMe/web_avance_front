import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signupUser, selectSignupError } from '../store/slice/UserSlice';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/SignupForm.css';
import { AppDispatch } from '../store';

const SignupForm: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();

    const signupError = useSelector(selectSignupError);

    const [form, setForm] = useState({
        username: '',
        email: '',
        password: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(signupUser(form))
            .then((action: any) => {
                if (action.meta.requestStatus === 'fulfilled') {
                    if (action.payload) {
                        localStorage.setItem('user', JSON.stringify(action.payload));
                    }
                    navigate('/dashboard');
                }
            });
    };

    return (
        <div className="signup-container">
            <h2>Créer un compte</h2>
            {signupError && <p className="error-message">{signupError}</p>}
            <form className="signup-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Nom d’utilisateur :</label>
                    <input
                        type="text"
                        name="username"
                        placeholder="Nom d’utilisateur"
                        value={form.username}
                        onChange={handleChange}
                        required
                    />
                    <label htmlFor="email">Mail :</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                    <label htmlFor="password">Password :</label>
                    <input
                        type="password"
                        name="password"
                        placeholder="Mot de passe"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">S’inscrire</button>
            </form>
            <p>
                Vous avez déjà un compte ? <Link to="/login">Se connecter</Link>
            </p>
        </div>
    );
};

export default SignupForm;

