// src/services/user.ts

export const getUserProfile = async () => {
    // Mock de dados de perfil ou chamada à API
    return {
      id: 1,
      name: 'João Silva',
      email: 'joao@exemplo.com',
      createdAt: new Date().toISOString(),
    };
  };
  
  export const updateUserProfile = async (data: { name: string; email: string }) => {
    // Simulação de atualização de perfil ou chamada à API
    console.log('Dados do perfil atualizados:', data);
  };
  
  export const updateUserPassword = async ({ password }: { password: string }) => {
    // Simulação de atualização de senha ou chamada à API
    console.log('Senha alterada:', password);
  };
  