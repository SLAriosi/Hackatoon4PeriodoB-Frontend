import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import '../styles/GerenciarUsuarios.css';
import { FaSpinner } from 'react-icons/fa';
import axios from 'axios';

const URL_API = process.env.NEXT_PUBLIC_API_URL;
interface Usuario {
  id: number;
  name: string;
  email: string;
  password: string;
  role: 'ADMINISTRADOR' | 'PROFESSOR' | 'ESTUDANTE';
  course?: 'PEDAGOGIA' | 'SISTEMAS' | 'DIREITO' | 'PSICOLOGIA' | '';
}


const GerenciarUsuarios: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [formData, setFormData] = useState<Usuario>({
    id: 0,
    name: '',
    role: 'ESTUDANTE',
    email: '',
    course: '',
    password: '',
  });
  const [filtroTipo, setFiltroTipo] = useState<'Todos' | 'ESTUDANTE' | 'Professor' | 'Secretário'>('Todos');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 5;

  const cursosDisponiveis = [
    'SISTEMAS',
    'DIREITO',
    'PEDAGOGIA',
    'PSICOLOGIA',
  ];

  useEffect(() => {
    const fetchUsuarios = async () => {
      const response = await axios.get(`${URL_API}/users`);
      setUsuarios(response.data);
      setIsLoading(false);

      console.log('==========');
      console.log(response.data);
      console.log('==========');

    };
    fetchUsuarios();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSaveUsuario = () => {
    if (!formData.name || !formData.email || !formData.password) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setFormData({
      id: 0,
      name: '',
      role: 'ESTUDANTE',
      email: '',
      course: '',
      password: '',
    });
    setShowModal(false);
  };

  const handleEditUsuario = (id: number) => {
    const usuario = usuarios.find((u) => u.id === id);
    if (usuario) {
      setFormData(usuario);
      setShowModal(true);
    }
  };

  const handleDeleteUsuario = (id: number) => {
    setUsuarios(usuarios.filter((u) => u.id !== id));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFiltroTipo(e.target.value as 'Todos' | 'ESTUDANTE' | 'Professor' | 'Secretário');
  };

  const filteredUsuarios = usuarios.filter(usuario =>
    (filtroTipo === 'Todos' || usuario.role === filtroTipo) &&
    (usuario.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const paginatedUsuarios = filteredUsuarios.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="perfil-page" style={{ fontFamily: 'Poppins, sans-serif' }}>
      {isLoading && (
        <div className="loading-modal">
          <div className="loading-spinner">
            <FaSpinner className="spinner-icon" />
          </div>
        </div>
      )}
      {!isLoading && (
        <div className="gerenciar-usuarios">
          <Sidebar />
          <div className="content">
            <h1>Gerenciar Usuários</h1>
            <div className="search-filter">
              <input
                type="text"
                placeholder="Buscar por nome ou email..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <select value={filtroTipo} onChange={handleFilterChange}>
                <option value="Todos">Todos</option>
                <option value="Aluno">Aluno</option>
                <option value="Professor">Professor</option>
                <option value="Secretário">Secretário</option>
              </select>
              <button onClick={() => setShowModal(true)}>Adicionar Usuário</button>
            </div>
            <table className="user-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Tipo</th>
                  <th>Curso</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsuarios.map(usuario => (
                  <tr key={usuario.id}>
                    <td>{usuario.name}</td>
                    <td>{usuario.email}</td>
                    <td>{usuario.role}</td>
                    <td>{usuario.course}</td>
                    <td>
                      <button onClick={() => handleEditUsuario(usuario.id)}>Editar</button>
                      <button onClick={() => handleDeleteUsuario(usuario.id)}>Excluir</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="pagination">
              {Array.from({ length: Math.ceil(filteredUsuarios.length / itemsPerPage) }, (_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={currentPage === index + 1 ? 'active' : ''}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            {showModal && (
              <div className="modal">
                <div className="modal-content">
                  <span className="close" onClick={() => setShowModal(false)}>&times;</span>
                  <form onSubmit={(e) => { e.preventDefault(); handleSaveUsuario(); }}>
                    <input
                      type="text"
                      name="nome"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Nome"
                      required
                    />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Email"
                      required
                    />
                    <input
                      type="password"
                      name="senha"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Senha"
                      required
                    />
                    <select name="role" value={formData.role} onChange={handleInputChange}>
                      <option value="Aluno">Aluno</option>
                      <option value="Professor">Professor</option>
                      <option value="Secretário">Secretário</option>
                    </select>
                    {formData.role === 'ESTUDANTE' && (
                      <select name="curso" value={formData.role} onChange={handleInputChange}>
                        {cursosDisponiveis.map(curso => (
                          <option key={curso} value={curso}>{curso}</option>
                        ))}
                      </select>
                    )}
                    <button type="submit">Salvar</button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GerenciarUsuarios;