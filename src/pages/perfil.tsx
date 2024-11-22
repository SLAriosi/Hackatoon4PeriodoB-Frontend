import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import '../styles/Perfil.css';

const Perfil: React.FC = () => {
  const [email, setEmail] = useState('usuario@exemplo.com'); // Email atual
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSenhaAtualChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSenhaAtual(e.target.value);
  };

  const handleNovaSenhaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNovaSenha(e.target.value);
  };

  const handleConfirmarSenhaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmarSenha(e.target.value);
  };

  const handleSubmit = () => {
    if (!senhaAtual || !novaSenha || !confirmarSenha) {
      alert('Por favor, preencha todos os campos de senha.');
      return;
    }

    if (novaSenha !== confirmarSenha) {
      alert('A nova senha e a confirmação não coincidem.');
      return;
    }

    // Aqui você pode adicionar a lógica de atualização no backend
    alert('Dados atualizados com sucesso!');
    setSenhaAtual('');
    setNovaSenha('');
    setConfirmarSenha('');
  };

  return (
    <div className="perfil-page">
      <Sidebar />
      <div className="perfil-content">
        <h1>Meu Perfil</h1>
        <div className="perfil-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="senhaAtual">Senha Atual</label>
            <input
              type="password"
              id="senhaAtual"
              value={senhaAtual}
              onChange={handleSenhaAtualChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="novaSenha">Nova Senha</label>
            <input
              type="password"
              id="novaSenha"
              value={novaSenha}
              onChange={handleNovaSenhaChange}
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
    </div>
  );
};

export default Perfil;
