import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Header.css';
import { FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser, setCurrentUser } from '../store/slice/UserSlice';

const Header: React.FC = () => {
    const currentUser = useSelector(selectCurrentUser);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(setCurrentUser(null));
        localStorage.removeItem('user');
        navigate('/');
    };

    const logoTarget = currentUser ? '/dashboard' : '/';

    return (
        <header className="header">
            <div className="logo">
                <Link to={logoTarget}>Mon pokédex</Link>
            </div>
            <nav className="nav-links">
                {currentUser && <Link to="/gacha">Gacha</Link>}
                {currentUser && <Link to="/exchange">Échange</Link>}
                <Link to="/search">Recherche</Link>
            </nav>
            <div className="user-actions">
                {currentUser ? (
                    <>
                        <Link to="/dashboard">
                            <FaUserCircle className="profile-icon" />
                        </Link>
                        <button className="logout-button" onClick={handleLogout}>
                            <FaSignOutAlt className="logout-icon" />
                        </button>
                    </>
                ) : (
                    <Link to="/login" className="login-link">
                        <FaUserCircle className="profile-icon" />
                    </Link>
                )}
            </div>
        </header>
    );
};

export default Header;
