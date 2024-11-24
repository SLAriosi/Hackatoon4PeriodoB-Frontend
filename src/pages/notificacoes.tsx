import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import '../styles/Notificacoes.css';
import { useRouter } from 'next/router';
import { FaSpinner } from 'react-icons/fa';
import axios from 'axios';

interface Notificacao {
  id: number;
  tipo: 'reserva' | 'alteracao' | 'cancelamento' | 'lembrete';
  mensagem: string;
  tempo: string;
  lida: boolean;
}

const URL_API = process.env.NEXT_PUBLIC_API_URL;

const Notificacoes = () => {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const usuario_id = localStorage.getItem('userId');
      const response = await axios.get(`${URL_API}/notificacoes/usuario/${usuario_id}`);
      setNotificacoes(response.data);
    };

    fetchData();
  }, []);

  // Função para marcar a notificação como lida
  const marcarComoLida = async (id: number) => {
    await axios.put(`${URL_API}/notificacoes/${id}`, { lida: true });
    router.reload();
  };

  // Função para excluir notificação
  const excluirNotificacao = async (id: number) => {
    await axios.delete(`${URL_API}/notificacoes/${id}`);
    router.reload();
  };

  // Função para renderizar o tipo de notificação
  const renderNotificacaoTipo = (tipo: string) => {
    switch (tipo) {
      case 'reserva': return 'Reserva Confirmada';
      case 'alteracao': return 'Alteração de Reserva';
      case 'cancelamento': return 'Cancelamento';
      case 'lembrete': return 'Lembrete';
      default: return '';
    }
  };

  return (
    <div className="notificacoes-container">
      <Sidebar />
      <div className="notificacoes-content">
        <h1>Notificações</h1>
        <div className="notificacao-lista">
          {notificacoes.length === 0 ? (
            <p className="mensagem-vazia">Sem novas notificações</p>
          ) : (
            notificacoes.map((notificacao) => (
              <div
                key={notificacao.id}
                className={`notificacao-item ${notificacao.lida ? 'lida' : ''}`}
              >
                <div className="info">
                  <p className="tipo">{renderNotificacaoTipo(notificacao.tipo)}</p>
                  <p className="mensagem">{notificacao.mensagem}</p>
                  <span className="tempo">{notificacao.tempo}</span>
                </div>
                <div className="acoes">
                  {!notificacao.lida && (
                    <button onClick={() => marcarComoLida(notificacao.id)} className="btn-lida">Marcar como lida</button>
                  )}
                  <button onClick={() => excluirNotificacao(notificacao.id)} className="btn-excluir">Excluir</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Notificacoes;
