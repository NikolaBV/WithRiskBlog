import axios, { type AxiosResponse } from 'axios';

// API base URL - points to your .NET backend
axios.defaults.baseURL = import.meta.env.PUBLIC_API_URL || 'http://localhost:5089/api';

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

// Request interceptor for auth token
axios.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Generic request methods
const requests = {
  get: <T>(url: string) => axios.get<T>(url).then(responseBody),
  post: <T>(url: string, body: object) => axios.post<T>(url, body).then(responseBody),
  put: <T>(url: string, body: object) => axios.put<T>(url, body).then(responseBody),
  delete: <T>(url: string) => axios.delete<T>(url).then(responseBody),
};

// Types
export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  userName: string;
  userImage?: string;
}

export interface CreateCommentDto {
  postSlug: string;
  content: string;
  authorName?: string;
}

export interface PostStats {
  postSlug: string;
  likes: number;
  views: number;
  isLikedByUser: boolean;
}

// API Endpoints
const Comments = {
  list: (postSlug: string) => requests.get<Comment[]>(`/comments/${postSlug}`),
  create: (dto: CreateCommentDto) => requests.post<Comment>('/comments', dto),
  delete: (id: string) => requests.delete<void>(`/comments/${id}`),
};

const Posts = {
  getStats: (postSlug: string) => requests.get<PostStats>(`/posts/${postSlug}/stats`),
  like: (postSlug: string) => requests.post<void>(`/posts/${postSlug}/like`, {}),
  unlike: (postSlug: string) => requests.delete<void>(`/posts/${postSlug}/like`),
  recordView: (postSlug: string) => requests.post<void>(`/posts/${postSlug}/view`, {}),
};

const Auth = {
  login: (email: string, password: string) =>
    requests.post<{ token: string; user: any }>('/auth/login', { email, password }),
  register: (email: string, password: string, username: string) =>
    requests.post<{ token: string; user: any }>('/auth/register', { email, password, username }),
  getCurrentUser: () => requests.get<any>('/auth/me'),
};

const agent = {
  Comments,
  Posts,
  Auth,
};

export default agent;

