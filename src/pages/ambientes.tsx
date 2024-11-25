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
    <div className="agendamento-container" style={{ fontFamily: 'Poppins, sans-serif', display: 'flex' }}>
      <Sidebar />
      <div className="content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        <h1>Ambientes Disponíveis</h1>

        {/* Seleção de Ambiente */}
        <div className="environments-container" style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '20px', width: '100%' }}>
          {ambientes.map((env) => (
            <div
              key={env.id}
              className={`environment-card ${env.is_active === 0 ? 'inactive' : ''}`}
              title={env.description}
              style={{ borderBottom: "4px solid #0066b3", margin: '10px', textAlign: 'center', flex: '1 1 calc(33% - 20px)', boxSizing: 'border-box' }}
            >
                <div className="environment-icon">{env.icon}</div>
                <h3>{env.name}</h3>
                <p>{env.description}</p>
                <p><strong>Capacidade:</strong> {env.capacidade}</p>
                <p><strong>Equipamento:</strong> {env.materiais}</p>
                {env.is_active === 0 && <h3><strong>Manutenção</strong></h3>}
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