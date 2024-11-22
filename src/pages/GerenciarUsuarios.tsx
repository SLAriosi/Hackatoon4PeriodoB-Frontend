import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import '../styles/GerenciarUsuarios.css';

interface Usuario {
  id: number;
  nome: string;
  tipo: 'Professor' | 'Aluno' | 'Secretário';
  curso?: string; // Apenas para professores
  email: string;
}

const GerenciarUsuarios: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]); // Lista de usuários
  const [formData, setFormData] = useState<Usuario>({
    id: 0,
    nome: '',
    tipo: 'Aluno',
    email: '',
    curso: '',
  });
  const [filtroTipo, setFiltroTipo] = useState<'Todos' | 'Aluno' | 'Professor' | 'Secretário'>('Todos'); // Filtro de tipo
  const [currentPage, setCurrentPage] = useState(1); // Página atual
  const itemsPerPage = 5; // Número de itens por página

  const cursosDisponiveis = [
    'Direito',
    'Sistemas para Internet',
    'Psicologia',
    'Pedagogia',
    'Administração',
  ];

  // Manipula as alterações no formulário
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Adiciona um novo usuário
  const handleAddUsuario = () => {
    if (!formData.nome || !formData.email) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const novoUsuario = { ...formData, id: usuarios.length + 1 };
    setUsuarios([...usuarios, novoUsuario]);
    setFormData({
      id: 0,
      nome: '',
      tipo: 'Aluno',
      email: '',
      curso: '',
    });
  };

  // Edita um usuário existente
  const handleEditUsuario = (id: number) => {
    const usuario = usuarios.find((u) => u.id === id);
    if (usuario) setFormData(usuario);
  };

  // Atualiza os dados de um usuário
  const handleUpdateUsuario = () => {
    setUsuarios((prev) =>
      prev.map((usuario) =>
        usuario.id === formData.id ? { ...formData } : usuario
      )
    );
    setFormData({
      id: 0,
      nome: '',
      tipo: 'Aluno',
      email: '',
      curso: '',
    });
  };

  // Exclui um usuário
  const handleDeleteUsuario = (id: number) => {
    const confirmDelete = window.confirm('Tem certeza que deseja excluir este usuário?');
    if (confirmDelete) {
      setUsuarios(usuarios.filter((usuario) => usuario.id !== id));
    }
  };

  // Filtra os usuários por tipo
  const filteredUsuarios = usuarios.filter((usuario) =>
    filtroTipo === 'Todos' ? true : usuario.tipo === filtroTipo
  );

  // Calcula os usuários a serem exibidos na página atual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsuarios = filteredUsuarios.slice(indexOfFirstItem, indexOfLastItem);

  // Mudança de página
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="gerenciar-usuarios-page">
      <Sidebar />
      <div className="gerenciar-usuarios-content">
        <h1>Gerenciamento de Usuários</h1>

        <div className="form-container">
          <h2>{formData.id ? 'Editar Usuário' : 'Adicionar Novo Usuário'}</h2>
          <input
            type="text"
            name="nome"
            placeholder="Nome"
            value={formData.nome}
            onChange={handleInputChange}
          />
          <input
            type="email"
            name="email"
            placeholder="E-mail"
            value={formData.email}
            onChange={handleInputChange}
          />
          <select
            name="tipo"
            value={formData.tipo}
            onChange={handleInputChange}
          >
            <option value="Aluno">Aluno</option>
            <option value="Professor">Professor</option>
            <option value="Secretário">Secretário</option>
          </select>
          {formData.tipo === 'Professor' && (
            <select
              name="curso"
              value={formData.curso || ''}
              onChange={handleInputChange}
            >
              <option value="">Selecione o curso</option>
              {cursosDisponiveis.map((curso, index) => (
                <option key={index} value={curso}>
                  {curso}
                </option>
              ))}
            </select>
          )}
          <button onClick={formData.id ? handleUpdateUsuario : handleAddUsuario}>
            {formData.id ? 'Atualizar Usuário' : 'Adicionar Usuário'}
          </button>
        </div>

        <div className="filtros">
          <label htmlFor="filtro">Filtrar por tipo:</label>
          <select
            id="filtro"
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value as 'Todos' | 'Aluno' | 'Professor' | 'Secretário')}
          >
            <option value="Todos">Todos</option>
            <option value="Aluno">Aluno</option>
            <option value="Professor">Professor</option>
            <option value="Secretário">Secretário</option>
          </select>
        </div>

        <div className="usuarios-list">
          <h2>Usuários Cadastrados</h2>
          {currentUsuarios.map((usuario) => (
            <div key={usuario.id} className="usuario-item">
              <h3>{usuario.nome}</h3>
              <p><strong>Tipo:</strong> {usuario.tipo}</p>
              <p><strong>Email:</strong> {usuario.email}</p>
              {usuario.tipo === 'Professor' && <p><strong>Curso:</strong> {usuario.curso}</p>}
              <button onClick={() => handleEditUsuario(usuario.id)}>Editar</button>
              <button onClick={() => handleDeleteUsuario(usuario.id)}>Excluir</button>
            </div>
          ))}
        </div>

        {/* Paginação */}
        <div className="pagination">
          {Array.from({ length: Math.ceil(filteredUsuarios.length / itemsPerPage) }, (_, index) => (
            <button key={index + 1} onClick={() => paginate(index + 1)}>
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GerenciarUsuarios;
