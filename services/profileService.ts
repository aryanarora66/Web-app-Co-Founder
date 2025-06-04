import { Profile, UpdateProfileData, ApiResponse } from '../types/profile';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

class ProfileService {
  private getToken(): string {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken') || '';
    }
    return '';
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  async getProfile(userId: string): Promise<Profile> {
    const response = await fetch(`${API_BASE_URL}/profiles/${userId}`, {
      headers: {
        'Authorization': `Bearer ${this.getToken()}`,
        'Content-Type': 'application/json',
      },
    });
    
    const result: ApiResponse<Profile> = await this.handleResponse(response);
    if (!result.success || !result.data) {
      throw new Error(result.error || 'Failed to fetch profile');
    }
    
    return result.data;
  }

  async updateProfile(userId: string, data: UpdateProfileData): Promise<Profile> {
    const response = await fetch(`${API_BASE_URL}/profiles/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getToken()}`,
      },
      body: JSON.stringify(data),
    });
    
    const result: ApiResponse<Profile> = await this.handleResponse(response);
    if (!result.success || !result.data) {
      throw new Error(result.error || 'Failed to update profile');
    }
    
    return result.data;
  }

  async uploadProfileImage(userId: string, file: File): Promise<string> {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await fetch(`${API_BASE_URL}/profiles/${userId}/image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.getToken()}`,
      },
      body: formData,
    });
    
    const result: ApiResponse<{ imageUrl: string }> = await this.handleResponse(response);
    if (!result.success || !result.data) {
      throw new Error(result.error || 'Failed to upload image');
    }
    
    return result.data.imageUrl;
  }

  async deleteProfile(userId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/profiles/${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${this.getToken()}`,
      },
    });
    
    const result: ApiResponse<null> = await this.handleResponse(response);
    if (!result.success) {
      throw new Error(result.error || 'Failed to delete profile');
    }
  }
}

export const profileService = new ProfileService();