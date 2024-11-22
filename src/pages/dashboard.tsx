import React, { useEffect, useState, useMemo } from 'react';
import Sidebar from '../components/Sidebar';
import { getReservations } from '../services/reservation';
import { Reservation } from '../types/reservation';
import { toast } from 'react-toastify';
import Chart from 'chart.js/auto';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import styles from '../styles/Dashboard.module.css';

const Dashboard: React.FC = () => {
  // Estados
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filteredReservations, setFilteredReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [statusUpdate, setStatusUpdate] = useState<string>('');  // Para marcar "faltou" nas reservas
  const [currentPage, setCurrentPage] = useState<number>(1);

  const itemsPerPage = 5;
  const environments = ['Auditório', 'AlphaLAB', 'Salas', 'Biblioteca'];

  // Função para buscar as reservas
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const reservationsData = await getReservations();
        setReservations(reservationsData);
        setFilteredReservations(reservationsData);
        renderCharts(reservationsData);
      } catch (error) {
        setError('Erro ao carregar as reservas! Tente novamente mais tarde.');
        toast.error('Erro ao carregar as reservas!');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filtro das reservas com uso de useMemo para otimizar
  const filteredData = useMemo(() => {
    let updatedReservations = reservations;

    // Filtro de Status
    if (filterStatus !== 'all') {
      updatedReservations = updatedReservations.filter(
        (res) => res.status.toLowerCase() === filterStatus.toLowerCase()
      );
    }

    // Filtro de Ambiente (search)
    if (searchQuery) {
      updatedReservations = updatedReservations.filter((res) =>
        res.environment.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filtro de Data
    if (startDate && endDate) {
      updatedReservations = updatedReservations.filter((res) => {
        const resDate = new Date(res.date);
        return resDate >= new Date(startDate) && resDate <= new Date(endDate);
      });
    }

    return updatedReservations;
  }, [filterStatus, searchQuery, reservations, startDate, endDate]);

  useEffect(() => {
    setFilteredReservations(filteredData);
  }, [filteredData]);

  // Função de renderização dos gráficos
  const renderCharts = (data: Reservation[]) => {
    const environmentCounts = environments.map(
      (env) => data.filter((res) => res.environment === env).length
    );

    const monthlyCounts = Array(12).fill(0);
    data.forEach((res) => {
      const month = new Date(res.date).getMonth();
      monthlyCounts[month]++;
    });

    const ctxBar = document.getElementById('reservationChartBar') as HTMLCanvasElement;
    const ctxLine = document.getElementById('reservationChartLine') as HTMLCanvasElement;

    if (ctxBar) {
      new Chart(ctxBar, {
        type: 'bar',
        data: {
          labels: environments,
          datasets: [
            {
              label: 'Reservas por Ambiente',
              data: environmentCounts,
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: true },
          },
        },
      });
    }

    if (ctxLine) {
      new Chart(ctxLine, {
        type: 'line',
        data: {
          labels: Array.from({ length: 12 }, (_, i) => `Mês ${i + 1}`),
          datasets: [
            {
              label: 'Reservas por Mês',
              data: monthlyCounts,
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: true },
          },
        },
      });
    }
  };

  // Função para atualizar status da reserva
  const handleStatusUpdate = (id: number, status: string) => {
    const updatedReservations = reservations.map((res) =>
      res.id === id ? { ...res, status } : res
    );
    setReservations(updatedReservations);
    setFilteredReservations(updatedReservations);
    toast.success(`Status da reserva atualizado para "${status}"`);
  };

  // Função para baixar o relatório em CSV
  const handleDownloadCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Ambiente,Data,Status,Pessoa que Reservou']
        .concat(
          filteredReservations
            .map(
              (res) =>
                `${res.environment},${new Date(res.date).toLocaleString()},${res.status},${res.reservedBy}`
            )
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    saveAs(encodedUri, `reservations_report.csv`);
  };

  // Função para baixar o gráfico como imagem
  const handleDownloadChart = (chartId: string) => {
    const chartCanvas = document.getElementById(chartId) as HTMLCanvasElement;
    if (chartCanvas) {
      const image = chartCanvas.toDataURL('image/png');
      saveAs(image, `${chartId}_chart.png`);
    }
  };

  // Função para gerar e baixar PDF
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text('Relatório de Reservas', 20, 20);
    filteredReservations.forEach((res, index) => {
      doc.text(
        `${index + 1}. Ambiente: ${res.environment}, Data: ${new Date(res.date).toLocaleString()}, Status: ${res.status}, Pessoa que Reservou: ${res.reservedBy}`,
        20,
        30 + index * 10
      );
    });
    doc.save('reservations_report.pdf');
  };

  // Função para contar reservas por status
  const countReservationsByStatus = () => {
    return reservations.reduce(
      (acc, res) => {
        if (res.status === 'pendente') acc.pending++;
        if (res.status === 'concluido') acc.completed++;
        if (res.status === 'cancelado') acc.canceled++;
        return acc;
      },
      { pending: 0, completed: 0, canceled: 0 }
    );
  };

  const { pending, completed, canceled } = countReservationsByStatus();

  // Cálculo de índices para paginação
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReservations = filteredReservations.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page: number) => setCurrentPage(page);

  // Total de reservas
  const totalReservations = reservations.length;

  return (
    <div className={styles.dashboardContainer}>
      <Sidebar />
      <div className={styles.dashboardContent}>
        <h1 className={styles.dashboardTitle}>Dashboard de Reservas</h1>

        {/* Filtros e Lista de Reservas no topo */}
        <div className={styles.filtersAndReservations}>
          {/* Filtros */}
          <div className={styles.filtersContainer}>
            <div className={styles.filters}>
              <input
                type="text"
                placeholder="Filtrar por ambiente"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">Todos os Status</option>
                <option value="pendente">Pendente</option>
                <option value="concluido">Concluído</option>
                <option value="cancelado">Cancelado</option>
              </select>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            {/* Botões de download */}
            <div className={styles.downloadButtons}>
              <button onClick={handleDownloadCSV}>Baixar CSV</button>
              <button onClick={handleDownloadPDF}>Baixar PDF</button>
              <button onClick={() => handleDownloadChart('reservationChartBar')}>Baixar Gráfico de Barras</button>
              <button onClick={() => handleDownloadChart('reservationChartLine')}>Baixar Gráfico de Linhas</button>
            </div>
          </div>

          {/* Lista de Reservas */}
          <div className={styles.reservationsTableContainer}>
            <h2>Reservas ({filteredReservations.length} de {totalReservations})</h2>
            {loading ? (
              <p>Carregando...</p>
            ) : error ? (
              <p>{error}</p>
            ) : (
              <table className={styles.reservationsTable}>
                <thead>
                  <tr>
                    <th>Ambiente</th>
                    <th>Data</th>
                    <th>Status</th>
                    <th>Pessoa que Reservou</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {currentReservations.map((res) => (
                    <tr key={res.id}>
                      <td>{res.environment}</td>
                      <td>{new Date(res.date).toLocaleString()}</td>
                      <td>{res.status}</td>
                      <td>{res.reservedBy}</td>
                      <td>
                        <button
                          onClick={() => handleStatusUpdate(res.id, 'concluido')}
                          disabled={res.status === 'concluido'}
                        >
                          Concluído
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(res.id, 'pendente')}
                          disabled={res.status === 'pendente'}
                        >
                          Pendente
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(res.id, 'cancelado')}
                          disabled={res.status === 'cancelado'}
                        >
                          Cancelado
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {/* Paginação */}
            <div className={styles.pagination}>
              {Array.from(
                { length: Math.ceil(filteredReservations.length / itemsPerPage) },
                (_, index) => index + 1
              ).map((pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={currentPage === pageNumber ? styles.active : ''}
                >
                  {pageNumber}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Gráficos */}
        <div className={styles.chartsContainer}>
          <canvas id="reservationChartBar" width="400" height="200"></canvas>
          <canvas id="reservationChartLine" width="400" height="200"></canvas>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
