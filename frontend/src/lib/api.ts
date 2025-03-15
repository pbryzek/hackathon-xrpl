import { Bond } from './bonds';

const API_BASE_URL = 'http://localhost:5001';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export async function fetchActiveBonds(): Promise<Bond[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/activeBonds`);
    const data: ApiResponse<{ active_bonds: Bond[] }> = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch active bonds');
    }
    
    return data.data?.active_bonds || [];
  } catch (error) {
    console.error('Error fetching active bonds:', error);
    throw error; // Re-throw to handle in the component
  }
}

export async function fetchPendingBonds(): Promise<Bond[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/pendingBonds`);
    const data: ApiResponse<{ pending_bonds: Bond[] }> = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch pending bonds');
    }
    
    return data.data?.pending_bonds || [];
  } catch (error) {
    console.error('Error fetching pending bonds:', error);
    return [];
  }
}

export async function issueBond(bondData: Omit<Bond, 'id'>): Promise<Bond | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/activeBonds`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bondData),
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to issue bond');
    }
    
    return data.bond || null;
  } catch (error) {
    console.error('Error issuing bond:', error);
    return null;
  }
} 