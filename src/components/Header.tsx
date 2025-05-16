import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import '../styles/Header.css';
import { FaSignOutAlt, FaUserCircle } from 'react-icons/fa';

const Header: React.FC = () => {
    const { currentUser, logout } = useContext(UserContext);

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
                        <button className="logout-button" onClick={logout}>
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
