import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1/events';
axios.defaults.withCredentials = true;

export interface EventCreateData {
  title: string;
  description?: string;
  categoryId: number;
  address?: string;
  city?: string;
  district?: string;
  ward?: string;
  startAt: string;
  endAt: string;
}

export interface EventUpdateData {
  title?: string;
  description?: string;
  categoryId?: number;
  address?: string;
  city?: string;
  district?: string;
  ward?: string;
  startAt?: string;
  endAt?: string;
}

export interface EventDetail {
  eventId: number;
  title: string;
  description: string;
  categoryName: string;
  address: string;
  city: string;
  district: string;
  ward: string;
  startAt: string;
  endAt: string;
  status: string;
  createdBy: string;
  registeredCount: number;
  isRegistered: boolean;
  isApproved: boolean;
}

export interface EventRegistration {
  registrationId: number;
  eventName: string;
  userId: number;
  fullName: string;
  email: string;
  status: string;
  registrationDate: string;
  cancelAt: string | null;
}

// Get all events with optional filters
export const getEvents = async (params?: {
  category?: string;
  city?: string;
  district?: string;
  ward?: string;
  status?: string;
  page?: number;
  size?: number;
  sort?: string;
}) => {
  const res = await axios.get(API_URL, { params, withCredentials: true });
  return res.data;
};

// Get event detail by ID
export const getEventById = async (eventId: number): Promise<EventDetail> => {
  const res = await axios.get(`${API_URL}/${eventId}`, { withCredentials: true });
  return res.data;
};

// Create a new event (Manager only)
export const createEvent = async (data: EventCreateData) => {
  const res = await axios.post(API_URL, data, { withCredentials: true });
  return res.data;
};

// Update an event (Manager only)
export const updateEvent = async (eventId: number, data: EventUpdateData) => {
  const res = await axios.put(`${API_URL}/${eventId}`, data, { withCredentials: true });
  return res.data;
};

// Delete an event (Manager only)
export const deleteEvent = async (eventId: number) => {
  const res = await axios.delete(`${API_URL}/${eventId}`, { withCredentials: true });
  return res.data;
};

// Close event - Mark as COMPLETED or CANCELLED (Manager only)
export const closeEvent = async (eventId: number, action: 'COMPLETE' | 'CANCEL') => {
  const res = await axios.patch(`${API_URL}/${eventId}/close`, { action }, { withCredentials: true });
  return res.data;
};

// Register for an event (Volunteer)
export const registerForEvent = async (eventId: number) => {
  const res = await axios.post(`${API_URL}/${eventId}/register`, {}, { withCredentials: true });
  return res.data;
};

// Cancel registration (Volunteer)
export const cancelRegistration = async (eventId: number) => {
  const res = await axios.delete(`${API_URL}/${eventId}/register`, { withCredentials: true });
  return res.data;
};

// Get my registrations (Volunteer)
export const getMyRegistrations = async (): Promise<EventDetail[]> => {
  const res = await axios.get(`${API_URL}/my-registrations`, { withCredentials: true });
  return res.data;
};

// Get registrations for an event (Manager only)
export const getEventRegistrations = async (eventId: number): Promise<EventRegistration[]> => {
  const res = await axios.get(`${API_URL}/${eventId}/registrations`, { withCredentials: true });
  return res.data;
};

// Approve or reject a registration (Manager only)
export const approveOrRejectRegistration = async (
  registrationId: number,
  action: 'APPROVE' | 'REJECT' | 'COMPLETE'
) => {
  const res = await axios.patch(
    `${API_URL}/registrations/${registrationId}`,
    { action },
    { withCredentials: true }
  );
  return res.data;
};
