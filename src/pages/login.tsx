import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa'; // Importing icons
import styles from '../styles/Login.module.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false); // State to control password visibility
  const [error, setError] = useState('');
  const router = useRouter();

  const URL_API = process.env.NEXT_PUBLIC_API_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setError('Por favor, insira um email válido.');
      return;
    }

    try {
      const response = await axios.post(`${URL_API}/login`, { email, password });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userId', response.data.user_id);
        localStorage.setItem('role', response.data.role);
        router.push('/dashboard');
      }
    } catch (err) {
      setError('Credenciais inválidas');
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className={styles.container} style={{ fontFamily: 'Poppins, sans-serif' }}>
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
              className={styles.input}
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={styles.inputContainer}>
            <FaLock className={styles.icon} />
            <input
              className={`${styles.input} ${styles.passwordInput}`}
              type={passwordVisible ? 'text' : 'password'}
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span onClick={togglePasswordVisibility} className={styles.eyeIcon}>
              {passwordVisible ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <button type="submit" className={styles.button}>Entrar</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
