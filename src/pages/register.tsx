import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa'; // Ícones
import { register } from '../services/api'; // Função para registro
import styles from '../styles/Register.module.css'; // Importando o CSS



const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await register(name, email, password);  // Função de registro no servidor
      setError('');
      router.push('/login');  // Redireciona para login após sucesso
    } catch (err) {
      setError('Erro ao criar conta');
    }
  };

  return (
    <div className={styles.registerContainer}>
      <form onSubmit={handleRegister} className={styles.registerForm}>
        <h1 className={styles.registerTitle}>Registrar</h1>
        
        <div className={styles.inputFieldWrapper}>
          <FaUser className={styles.inputIcon} />
          <input
            type="text"
            placeholder="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className={styles.inputField}
          />
        </div>
        
        <div className={styles.inputFieldWrapper}>
          <FaEnvelope className={styles.inputIcon} />
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.inputField}
          />
        </div>

        <div className={styles.inputFieldWrapper}>
          <FaLock className={styles.inputIcon} />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles.inputField}
          />
        </div>

        <button type="submit" className={styles.submitButton}>Cadastrar</button>

        {error && <p className={styles.errorMessage}>{error}</p>}
      </form>
    </div>
  );
};

export default Register;
