import React from 'react';

interface ReservationHistoryProps {
  reservation: {
    id: number;
    date: string;
    time: string;
    environment: string;
  };
}

const ReservationHistory: React.FC<ReservationHistoryProps> = ({ reservation }) => {
  return (
    <div>
      <h3>{reservation.environment}</h3>
      <p>Data: {reservation.date}</p>
      <p>Horário: {reservation.time}</p>
    </div>
  );
};

export default ReservationHistory;
