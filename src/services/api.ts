// src/services/api.ts
const API_BASE_URL = 'http://localhost:3001/api'; // Adjust port if different

export interface Solve {
  id: string;
  time: number;
  scramble: string;
  timestamp: number;
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
    options?: RequestInit,
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });
    console.log();
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    // If response is 204 No Content, return undefined
    if (response.status === 204) {
      return undefined as unknown as T;
    }

    return response.json();
  }

  // Solve endpoints
  async getSolves(): Promise<Solve[]> {
    return this.request<Solve[]>('/solves');
  }

  async createSolve(solve: Omit<Solve, 'id'>): Promise<Solve> {
    return this.request<Solve>('/solves', {
      method: 'POST',
      body: JSON.stringify(solve),
    });
  }

  async updateSolve(id: string, solve: Partial<Solve>): Promise<Solve> {
    return this.request<Solve>(`/solves/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(solve),
    });
  }

  async deleteSolve(id: string): Promise<void> {
    return this.request<void>(`/solves/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
