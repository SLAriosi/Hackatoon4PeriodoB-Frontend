import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import '../styles/GerenciarAmbientes.css';
import { useRouter } from 'next/router';
import { FaSpinner } from 'react-icons/fa';

interface Ambiente {
  id: number;
  name: string;
  description: string;
  capacidade: string;
  materiais: string;
  is_active: boolean;
}

const URL_API = process.env.NEXT_PUBLIC_API_URL;

const GerenciarAmbientes: React.FC = () => {
  const [ambientes, setAmbientes] = useState<Ambiente[]>()
  const [ambienteEdit, setAmbienteEdit] = useState<Ambiente[]>()
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchAmbientes = async () => {

      const response = await axios.get(`${URL_API}/ambientes`);
      const data = await response.data;
      setAmbientes(data);
      setIsLoading(false);
    };

    fetchAmbientes();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setAmbienteEdit({ ...ambienteEdit, [name]: value });
  };

  const handleAddAmbiente = async () => {
    try {
      setIsLoading(true);
      await axios.post(`${URL_API}/ambientes`, ambienteEdit);
      router.reload();
    } catch (error) {
      console.warn(error.message);
      setIsLoading(false);
    }
  };

  const handleEditAmbiente = async (id: number) => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${URL_API}/ambientes/${id}`);
      const data = await response.data;

      setAmbienteEdit(data);
      setIsLoading(false);
    } catch (error) {
      console.warn(error.message);
      setIsLoading(false);
    }
  };

  const handleDeleteAmbiente = async (id: number) => {
    try {
      setIsLoading(true);
      await axios.delete(`${URL_API}/ambientes/${id}`);
      router.reload();
    } catch (error) {
      console.warn(error.message);
      setIsLoading(false);
    }
  };

  const confirmDelete = (id: number) => {
    const isConfirmed = window.confirm("Você tem certeza que deseja deletar este ambiente?");
    if (isConfirmed) {
      handleDeleteAmbiente(id);
    }
  };

  const handleUpdateAmbiente = async (id: number) => {
    try {
      setIsLoading(true);
      await axios.put(`${URL_API}/ambientes/${id}`, ambienteEdit);
      router.reload();
    } catch (error) {
      console.warn(error.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="gerenciar-ambientes-page" style={{ fontFamily: 'Poppins, sans-serif' }}>
      {isLoading && (
        <div className="loading-modal">
          <div className="loading-spinner">
            <FaSpinner className="spinner-icon" />
          </div>
        </div>
      )}
      {!isLoading && (
        <>
          <Sidebar />
          <div className="gerenciar-ambientes-content">
            <h1>Gerenciamento de Ambientes</h1>

            <div className="form-container">
              <h2>{ambienteEdit?.id ? 'Editar Ambiente' : 'Adicionar Novo Ambiente'}</h2>
              <input
                type="text"
                name="name"
                placeholder="Nome do Ambiente"
                value={ambienteEdit?.name}
                onChange={handleInputChange}
              />
              <textarea
                name="description"
                placeholder="Descrição"
                value={ambienteEdit?.description}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="capacidade"
                placeholder="Capacidade"
                value={ambienteEdit?.capacidade}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="materiais"
                placeholder="Materiais"
                value={ambienteEdit?.materiais}
                onChange={handleInputChange}
              />
              <select
                name="is_active"
                value={ambienteEdit?.is_active}
                onChange={handleInputChange}
              >
                <option value="1">Ativo</option>
                <option value="0">Inativo</option>
              </select>
              <button onClick={ambienteEdit?.id ? () => handleUpdateAmbiente(ambienteEdit?.id) : handleAddAmbiente}>
                {ambienteEdit?.id ? 'Atualizar Ambiente' : 'Adicionar Ambiente'}
              </button>
            </div>

            <div className="ambientes-list">
              <h2>Ambientes Cadastrados</h2>
              {ambientes?.map((ambiente) => (
                <div key={ambiente.id} className="ambiente-item">
                  <h3>{ambiente.name}</h3>
                  <p>{ambiente.description}</p>
                  <div className="div-buttons">
                    <button className="edit-button" onClick={() => handleEditAmbiente(ambiente.id)}>Editar</button>
                    <button className="delete-button" onClick={() => confirmDelete(ambiente.id)}>Deletar</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default GerenciarAmbientes;
