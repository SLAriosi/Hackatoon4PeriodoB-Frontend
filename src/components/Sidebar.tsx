import React, { useState } from 'react';
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

const Sidebar: React.FC = () => {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isAdmin = true; // Isso deve vir do contexto ou de uma verificação de autenticação real
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Nova Reserva', read: false },
    { id: 2, title: 'Novo Comentário', read: true },
    { id: 3, title: 'Alteração de Ambiente', read: false },
  ]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const unreadNotificationsCount = notifications.filter((notification) => !notification.read).length;

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
          <Link href="/agendamento" legacyBehavior>
            <a className={styles.link}>
              <FaHistory size={18} /> <span className={isCollapsed ? styles.hidden : ''}>Agendar Reserva</span>
            </a>
          </Link>
        </li>
        <li>
          <Link href="/Historico" legacyBehavior>
            <a className={styles.link}>
              <FaCog size={18} /> <span className={isCollapsed ? styles.hidden : ''}>Histórico</span>
            </a>
          </Link>
        </li>

        {isAdmin && (
          <>
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

        <li>
          <Link href="/perfil" legacyBehavior>
            <a className={styles.link}>
              <FaUser size={18} /> <span className={isCollapsed ? styles.hidden : ''}>Perfil</span>
            </a>
          </Link>
        </li>
        <li>
          <Link href="/notificacoes" legacyBehavior>
            <a className={styles.link}>
              <FaBell size={18} />
              <span className={styles.notificationText}>
                <span className={isCollapsed ? styles.hidden : ''}>Notificações</span>
              </span>
              {unreadNotificationsCount > 0 && (
                <span className={styles.notificationBadge}>
                  {unreadNotificationsCount}
                </span>
              )}
            </a>
          </Link>
        </li>
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
