import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import '../styles/Agendamento.css';
import axios from 'axios';

const URL_API = process.env.NEXT_PUBLIC_API_URL;

const Ambientes: React.FC = () => {
  
  const [ambientes, setAmbientes] = useState<any[]>([]);

  useEffect(() => {
    
    const fetchAmbientes = async () => {
      const response = await axios.get(`${URL_API}/ambientes`);
      const data = await response.data;

      setAmbientes(data);
    };

    fetchAmbientes();
  }, []);

  return (
    <div className="agendamento-container" style={{ fontFamily: 'Poppins, sans-serif' }}>
      <Sidebar />
      <div className="content">
        <h1>Ambientes Disponíveis</h1>

        {/* Seleção de Ambiente */}
        <div className="environments-container">
          {ambientes.map((env) => (
            <div
              key={env.id}
              className="environment-card"
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
      </div>
    </div>
  );
};

export default Ambientes;
