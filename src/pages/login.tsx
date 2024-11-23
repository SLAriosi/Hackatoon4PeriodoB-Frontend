import React, { useState } from 'react';
import axios from 'axios'; // Importando axios
import { useRouter } from 'next/router';
import { FaEnvelope, FaLock } from 'react-icons/fa'; // Importando os ícones de email e senha
import styles from '../styles/Login.module.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const URL_API = process.env.NEXT_PUBLIC_API_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${URL_API}/login`, { email, password });

      console.log("response.data");
      console.log(response.data);
      console.log('response.data');

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userId', response.data.user_id);
        router.push('/dashboard');
      }
    } catch (err) {
      setError('Credenciais inválidas');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.logoContainer}>
          <img src="/images/LogoUnialfa.png" alt="Logo" className={styles.logo} />
        </div>
        <h2 className={styles.title}>Login</h2>
        {error && <p className={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className={styles.inputContainer}>
            <FaEnvelope className={styles.icon} />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              required
            />
          </div>
          <div className={styles.inputContainer}>
            <FaLock className={styles.icon} />
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              required
            />
          </div>
          <button type="submit" className={styles.button} onClick={handleSubmit}>Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
