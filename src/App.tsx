import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import SignupForm from "./components/SignupForm.tsx";
import Accueil from "./components/Accueil.tsx";
import Gacha from "./components/Gacha.tsx";
import {UserProvider} from "./context/UserContext.tsx";
import { PokedexProvider } from './context/PokedexContext.tsx';

const App: React.FC = () => {
    return (
        <Router>
            <UserProvider>
                <PokedexProvider>
                    <div>
                        <Routes>
                            <Route path="/" element={<Accueil/>}/>
                            <Route path="/login" element={<LoginForm/>}/>
                            <Route path="/signup" element={<SignupForm/>}/>
                            <Route path="/dashboard" element={<Dashboard/>}/>
                            <Route path="/gacha" element={<Gacha/>}/>
                            <Route path="/search" element={<Search/>}/>
                        </Routes>
                    </div>
                </PokedexProvider>
            </UserProvider>
        </Router>
    );
};

export default App;
