import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import '../styles/Notificacoes.css';

interface Notificacao {
  id: number;
  tipo: 'reserva' | 'alteracao' | 'cancelamento' | 'lembrete';
  mensagem: string;
  tempo: string;
  lida: boolean;
}

const Notificacoes = () => {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([
    { id: 1, tipo: 'reserva', mensagem: 'Sua reserva foi feita com sucesso!', tempo: '10 minutos atrás', lida: false },
    { id: 2, tipo: 'alteracao', mensagem: 'O horário da sua reserva foi alterado para as 16h.', tempo: '1 hora atrás', lida: false },
    { id: 3, tipo: 'cancelamento', mensagem: 'Sua reserva foi cancelada.', tempo: '2 horas atrás', lida: false },
    { id: 4, tipo: 'lembrete', mensagem: 'Lembrete: Sua reserva começa em 30 minutos.', tempo: '5 minutos atrás', lida: false },
  ]);

  // Função para marcar a notificação como lida
  const marcarComoLida = (id: number) => {
    setNotificacoes(prevState => prevState.map(notificacao => 
      notificacao.id === id ? { ...notificacao, lida: true } : notificacao
    ));
  };

  // Função para excluir notificação
  const excluirNotificacao = (id: number) => {
    setNotificacoes(prevState => prevState.filter(notificacao => notificacao.id !== id));
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
