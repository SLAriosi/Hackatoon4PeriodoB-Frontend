"use client";
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import '../styles/Perfil.css';
import axios from 'axios';
import { useRouter } from 'next/router';
import { FaSpinner } from 'react-icons/fa';

const URL_API = process.env.NEXT_PUBLIC_API_URL;

interface Usuario {
  name: string;
  email: string;
  senha: string;
}

const Perfil: React.FC = () => {
  const [usuario, setUsuario] = useState<Usuario>({ name: '', email: '', senha: '' });
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const userId = localStorage.getItem('userId');
      const response = await axios.get(`${URL_API}/users/${userId}`);

      setUsuario({
        name: response.data.name,
        email: response.data.email,
        senha: ''
      });

      setIsLoading(false);
    };

    fetchData();
  }, []);

  const handleConfirmarSenhaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmarSenha(e.target.value);
  };

  const handleSenhaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNovaSenha(e.target.value);
  };

  const handleSubmit = async () => {
    if (!novaSenha || !confirmarSenha) {
      alert('Por favor, preencha todos os campos de senha.');
      return;
    }

    if (novaSenha !== confirmarSenha) {
      alert('A nova senha e a confirmação não coincidem.');
      return;
    }

    if (novaSenha.length < 8) {
      alert('A nova senha deve ter no mínimo 8 caracteres.');
      return;
    }

    try {
      setIsLoading(true);
      await axios.put(`${URL_API}/users/${localStorage.getItem('userId')}`, {
        name: usuario.name,
        email: usuario.email,
        password: novaSenha,
        password_confirmation: confirmarSenha
      });
    } catch (error) {
      console.warn(error);
    }
    alert('Dados atualizados com sucesso!');
    router.push('/dashboard');
    setIsLoading(false);
  };

  return (
    <div className="perfil-page">
      {isLoading && (
        <div className="loading-modal">
          <div className="loading-spinner">
            <FaSpinner className="spinner-icon" />
          </div>
        </div>
      )}
      {!isLoading && (
        <>
          <Sidebar />
          <div className="perfil-content">
            <h1>Meu Perfil</h1>
            <div className="perfil-form">
              <div className="form-group">
                <label htmlFor="name">Nome</label>
                <input
                  type="text"
                  id="name"
                  value={usuario.name}
                  onChange={(e) => setUsuario({ ...usuario, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={usuario.email}
                  onChange={(e) => setUsuario({ ...usuario, email: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label htmlFor="novaSenha">Nova Senha</label>
                <input
                  type="password"
                  id="novaSenha"
                  value={novaSenha}
                  onChange={handleSenhaChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmarSenha">Confirmar Nova Senha</label>
                <input
                  type="password"
                  id="confirmarSenha"
                  value={confirmarSenha}
                  onChange={handleConfirmarSenhaChange}
                />
              </div>

              <button className="btn-atualizar" onClick={handleSubmit}>
                Atualizar Dados
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Perfil;
