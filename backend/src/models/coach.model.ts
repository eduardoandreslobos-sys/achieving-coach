export interface Coach {
  id: string;
  userId: string;
  email: string;
  displayName: string;
  bio?: string;
  specialties: string[];
  certifications: string[];
  hourlyRate?: number;
  currency: string;
  timezone: string;
  availability: WeeklyAvailability;
  status: 'active' | 'inactive' | 'pending';
  createdAt: Date;
  updatedAt: Date;
}

export interface WeeklyAvailability {
  monday: TimeSlot[];
  tuesday: TimeSlot[];
  wednesday: TimeSlot[];
  thursday: TimeSlot[];
  friday: TimeSlot[];
  saturday: TimeSlot[];
  sunday: TimeSlot[];
}

export interface TimeSlot {
  start: string; // "09:00"
  end: string;   // "17:00"
}

export interface CreateCoachDTO {
  userId: string;
  email: string;
  displayName: string;
  bio?: string;
  specialties?: string[];
  certifications?: string[];
  hourlyRate?: number;
  currency?: string;
  timezone?: string;
}

export interface UpdateCoachDTO {
  displayName?: string;
  bio?: string;
  specialties?: string[];
  certifications?: string[];
  hourlyRate?: number;
  currency?: string;
  timezone?: string;
  availability?: WeeklyAvailability;
  status?: 'active' | 'inactive';
}
