// src/App.tsx

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import './styles/Header.css';

import Home from './pages/Home';
import Login from './pages/Login';
import Questionario from './pages/Questionario';
import PlanoDeAcao from './pages/PlanoDeAcao'; 
import RegistroAtividade from './pages/RegistroAtividade' ; 

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/questionario" element={<Questionario />} />
            <Route path="/plano-de-acao" element={<PlanoDeAcao />} /> 
            <Route path="/registro-de-atividades" element={<RegistroAtividade />} />

          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
