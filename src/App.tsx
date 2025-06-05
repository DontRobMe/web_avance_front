import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import SignupForm from "./components/SignupForm.tsx";
import Accueil from "./components/Accueil.tsx";
import Gacha from "./components/Gacha.tsx";
import Search from "./components/Search.tsx";
import Header from "./components/Header.tsx";
import PokemonDetail from "./components/PokemonDetail.tsx";
import Exchange from "./components/Exchange.tsx";
import {Provider} from "react-redux";
import {store} from "./store";

const App: React.FC = () => {
    return (
        <Router>
            <Provider store={store}>
                <Header/>
                <div>
                    <Routes>
                        <Route path="/" element={<Accueil/>}/>
                        <Route path="/login" element={<LoginForm/>}/>
                        <Route path="/signup" element={<SignupForm/>}/>
                        <Route path="/dashboard" element={<Dashboard/>}/>
                        <Route path="/gacha" element={<Gacha/>}/>
                        <Route path="/search" element={<Search/>}/>
                        <Route path="/pokemon/:name" element={<PokemonDetail/>}/>
                        <Route path="/exchange" element={<Exchange/>}/>
                    </Routes>
                </div>
            </Provider>
        </Router>

    );
};

export default App;
