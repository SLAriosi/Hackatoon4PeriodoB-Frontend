// Mock de reservas ativas
export const getReservations = () => {
    return [
      { id: 1, date: '2024-11-19', time: '10:00', environment: 'Ambiente 1', status: 'Confirmada' },
      { id: 2, date: '2024-11-19', time: '11:00', environment: 'Ambiente 2', status: 'Cancelada' },
      { id: 3, date: '2024-11-19', time: '12:00', environment: 'Ambiente 3', status: 'Confirmada' },
    ];
  };
  
  // Mock do histórico de reservas
  export const getReservationHistory = async () => {
    // Simulando uma API com Promise
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 1,
            environment: 'Sala de Reuniões',
            date: '2024-11-18T10:00:00',
            status: 'Concluído',
            user: 'João Silva',
          },
          {
            id: 2,
            environment: 'Auditório',
            date: '2024-11-19T14:00:00',
            status: 'Concluído',
            user: 'Maria Oliveira',
          },
          {
            id: 3,
            environment: 'Ambiente 3',
            date: '2024-11-15T16:00:00',
            status: 'Cancelada',
            user: 'Carlos Souza',
          },
        ]);
      }, 500); // Simula um atraso
    });
  };
  
  // Mock de horários disponíveis
  export const getAvailableTimes = (environmentId: number) => {
    return [
      { id: 1, time: '10:00', available: true },
      { id: 2, time: '11:00', available: true },
      { id: 3, time: '12:00', available: false },
      { id: 4, time: '14:00', available: true },
    ];
  };
  
  // Mock de criação de reserva
  export const makeReservation = async (data: { date: string; time: string }) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ status: 'success', message: 'Reserva realizada com sucesso' });
      }, 1000); // Simula um atraso de 1 segundo
    });
  };
  