import React, { useState } from 'react';

type AvailableTime = {
  id: number;
  time: string;
};

interface ReservationFormProps {
  availableTimes: AvailableTime[];
  onReserve: (data: { date: string; time: string }) => void;
}

const ReservationForm: React.FC<ReservationFormProps> = ({ availableTimes, onReserve }) => {
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTime && selectedDate) {
      onReserve({ date: selectedDate, time: selectedTime });
    } else {
      alert('Por favor, selecione uma data e um horário.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        required
      />
      <select
        value={selectedTime}
        onChange={(e) => setSelectedTime(e.target.value)}
        required
      >
        <option value="">Selecione um horário</option>
        {availableTimes.map((time) => (
          <option key={time.id} value={time.time}>
            {time.time}
          </option>
        ))}
      </select>
      <button type="submit">Reservar</button>
    </form>
  );
};

export default ReservationForm;
