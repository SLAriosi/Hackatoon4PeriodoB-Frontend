export interface Environment {
    id: string;
    name: string;
    status: 'available' | 'reserved' | 'maintenance';
  }
  