"use client";
import React, { useEffect, useState, useMemo } from 'react';
import Sidebar from '../components/Sidebar';
import { getReservations } from '../services/reservation';
import { Reservation } from '../types/reservation';
import { toast } from 'react-toastify';
import Chart from 'chart.js/auto';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import styles from '../styles/Dashboard.module.css';
import { useRouter } from 'next/router';
import axios from 'axios';

const Dashboard: React.FC = () => {
  // Estados
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filteredReservations, setFilteredReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [environments, setEnvironments] = useState<string[]>([]);

  const router = useRouter();
  const URL_API = process.env.NEXT_PUBLIC_API_URL

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, []);

  useEffect(() => {
    const permissao = (localStorage.getItem('role'));
    if (permissao) {
      setRole(permissao);
    }
  }, []);

  const itemsPerPage = 5;

  useEffect(() => {
    const fetchEnvironments = async () => {
      try {
        const response = await axios.get(`${URL_API}/ambientes`);
        setEnvironments(response.data);
      } catch (error) {
        toast.error('Erro ao carregar os ambientes!');
      }
    };
    fetchEnvironments();
  }, []);

  // Função para buscar as reservas
  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${URL_API}/ambientes_reservas`);
        const reservationsData = response.data;

        console.log('===============');
        console.log(response.data);
        console.log('===============');

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
  const filteredData: Reservation[] = useMemo(() => {
    let updatedReservations = reservations;

    // Filtro de Ambiente (search)
    if (searchQuery) {
      updatedReservations = updatedReservations.filter((res) => {
        console.log('Reserva:', res);
        return res.ambiente.name.toLowerCase().includes(searchQuery.toLowerCase());
      });
    }

    // Filtro de Data
    if (startDate && endDate) {
      updatedReservations = updatedReservations.filter((res) => {
        const resDate = new Date(res.data_reserva);
        const start = new Date(startDate);
        const end = new Date(endDate);
        console.log('Comparando datas:', resDate, start, end);
        return resDate >= start && resDate <= end;
      });
    }

    return updatedReservations;
  }, [searchQuery, reservations, startDate, endDate]);

  useEffect(() => {
    setFilteredReservations(filteredData);
  }, [filteredData]);

  // Função de renderização dos gráficos
  const renderCharts = (data: Reservation[]): void => {
    // Contagem de reservas por mês
    const monthlyCounts = Array(12).fill(0);
    data.forEach((res) => {
      const month = new Date(res.data_reserva).getMonth();
      monthlyCounts[month]++;
    });

    const ctxLine = document.getElementById('reservationChartLine') as HTMLCanvasElement;

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

  // Função para baixar o relatório em CSV
  const handleDownloadCSV = (): void => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Ambiente,Data,Status,Pessoa que Reservou']
        .concat(
          filteredReservations
            .map(
              (res) =>
                `${res.ambiente},${new Date(res.data_reserva).toLocaleString()},${res.user.course},${res.user.name}`
            )
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    saveAs(encodedUri, `reservations_report.csv`);
  };

  // Função para baixar o gráfico como imagem
  const handleDownloadChart = (chartId: string): void => {
    const chartCanvas = document.getElementById(chartId) as HTMLCanvasElement;
    if (chartCanvas) {
      const image = chartCanvas.toDataURL('image/png');
      saveAs(image, `${chartId}_chart.png`);
    }
  };

  // Função para gerar e baixar PDF
  const handleDownloadPDF = (): void => {
    const doc = new jsPDF();
    doc.setFontSize(10); // Set the font size to a smaller value
    doc.text('Relatório de Reservas', 20, 20);
    let yPosition = 30;
    filteredReservations.forEach((res, index) => {
      doc.text(
        `${index + 1}. Ambiente: ${res.ambiente.name}, Data: ${new Date(res.data_reserva).toLocaleString()}, Curso: ${res.user.course}, Pessoa que Reservou: ${res.user.name}`,
        20,
        yPosition
      );
      yPosition += 10;
      if (yPosition > 280) { // Check if the yPosition exceeds the page height
        doc.addPage();
        yPosition = 20; // Reset yPosition for the new page
      }
    });
    doc.save('reservations_report.pdf');
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReservations = filteredReservations.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page: number): void => setCurrentPage(page);

  // Total de reservas
  const totalReservations = reservations.length;

  return (
    <div className={styles.dashboardContainer} style={{ fontFamily: 'Poppins, sans-serif' }}>
      <Sidebar />
      <div className={styles.dashboardContent}>
        <h1 className={styles.dashboardTitle}>Dashboard de Reservas</h1>

        {/* Filtros e Lista de Reservas no topo */}
        <div className={styles.filtersAndReservations}>
          {/* Download Buttons */}
          {role === 'ADMINISTRADOR' && (
            <div className={styles.downloadButtons}>
              <button onClick={handleDownloadCSV}>Baixar CSV</button>
              <button onClick={handleDownloadPDF}>Baixar PDF</button>
              <button onClick={() => handleDownloadChart('reservationChartLine')}>Baixar Gráfico de Linhas</button>
            </div>
          )}

          {/* Lista de Reservas */}
          <div className={styles.reservationsTableContainer}>
            <h2>Reservas ({filteredReservations.length} de {totalReservations})</h2>

            {/* Filtros */}
            <div className={styles.filtersContainer}>
              <div className={styles.filters}>
                <input
                  type="text"
                  placeholder="Filtrar por ambiente"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div>
                  <label htmlFor="startDate">De:</label>
                  <input
                    type="date"
                    id="startDate"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="endDate">Até:</label>
                  <input
                    type="date"
                    id="endDate"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
            </div>

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
                    <th>Período</th> {/* Added Period column */}
                    <th>Curso</th>
                    <th>Pessoa que Reservou</th>
                  </tr>
                </thead>
                <tbody className='acoes-css'>

                  {currentReservations.map((res) => (
                    <tr key={res.id}>
                      <td>{res.ambiente.name}</td>
                      <td>{new Date(res.data_reserva).toLocaleDateString()}</td> {/* Only display the date */}
                      <td>{res.periodo}</td> {/* Display the period */}
                      <td>{res.user.course}</td>
                      <td>{res.user.name}</td>
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
        {role === 'ADMINISTRADOR' && (
          <div className={styles.chartsContainer}>
            <canvas id="reservationChartLine" width="400" height="200"></canvas>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;