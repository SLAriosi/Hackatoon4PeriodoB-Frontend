import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import '../styles/GerenciarUsuarios.css';
import { FaSpinner, FaEdit, FaTrash } from 'react-icons/fa'; // Import the icons
import axios from 'axios';
import { useRouter } from 'next/router';

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
  const [newUser, setNewUser] = useState<Usuario>({
    id: 0,
    name: '',
    role: 'ESTUDANTE',
    email: '',
    course: '',
    password: '',
    password_confirmation: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
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
    };
    fetchUsuarios();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleSaveUsuario = async () => {
    if (!formData.name || !formData.email || !formData.password) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    try {
      await axios.post(`${URL_API}/users`, formData);
      const response = await axios.get(`${URL_API}/users`);
      setUsuarios(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
    }

    setFormData({
      id: 0,
      name: '',
      role: 'ESTUDANTE',
      email: '',
      course: '',
      password: '',
      password_confirmation: '',
    });
    setShowModal(false);
  };

  const handleEdit = (id: number) => {
    const usuario = usuarios.find((u) => u.id === id);
    if (usuario) {
      setNewUser(usuario);
      setShowModal(true);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm('Você tem certeza que deseja excluir este usuário?');
    if (confirmDelete) {
      await axios.delete(`${URL_API}/users/${id}`);
      const response = await axios.get(`${URL_API}/users`);
      setUsuarios(response.data);
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleUpdateUsuario = async (id: number) => {
    try {
      await axios.put(`${URL_API}/users/${id}`, newUser);
      router.reload();
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
    }
  };

  const filteredUsuarios = usuarios.filter(usuario =>
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
                      <FaEdit onClick={() => handleEdit(usuario.id)} style={{ cursor: 'pointer', marginRight: '10px' }} />
                      <FaTrash onClick={() => handleDelete(usuario.id)} style={{ cursor: 'pointer', color: 'red' }} />
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
                      name="name"
                      value={newUser.name}
                      onChange={handleInputChange}
                      placeholder="Nome"
                      required
                    />
                    <input
                      type="email"
                      name="email"
                      value={newUser.email}
                      onChange={handleInputChange}
                      placeholder="Email"
                      required
                    />
                    <input
                      type="password"
                      name="password"
                      value={newUser.password}
                      onChange={handleInputChange}
                      placeholder="Senha"
                      required
                    />
                    <input
                      type="password"
                      name="password_confirmation"
                      value={newUser.password_confirmation}
                      onChange={handleInputChange}
                      placeholder="Confirme a Senha"
                      required
                    />
                    <select name="role" value={newUser.role} onChange={handleInputChange}>
                      <option value="ESTUDANTE">Aluno</option>
                      <option value="PROFESSOR">Professor</option>
                      <option value="ADMINISTRADOR">Administração</option>
                    </select>
                    {(newUser.role === 'ESTUDANTE' || newUser.role === 'PROFESSOR') && (
                      <select name="course" value={newUser.course} onChange={handleInputChange}>
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