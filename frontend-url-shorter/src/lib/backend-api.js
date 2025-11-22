// const API_BASE_URL = 'http://localhost:3001/api';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const linkApi = {
  async getAll() {
    const response = await fetch(`${API_BASE_URL}/links`);
    if (!response.ok) {
      throw new Error('Failed to fetch links');
    }
    return response.json();
  },

  async getByCode(code) {
    const response = await fetch(`${API_BASE_URL}/links/${code}`);
    if (response.status === 404) {
      return null;
    }
    if (!response.ok) {
      throw new Error('Failed to fetch link');
    }
    return response.json();
  },

  async create(code, targetUrl) {
    const response = await fetch(`${API_BASE_URL}/links`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, targetUrl }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (errorData.error && errorData.error.includes('Code already exists')) {
        throw new Error('Code already exists');
      }
      throw new Error(errorData.error || 'Failed to create link');
    }

    return response.json();
  },

  async delete(code) {
    const response = await fetch(`${API_BASE_URL}/links/${code}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete link');
    }
  },

  async incrementClicks(code) {
    const response = await fetch(`${API_BASE_URL}/links/${code}/clicks`, {
      method: 'PUT',
    });

    if (!response.ok) {
      throw new Error('Failed to increment clicks');
    }
  },
};