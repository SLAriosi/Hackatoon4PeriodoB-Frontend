import React from 'react';

interface Environment {
  id: number;
  name: string;
  status: string;
}

interface EnvironmentListProps {
  environments: Environment[];
}

const EnvironmentList: React.FC<EnvironmentListProps> = ({ environments }) => {
  return (
    <div>
      <h2>Ambientes Disponíveis</h2>
      <ul>
        {environments.map((environment) => (
          <li key={environment.id}>
            <strong>{environment.name}</strong> - Status: {environment.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EnvironmentList;
