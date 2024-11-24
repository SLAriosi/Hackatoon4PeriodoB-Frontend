import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import { CSVLink } from 'react-csv';
import Sidebar from '../components/Sidebar';
import styles from '../styles/Historico.module.css';
import { useRouter } from 'next/router';

interface Reservation {
  id: number;
  user: string;
  environment: string;
  date: string;
  status: string;
}

const Historico: React.FC = () => {
  // Dados estáticos
  const initialHistory: Reservation[] = [
    { id: 1, user: 'Ana Souza', environment: 'Biblioteca', date: '2024-11-10T10:00:00', status: 'Confirmada' },
    { id: 2, user: 'Carlos Oliveira', environment: 'AlphaLab', date: '2024-11-12T14:00:00', status: 'Cancelada' },
    { id: 3, user: 'Luciana Silva', environment: 'Auditório', date: '2024-11-14T09:30:00', status: 'Confirmada' },
    { id: 4, user: 'Marcos Pereira', environment: 'Salas', date: '2024-11-15T13:00:00', status: 'Pendente' },
    { id: 5, user: 'Juliana Santos', environment: 'Biblioteca', date: '2024-11-20T16:00:00', status: 'Confirmada' },
    // Adicione mais dados conforme necessário
  ];

  // Definindo os ambientes
  const environments = ['Biblioteca', 'AlphaLab', 'Auditório', 'Salas'];

  // States
  const [history, setHistory] = useState<Reservation[]>(initialHistory);
  const [filteredHistory, setFilteredHistory] = useState<Reservation[]>(initialHistory);
  const [userFilter, setUserFilter] = useState('');
  const [environmentFilter, setEnvironmentFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, []);

  // Função de filtro
  const filterHistory = () => {
    let filtered = history;

    if (userFilter) {
      filtered = filtered.filter(reservation =>
        reservation.user.toLowerCase().includes(userFilter.toLowerCase())
      );
    }

    if (environmentFilter) {
      filtered = filtered.filter(reservation =>
        reservation.environment.toLowerCase().includes(environmentFilter.toLowerCase())
      );
    }

    if (dateFilter) {
      filtered = filtered.filter(reservation =>
        new Date(reservation.date).toLocaleDateString('pt-BR').includes(dateFilter)
      );
    }

    setFilteredHistory(filtered);
  };

  // Gerar PDF
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Histórico de Reservas', 20, 20);
    doc.setFontSize(12);
    filteredHistory.forEach((item, index) => {
      const y = 30 + index * 10;
      doc.text(
        `${item.user} reservou o ${item.environment} no dia ${new Date(item.date).toLocaleDateString(
          'pt-BR'
        )} às ${new Date(item.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}. Status: ${item.status}`,
        20,
        y
      );
    });
    doc.save('historico_reservas.pdf');
  };

  return (
    <div className={styles.historicoContainer} style={{ fontFamily: 'Poppins, sans-serif' }}>
      <Sidebar />
      <div className={styles.historicoContent}>
        <h1 className={styles.historicoTitle}>Histórico de Reservas</h1>

        {/* Barra de filtros */}
        <div className={styles.filtersContainer}>
          <input
            type="text"
            placeholder="Pesquisar por usuário"
            value={userFilter}
            onChange={(e) => {
              setUserFilter(e.target.value);
              filterHistory();
            }}
            className={styles.filterInput}
          />
          
          {/* Seletor de ambientes */}
          <select
            value={environmentFilter}
            onChange={(e) => {
              setEnvironmentFilter(e.target.value);
              filterHistory();
            }}
            className={styles.filterInput}
          >
            <option value="">Selecionar ambiente</option>
            {environments.map((env) => (
              <option key={env} value={env}>{env}</option>
            ))}
          </select>

          {/* Filtro de data */}
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => {
              setDateFilter(e.target.value);
              filterHistory();
            }}
            className={styles.filterInput}
          />
        </div>

        {/* Exibição de botões para exportação */}
        <div className={styles.exportButtons}>
          <button onClick={generatePDF} className={styles.pdfButton}>
            Exportar para PDF
          </button>
          <CSVLink data={filteredHistory} filename="historico_reservas.csv" className={styles.csvButton}>
            Exportar para CSV
          </CSVLink>
        </div>

        {/* Exibição da tabela de reservas */}
        <table className={styles.reservationTable}>
          <thead>
            <tr>
              <th>Usuário</th>
              <th>Ambiente</th>
              <th>Data</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredHistory.length > 0 ? (
              filteredHistory.map((reservation) => (
                <tr key={reservation.id}>
                  <td>{reservation.user}</td>
                  <td>{reservation.environment}</td>
                  <td>{new Date(reservation.date).toLocaleDateString('pt-BR')}</td>
                  <td>{reservation.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4}>Nenhuma reserva encontrada</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Historico;
