import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import '../styles/Agendamento.css';

const Agendamento: React.FC = () => {
  const environments = [
    { id: 1, name: 'Biblioteca', description: 'Ambiente silencioso para leitura', icon: '📚', capacity: '50 pessoas', equipment: 'Wi-Fi, mesas de estudo' },
    { id: 2, name: 'Salas de Aula', description: 'Salas para aulas e reuniões acadêmicas', icon: '🖊️', capacity: '30 pessoas', equipment: 'Projetor, quadro branco' },
    { id: 3, name: 'AlphaLAB', description: 'Espaço para inovação e prototipagem', icon: '💡', capacity: '15 pessoas', equipment: 'Computadores, impressora 3D' },
    { id: 4, name: 'Auditório', description: 'Espaço para palestras e eventos', icon: '🎤', capacity: '200 pessoas', equipment: 'Microfone, som, telão' },
  ];

  const [selectedEnvironment, setSelectedEnvironment] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [reservations, setReservations] = useState<any[]>([]);
  const [isReserving, setIsReserving] = useState(false);
  const [error, setError] = useState('');
  const [userName, setUserName] = useState('Diego Macedo');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [actionType, setActionType] = useState<'reserve' | 'cancel' | 'edit'>('reserve');
  const [reservationToEdit, setReservationToEdit] = useState<any | null>(null);
  const [editedReservation, setEditedReservation] = useState<any | null>(null);

  const availableTimes = [
    { id: 1, time: '10:00' },
    { id: 2, time: '11:00' },
    { id: 3, time: '12:00' },
    { id: 4, time: '14:00' },
  ];

  const handleReserve = () => {
    if (!selectedEnvironment || !selectedTime || !selectedDate) {
      setError('Selecione um ambiente, horário e data válidos.');
      return;
    }

    setIsReserving(true);
    setTimeout(() => {
      const newReservation = {
        date: selectedDate,
        time: selectedTime,
        user: userName,
        environment: selectedEnvironment,
      };
      setReservations([...reservations, newReservation]);
      setIsReserving(false);
      setSelectedTime(null);
      setSelectedEnvironment(null);
      setSelectedDate(null);
      setShowConfirmation(false);
      alert('Reserva realizada com sucesso!');
    }, 1000); // Simulando delay de reserva
  };

  const handleCancelReservation = () => {
    if (reservationToCancel) {
      setReservations(reservations.filter((res) => res !== reservationToCancel));
      setReservationToCancel(null);
      alert('Reserva cancelada com sucesso!');
    }
  };

  const handleEditReservation = () => {
    if (!editedReservation) {
      setError('Por favor, edite todos os campos antes de salvar.');
      return;
    }

    setReservations(
      reservations.map((res) =>
        res === reservationToEdit ? { ...res, ...editedReservation } : res
      )
    );
    setReservationToEdit(null);
    setEditedReservation(null);
    setShowConfirmation(false);
    alert('Reserva editada com sucesso!');
  };

  const openConfirmationModal = (action: 'reserve' | 'cancel' | 'edit', reservation?: any) => {
    setActionType(action);
    if (action === 'cancel' && reservation) {
      setReservationToCancel(reservation);
    } else if (action === 'edit' && reservation) {
      setReservationToEdit(reservation);
      setEditedReservation(reservation);
    }
    setShowConfirmation(true);
  };

  const closeConfirmationModal = () => {
    setShowConfirmation(false);
    setReservationToCancel(null);
    setReservationToEdit(null);
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);
  };

  const handleEditedDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedReservation((prev) => ({ ...prev, date: event.target.value }));
  };

  const handleEditedTimeChange = (time: string) => {
    setEditedReservation((prev) => ({ ...prev, time }));
  };

  const handleEditedEnvironmentChange = (envId: number) => {
    setEditedReservation((prev) => ({ ...prev, environment: envId }));
  };

  const isTimeAvailable = (time: string) => {
    return !reservations.some(
      (res) => res.environment === selectedEnvironment && res.date === selectedDate && res.time === time
    );
  };

  return (
    <div className="agendamento-container">
      <Sidebar />
      <div className="content">
        <h1>Agendar Reserva</h1>

        {/* Seleção de Ambiente */}
        <div className="environments-container">
          {environments.map((env) => (
            <div
              key={env.id}
              onClick={() => setSelectedEnvironment(env.id)}
              className={`environment-card ${selectedEnvironment === env.id ? 'selected' : ''}`}
              title={env.description}
            >
              <div className="environment-icon">{env.icon}</div>
              <h3>{env.name}</h3>
              <p>{env.description}</p>
              <p><strong>Capacidade:</strong> {env.capacity}</p>
              <p><strong>Equipamento:</strong> {env.equipment}</p>
            </div>
          ))}
        </div>

        {/* Seleção de Data */}
        <div className="date-container">
          <input
            type="date"
            onChange={handleDateChange}
            value={selectedDate || ''}
            className="date-input"
            min={new Date().toISOString().split('T')[0]} // Impede datas no passado
          />
        </div>

        {/* Seleção de Horário */}
        {selectedEnvironment && selectedDate && (
          <div className="times-section">
            <h3>Horários Disponíveis</h3>
            {availableTimes.map((time) => (
              <button
                key={time.id}
                disabled={!isTimeAvailable(time.time)}
                onClick={() => setSelectedTime(time.time)}
                className={`time-slot ${selectedTime === time.time ? 'selected' : ''} ${!isTimeAvailable(time.time) ? 'disabled' : ''}`}
              >
                {time.time}
              </button>
            ))}
          </div>
        )}

        {/* Mensagem de erro ou sucesso */}
        {error && <div className="error-message">{error}</div>}

        {/* Botão para confirmar a reserva */}
        <button
          onClick={() => openConfirmationModal('reserve')}
          disabled={!selectedTime || !selectedEnvironment || !selectedDate || isReserving}
          className="open-modal-btn"
        >
          {isReserving ? 'Carregando...' : 'Confirmar Reserva'}
        </button>

        {/* Exibindo as reservas realizadas */}
        <div className="reservations-container">
          <h3>Reservas Realizadas</h3>
          {reservations.length === 0 ? (
            <p>Nenhuma reserva realizada ainda.</p>
          ) : (
            <ul>
              {reservations.map((res, index) => {
                const environmentName = environments.find((env) => env.id === res.environment)?.name || 'Ambiente desconhecido';
                return (
                  <li key={index} className="reservation-item">
                    <div>
                      <strong>Data:</strong> {res.date} <strong>Horário:</strong> {res.time}{' '}
                      <strong>Ambiente:</strong> {environmentName} <strong>Feito por:</strong> {res.user}
                    </div>
                    <button onClick={() => openConfirmationModal('cancel', res)}>Cancelar</button>
                    <button
                      onClick={() => openConfirmationModal('edit', res)}
                      className="edit-btn"
                    >
                      Editar
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Modal de Confirmação */}
        {showConfirmation && (
          <div className="confirmation-modal">
            <div className="modal-content">
              {actionType === 'reserve' && (
                <>
                  <h2>Confirmar Reserva</h2>
                  <p>Você deseja confirmar a reserva?</p>
                  <div className="modal-buttons">
                    <button onClick={handleReserve} className="confirm-btn">Confirmar</button>
                    <button onClick={closeConfirmationModal} className="cancel-btn">Cancelar</button>
                  </div>
                </>
              )}
              {actionType === 'cancel' && (
                <>
                  <h2>Cancelar Reserva</h2>
                  <p>Tem certeza que deseja cancelar esta reserva?</p>
                  <div className="modal-buttons">
                    <button onClick={handleCancelReservation} className="confirm-btn">Confirmar</button>
                    <button onClick={closeConfirmationModal} className="cancel-btn">Cancelar</button>
                  </div>
                </>
              )}
              {actionType === 'edit' && reservationToEdit && (
                <>
                  <h2>Editar Reserva</h2>
                  <div className="edit-fields">
                    <label>Data:</label>
                    <input
                      type="date"
                      value={editedReservation?.date || ''}
                      onChange={handleEditedDateChange}
                    />
                    <label>Hora:</label>
                    <select
                      value={editedReservation?.time || ''}
                      onChange={(e) => handleEditedTimeChange(e.target.value)}
                    >
                      {availableTimes.map((time) => (
                        <option key={time.id} value={time.time}>
                          {time.time}
                        </option>
                      ))}
                    </select>
                    <label>Ambiente:</label>
                    <select
                      value={editedReservation?.environment || ''}
                      onChange={(e) => handleEditedEnvironmentChange(parseInt(e.target.value))}
                    >
                      {environments.map((env) => (
                        <option key={env.id} value={env.id}>
                          {env.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="modal-buttons">
                    <button onClick={handleEditReservation} className="confirm-btn">Salvar Alterações</button>
                    <button onClick={closeConfirmationModal} className="cancel-btn">Cancelar</button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Agendamento;
