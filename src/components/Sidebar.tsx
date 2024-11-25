'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from './Sidebar.module.css';
import {
  FaBars,
  FaHome,
  FaClipboardList,
  FaHistory,
  FaCog,
  FaMoon,
  FaSun,
  FaUser,
  FaSignOutAlt,
  FaBell,
  FaUsers,
  FaBuilding,  // Adicionado para o ícone de gerenciamento de ambientes
} from 'react-icons/fa';
import axios from 'axios';

const Sidebar: React.FC = () => {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isProfessor, setIsProfessor] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const URL_API = process.env.NEXT_PUBLIC_API_URL;



  useEffect(() => {
    const userRole = localStorage.getItem('role');
    if (userRole === 'ADMINISTRADOR') {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }

    if (userRole === 'PROFESSOR') {
      setIsProfessor(true);
    } else {
      setIsProfessor(false);
    }

    const fetchNotifications = async () => {
      const response = await axios.get(`${URL_API}/notificacoes/usuario/${localStorage.getItem('userId')}/nao-lidas`)
      setNotifications(response.data);
    }
    fetchNotifications();
  }, []);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };


  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };
  return (
    <div className={`${styles.sidebar} ${darkMode ? styles.dark : styles.light}`}>
      <div className={styles.logo} onClick={toggleCollapse}>
        <FaBars size={20} />
        <span className={isCollapsed ? styles.hidden : ''}>Reservas</span>
      </div>
      <ul className={styles.menu}>
        <li>
          <Link href="/dashboard" legacyBehavior>
            <a className={styles.link}>
              <FaHome size={18} /> <span className={isCollapsed ? styles.hidden : ''}>Dashboard</span>
            </a>
          </Link>
        </li>
        <li>
          <Link href="/ambientes" legacyBehavior>
            <a className={styles.link}>
              <FaClipboardList size={18} /> <span className={isCollapsed ? styles.hidden : ''}>Ambientes</span>
            </a>
          </Link>
        </li>
        <li>
          <Link href="/perfil" legacyBehavior>
            <a className={styles.link}>
              <FaUser size={18} /> <span className={isCollapsed ? styles.hidden : ''}>Perfil</span>
            </a>
          </Link>
        </li>
        {(isAdmin || isProfessor) && (
          <>
            <li>
              <Link href="/notificacoes" legacyBehavior>
                <a className={styles.link}>
                  <FaBell size={18} />
                  <span className={styles.notificationText}>
                    <span className={isCollapsed ? styles.hidden : ''}>Notificações</span>
                  </span>
                  {notifications?.length > 0 && (
                    <span className={styles.notificationBadge}>
                      {notifications?.length}
                    </span>
                  )}
                </a>
              </Link>
            </li>
            <li>
              <Link href="/agendamento" legacyBehavior>
                <a className={styles.link}>
                  <FaHistory size={18} /> <span className={isCollapsed ? styles.hidden : ''}>Agendar Reserva</span>
                </a>
              </Link>
            </li>
          </>
        )}
        {isAdmin && (
          <>
            <li>
              <Link href="/Historico" legacyBehavior>
                <a className={styles.link}>
                  <FaCog size={18} /> <span className={isCollapsed ? styles.hidden : ''}>Histórico</span>
                </a>
              </Link>
            </li>
            <li>
              <Link href="/GerenciarUsuarios" legacyBehavior>
                <a className={styles.link}>
                  <FaUsers size={18} /> <span className={isCollapsed ? styles.hidden : ''}>Gerenciar Usuários</span>
                </a>
              </Link>
            </li>
            <li>
              <Link href="/GerenciarAmbientes" legacyBehavior>
                <a className={styles.link}>
                  <FaBuilding size={18} /> <span className={isCollapsed ? styles.hidden : ''}>Gerenciamento de Ambientes</span>
                </a>
              </Link>
            </li>
          </>
        )}
      </ul>
      <div className={styles.footer}>
        <button onClick={toggleTheme} className={styles.themeButton}>
          {darkMode ? <FaMoon size={18} /> : <FaSun size={18} />}
          <span className={isCollapsed ? styles.hidden : ''}>{darkMode ? 'Modo Escuro' : 'Modo Claro'}</span>
        </button>
        <button onClick={handleLogout} className={styles.logoutButton}>
          <FaSignOutAlt size={18} />
          <span className={isCollapsed ? styles.hidden : ''}>Sair</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
