export interface AuthSession {
  token: string;
  userId: string;
  email: string;
  name: string;
  role: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  phone?: string;
  password: string;
  role?: 'student' | 'teacher' | 'admin';
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  password: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message?: string;
  resetToken?: string | null;
  emailSent?: boolean;
}

export interface EnrollmentPayload {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  course: 'foundation_7_10' | 'advanced_11_12';
  paymentMethod: 'online' | 'cash';
  photo: File;
}

export interface EnrollmentResponse {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  course: 'foundation_7_10' | 'advanced_11_12';
  paymentMethod: 'online' | 'cash';
  photoUrl: string | null;
  message: string;
}

export interface ProfileResponse {
  userId: string;
  name: string;
  email: string;
  phone: string | null;
  photoUrl: string | null;
  isAdmitted: boolean;
}

export interface ProfileUpdatePayload {
  name: string;
  phone: string;
  photo?: File | null;
}

export interface ProfileUpdateResponse {
  userId: string;
  name: string;
  email: string;
  phone: string | null;
  photoUrl: string | null;
  message: string;
}

export interface AdmissionStatusResponse {
  email: string;
  status: 'admitted' | 'under_review' | 'rejected' | 'not_enrolled';
  statusLabel: string;
}

const AUTH_STORAGE_KEY = 'varsity-maths-auth';
const API_BASE_URL: string =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '') ??
  '';

interface ApiErrorResponse {
  detail?: string | { message?: string };
  message?: string;
}

async function apiRequest<T>(path: string, init: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
  });

  const text = await response.text();
  const data = text ? (JSON.parse(text) as ApiErrorResponse & T) : null;

  if (!response.ok) {
    const message =
      (typeof data?.detail === 'string' ? data.detail : data?.detail?.message) ||
      data?.message ||
      'Request failed. Please try again.';

    throw new Error(message);
  }

  return data as T;
}

export async function registerUser(payload: RegisterPayload): Promise<void> {
  await apiRequest('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ ...payload, role: payload.role ?? 'student' }),
  });
}

export async function loginUser(payload: LoginPayload): Promise<AuthSession> {
  return apiRequest<AuthSession>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function requestPasswordReset(payload: ForgotPasswordPayload): Promise<ForgotPasswordResponse> {
  return apiRequest('/api/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function resetPassword(payload: ResetPasswordPayload): Promise<{ success: boolean; message?: string }> {
  return apiRequest('/api/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function submitEnrollment(payload: EnrollmentPayload): Promise<EnrollmentResponse> {
  const formData = new FormData();
  formData.append('firstName', payload.firstName);
  formData.append('lastName', payload.lastName);
  formData.append('phone', payload.phone);
  formData.append('email', payload.email);
  formData.append('course', payload.course);
  formData.append('paymentMethod', payload.paymentMethod);
  formData.append('photo', payload.photo);

  const response = await fetch(`${API_BASE_URL}/api/enrollments`, {
    method: 'POST',
    body: formData,
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const message =
      (typeof data?.detail === 'string' ? data.detail : data?.detail?.message) ||
      data?.message ||
      'Request failed. Please try again.';
    throw new Error(message);
  }

  return data as EnrollmentResponse;
}

export async function getProfile(token: string): Promise<ProfileResponse> {
  return apiRequest<ProfileResponse>('/api/auth/profile', {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function updateProfile(token: string, payload: ProfileUpdatePayload): Promise<ProfileUpdateResponse> {
  const formData = new FormData();
  formData.append('name', payload.name);
  formData.append('phone', payload.phone);
  if (payload.photo) {
    formData.append('photo', payload.photo);
  }

  const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const message =
      (typeof data?.detail === 'string' ? data.detail : data?.detail?.message) ||
      data?.message ||
      'Request failed. Please try again.';
    throw new Error(message);
  }

  return data as ProfileUpdateResponse;
}

export async function getAdmissionStatus(token: string): Promise<AdmissionStatusResponse> {
  return apiRequest<AdmissionStatusResponse>('/api/auth/admission-status', {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function persistSession(session: AuthSession): void {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
}

export function loadSession(): AuthSession | null {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

export function clearSession(): void {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}