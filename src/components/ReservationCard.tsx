import React from 'react';

interface ReservationCardProps {
  reservation: {
    id: number;
    environment: string;
    date: string;
    time: string;
  };
}

const ReservationCard: React.FC<ReservationCardProps> = ({ reservation }) => {
  return (
    <div>
      <h3>{reservation.environment}</h3>
      <p>Data: {reservation.date}</p>
      <p>Horário: {reservation.time}</p>
    </div>
  );
};

export default ReservationCard;
