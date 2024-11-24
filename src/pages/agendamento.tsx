'use client';
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import '../styles/Agendamento.css';
import { useRouter } from 'next/router';
import axios from 'axios';

const Agendamento: React.FC = () => {

  const URL_API = process.env.NEXT_PUBLIC_API_URL;

  const [selectedEnvironment, setSelectedEnvironment] = useState<number | null>(null);
  const [PeriodoSelecionado, setPeriodoSelecionado] = useState<string | null>(null);
  const [reservationToCancel, setReservationToCancel] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [reservas, setReservas] = useState<any[]>([]);
  const [availablePeriods, setAvailablePeriods] = useState<string[]>([]);
  const [isReserving, setIsReserving] = useState(false);
  const [error, setError] = useState('');
  const [dataLivreItem, setDataLivreItem] = useState<any[]>([]);
  const [userName, setUserName] = useState('Diego Macedo');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [actionType, setActionType] = useState<'reserve' | 'cancel' | 'edit'>('reserve');
  const [reservationToEdit, setReservationToEdit] = useState<any | null>(null);
  const [editedReservation, setEditedReservation] = useState<any | null>(null);
  const [ambientes, setAmbientes] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }

    const fetchReservas = async () => {
      const response = await axios.get(`${URL_API}/ambientes_reservas`);
      const data = await response.data;

      setReservas(data);
    }

    fetchReservas();

    const fetchAmbientes = async () => {
      const response = await axios.get(`${URL_API}/ambientes`);
      const data = await response.data;

      setAmbientes(data);
    };

    fetchAmbientes();

  }, []);

  useEffect(() => {
    try {

      const fetchPeriodosDisponiveis = async () => {

        const response = await axios.get(`${URL_API}/ambientes_reservas/${selectedEnvironment}/${selectedDate}`);
        const data = await response.data;
        setDataLivreItem(data);
      }
      if (selectedDate && selectedEnvironment) {
        fetchPeriodosDisponiveis();
      }
    } catch (error) {
      console.error(error);
    }
  }, [selectedDate, reservas])

  const avaiablePeriods = [
    { id: 1, periodo: 'MANHÃ' },
    { id: 2, periodo: 'TARDE' },
    { id: 3, periodo: 'NOITE' },
  ];

  const getAvailablePeriods = () => {
    const reservedPeriods = reservas
      .filter(reserva => reserva.data_reserva === selectedDate && reserva.ambiente_id === selectedEnvironment?.id)
      .map(reserva => reserva.periodo);

    if (!Array.isArray(periodo)) {
      console.error("Expected 'periodo' to be an array, but got:", typeof periodo);
      return [];
    }

    return periodo.filter(periodo => !reservedPeriods.includes(periodo));
  };

  const handleReserve = async () => {
    try {
      if (!selectedEnvironment || !PeriodoSelecionado || !selectedDate) {
        setError('Selecione um ambiente, horário e data válidos.');
        return;
      }

      await axios.post(`${URL_API}/ambientes_reservas`, {
        ambiente_id: selectedEnvironment,
        data_reserva: selectedDate,
        periodo: PeriodoSelecionado,
        user_id: localStorage.getItem('userId'),
      });
      router.reload();

    } catch (error) {
      alert(error.response.data.error);
      setShowConfirmation(false);
      router.reload();
    }
  };

  const handleCancelReservation = async () => {
    try {
      if (reservationToCancel) {
        await axios.delete(`${URL_API}/ambientes_reservas/${reservationToCancel.id}`);
        alert('Reserva cancelada com sucesso!');
        router.reload();
      }
    } catch (error) {
      alert(error.response.data.error);
      router.reload();
    }
  };

  const handleEditReservation = async () => {
    try {
      await axios.put(`${URL_API}/ambientes_reservas/${editedReservation.id}`, editedReservation);
      alert('Reserva Editada com sucesso!');
      router.reload();
    } catch (error) {
      alert(error.response.data.error);
      router.reload();
    }
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
    setReservationToEdit(null);
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);
  };

  const handleEditedDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedReservation((prev) => ({ ...prev, date: event.target.value }));
  };

  const handleEditedTimeChange = (periodo: string) => {
    setEditedReservation((prev) => ({ ...prev, periodo }));
  };

  const handleEditedEnvironmentChange = (envId: number) => {
    setEditedReservation((prev) => ({ ...prev, environment: envId }));
  };
  return (
    <div className="agendamento-container" style={{ fontFamily: 'Poppins, sans-serif' }}>
      <Sidebar />
      <div className="content">
        <h1>Agendar Reserva</h1>

        <div className="environments-container">
          {ambientes.map((env) => (
            <div
              key={env.id}
              onClick={() => {
                setSelectedEnvironment(env.id)
                setSelectedDate('');
              }}
              className={`environment-card ${selectedEnvironment === env.id ? 'selected' : ''}`}
              title={env.description}
              style={{ borderBottom: "4px solid #0066b3" }}
            >
              <div className="environment-icon">{env.icon}</div>
              <h3>{env.name}</h3>
              <p>{env.description}</p>
              <p><strong>Capacidade:</strong> {env.capacidade}</p>
              <p><strong>Equipamento:</strong> {env.materiais}</p>
              <div
                style={{ color: "#0066b3", width: "100%", textAlign: "center" }}
              >
              </div>
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
            {avaiablePeriods.map((periodo) => (
              <button
                disabled={dataLivreItem?.includes(periodo.periodo)}
                onClick={() => setPeriodoSelecionado(periodo.periodo)}
                className={`time-slot ${PeriodoSelecionado === periodo.periodo ? 'selected' : ''} ${dataLivreItem?.includes(periodo.periodo) ? 'disabled' : ''}`}
              >
                {periodo.periodo}
              </button>
            ))}
          </div>
        )}

        {/* Mensagem de erro ou sucesso */}
        {error && <div className="error-message">{error}</div>}

        {/* Botão para confirmar a reserva */}
        <button
          onClick={() => openConfirmationModal('reserve')}
          disabled={!PeriodoSelecionado || !selectedEnvironment || !selectedDate || isReserving}
          className="open-modal-btn"
        >
          {isReserving ? 'Carregando...' : 'Confirmar Reserva'}
        </button>

        <div className="reservas-container">
          <h3>Reservas Realizadas</h3>
          {reservas.length === 0 ? (
            <p>Nenhuma reserva realizada ainda.</p>
          ) : (
            <ul>
              {reservas.map((res, index) => {
                return (
                  <li key={index} className="reservation-item">
                    <div>
                      <strong>Data:</strong> {res.data_reserva} <strong>Período:</strong> {res.periodo}{' '}
                      <strong>Ambiente:</strong> {res.ambiente.name} <strong>Feito por:</strong> {res.user.name}
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
                      value={editedReservation?.data_reserva || ''}
                      onChange={handleEditedDateChange}
                    />
                    <label>Período:</label>
                    <select
                      value={editedReservation?.periodo || ''}
                      onChange={(e) => handleEditedTimeChange(e.target.value)}
                    >
                      {avaiablePeriods.map((periodo) => (
                        <option key={periodo.id} value={periodo.periodo}>
                          {periodo.periodo}
                        </option>
                      ))}
                    </select>
                    <label>Ambiente:</label>
                    <select
                      value={editedReservation?.environment || ''}
                      onChange={(e) => handleEditedEnvironmentChange(parseInt(e.target.value))}
                    >
                      {ambientes.map((env) => (
                        <option key={env.id} value={env.id}>
                          {env.name} {console.log(env)}
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
