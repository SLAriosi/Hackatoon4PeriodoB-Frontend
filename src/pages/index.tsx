import React from 'react';
import Link from 'next/link';
import styles from '../styles/Home.module.css'; // Importando o CSS da Home

const Home: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Bem-vindo ao Sistema de Reservas</h1>
        <p className={styles.description}>Faça login ou registre-se para começar.</p>
        <div className={styles.links}>
          <Link href="/login" className={styles.link}>
            Login
          </Link>
          <Link href="/register" className={styles.link}>
            Registrar
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
