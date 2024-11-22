import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import '../styles/GerenciarAmbientes.css';

interface Ambiente {
  id: number;
  name: string;
  description: string;
  capacity: string;
  equipment: string;
  location: string;
  hours: string;
}

const GerenciarAmbientes: React.FC = () => {
  const [ambientes, setAmbientes] = useState<Ambiente[]>([
    {
      id: 1,
      name: 'Biblioteca',
      description: 'Ambiente silencioso para leitura e estudo.',
      capacity: '50 pessoas',
      equipment: 'Wi-Fi, mesas de estudo',
      location: 'Bloco A, 1º andar',
      hours: '08:00 - 18:00',
    },
  ]);

  const [formData, setFormData] = useState<Ambiente>({
    id: 0,
    name: '',
    description: '',
    capacity: '',
    equipment: '',
    location: '',
    hours: '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddAmbiente = () => {
    if (formData.name && formData.description) {
      const newAmbiente = { ...formData, id: ambientes.length + 1 };
      setAmbientes([...ambientes, newAmbiente]);
      setFormData({
        id: 0,
        name: '',
        description: '',
        capacity: '',
        equipment: '',
        location: '',
        hours: '',
      });
    } else {
      alert('Por favor, preencha os campos obrigatórios.');
    }
  };

  const handleEditAmbiente = (id: number) => {
    const ambiente = ambientes.find((a) => a.id === id);
    if (ambiente) {
      setFormData(ambiente);
    }
  };

  const handleUpdateAmbiente = () => {
    setAmbientes((prev) =>
      prev.map((ambiente) =>
        ambiente.id === formData.id ? { ...formData } : ambiente
      )
    );
    setFormData({
      id: 0,
      name: '',
      description: '',
      capacity: '',
      equipment: '',
      location: '',
      hours: '',
    });
  };

  return (
    <div className="gerenciar-ambientes-page">
      <Sidebar />
      <div className="gerenciar-ambientes-content">
        <h1>Gerenciamento de Ambientes</h1>

        <div className="form-container">
          <h2>{formData.id ? 'Editar Ambiente' : 'Adicionar Novo Ambiente'}</h2>
          <input
            type="text"
            name="name"
            placeholder="Nome do Ambiente"
            value={formData.name}
            onChange={handleInputChange}
          />
          <textarea
            name="description"
            placeholder="Descrição"
            value={formData.description}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="capacity"
            placeholder="Capacidade"
            value={formData.capacity}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="equipment"
            placeholder="Equipamentos"
            value={formData.equipment}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="location"
            placeholder="Localização"
            value={formData.location}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="hours"
            placeholder="Horário de Funcionamento"
            value={formData.hours}
            onChange={handleInputChange}
          />
          <button onClick={formData.id ? handleUpdateAmbiente : handleAddAmbiente}>
            {formData.id ? 'Atualizar Ambiente' : 'Adicionar Ambiente'}
          </button>
        </div>

        <div className="ambientes-list">
          <h2>Ambientes Cadastrados</h2>
          {ambientes.map((ambiente) => (
            <div key={ambiente.id} className="ambiente-item">
              <h3>{ambiente.name}</h3>
              <p>{ambiente.description}</p>
              <button onClick={() => handleEditAmbiente(ambiente.id)}>Editar</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GerenciarAmbientes;
