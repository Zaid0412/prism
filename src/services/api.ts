const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api';

export interface Solve {
  id: string;
  time: number;
  scramble: string;
  createdAt: number;
  state: 'none' | '+2' | 'DNF';
  puzzleType: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    token: string,
    options?: RequestInit,
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options?.headers,
      },
      ...options,
    });
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    // If response is 204 No Content, return undefined
    if (response.status === 204) {
      return undefined as unknown as T;
    }
    return response.json();
  }

  // Solve endpoints
  async getSolves(token: string): Promise<Solve[]> {
    return this.request<Solve[]>('/solves', token);
  }

  async createSolve(solve: Omit<Solve, 'id'>, token: string): Promise<Solve> {
    return this.request<Solve>('/solves', token, {
      method: 'POST',
      body: JSON.stringify(solve),
    });
  }

  async updateSolve(id: string, solve: Partial<Solve>, token: string): Promise<Solve> {
    return this.request<Solve>(`/solves/${id}`, token, {
      method: 'PATCH',
      body: JSON.stringify(solve),
    });
  }

  async deleteSolve(id: string, token: string): Promise<void> {
    return this.request<void>(`/solves/${id}`, token, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
