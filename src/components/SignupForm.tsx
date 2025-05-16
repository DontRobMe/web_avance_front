import React, {useState, useContext} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {UserContext} from '../context/UserContext';
import '../styles/SignupForm.css';


const SignupForm: React.FC = () => {
    const {signup} = useContext(UserContext);
    const navigate = useNavigate();

    const [form, setForm] = useState({
        username: '',
        email: '',
        password: '',
    });

    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({...form, [e.target.name]: e.target.value});
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const success = signup(form);

        if (success) {
            navigate('/dashboard');
        } else {
            setError('Nom d’utilisateur déjà utilisé.');
        }
    };

    return (
        <div className="signup-container">
            <h2>Créer un compte</h2>
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
                    <label htmlFor="username">Mail :</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                    <label htmlFor="username">Password :</label>
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
            {error && <p className="error-message">{error}</p>}

            <p>
                Vous avez déjà un compte ? <Link to="/login">Se connecter</Link>
            </p>
        </div>
    );
};

export default SignupForm;
