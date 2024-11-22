import React, { useEffect, useState } from 'react';
import { getNotifications } from '../services/notification'; // Função para buscar notificações
import styles from '../styles/PopupNotification.module.css'; // Estilos do popup

const PopupNotification: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]); // Estado para as notificações
  const [isVisible, setIsVisible] = useState(true); // Estado para controlar a visibilidade do popup

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // Simulando a função que busca as notificações
        const data = await getNotifications();
        setNotifications(data.slice(0, 3)); // Exibe as 3 notificações mais recentes
      } catch (error) {
        console.error('Erro ao carregar notificações:', error);
      }
    };

    fetchNotifications();
  }, []); // Chama o efeito apenas uma vez, na montagem do componente

  const handleClose = () => {
    setIsVisible(false); // Fecha o popup
  };

  return (
    isVisible && (
      <div className={styles.popupContainer}>
        <div className={styles.popupContent}>
          <h3>Notificações Recentes</h3>
          <ul>
            {notifications.length === 0 ? (
              <li>Não há notificações para exibir.</li> // Caso não haja notificações
            ) : (
              notifications.map((notification) => (
                <li key={notification.id} className={styles.popupItem}>
                  <strong>{notification.title}</strong>
                  <p>{notification.message}</p>
                  <small>{new Date(notification.date).toLocaleString()}</small>
                </li>
              ))
            )}
          </ul>
          <button onClick={handleClose} className={styles.closeButton}>
            Fechar
          </button>
        </div>
      </div>
    )
  );
};

export default PopupNotification;
