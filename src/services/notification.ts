// services/notification.ts
export const getNotifications = async () => {
    // Simula notificações de exemplo
    return [
      { id: 1, title: 'Nova Reserva', message: 'Você tem uma nova reserva.', date: new Date() },
      { id: 2, title: 'Novo Comentário', message: 'Alguém comentou na sua reserva.', date: new Date() },
      { id: 3, title: 'Alteração de Ambiente', message: 'O ambiente foi alterado.', date: new Date() },
    ];
  };
  