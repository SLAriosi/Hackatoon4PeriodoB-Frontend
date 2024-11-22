import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import '../styles/Agendamento.css';

const Ambientes: React.FC = () => {
  const environments = [
    { id: 1, name: 'Biblioteca', description: 'Ambiente silencioso para leitura', icon: '📚', capacity: '50 pessoas', equipment: 'Wi-Fi, mesas de estudo' },
    { id: 2, name: 'Salas de Aula', description: 'Salas para aulas e reuniões acadêmicas', icon: '🖊️', capacity: '30 pessoas', equipment: 'Projetor, quadro branco' },
    { id: 3, name: 'AlphaLAB', description: 'Espaço para inovação e prototipagem', icon: '💡', capacity: '15 pessoas', equipment: 'Computadores, impressora 3D' },
    { id: 4, name: 'Auditório', description: 'Espaço para palestras e eventos', icon: '🎤', capacity: '200 pessoas', equipment: 'Microfone, som, telão' },
  ];

  return (
    <div className="agendamento-container">
      <Sidebar />
      <div className="content">
        <h1>Ambientes Disponíveis</h1>

        {/* Seleção de Ambiente */}
        <div className="environments-container">
          {environments.map((env) => (
            <div
              key={env.id}
              className="environment-card"
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
      </div>
    </div>
  );
};

export default Ambientes;
