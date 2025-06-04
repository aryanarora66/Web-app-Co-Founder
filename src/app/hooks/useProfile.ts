'use client';
import { useState, useEffect } from 'react';
import { Profile, UpdateProfileData } from '../../../types/profile';
import { profileService } from '../../../services/profileService';

export function useProfile(userId: string) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const profileData = await profileService.getProfile(userId);
      setProfile(profileData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: UpdateProfileData) => {
    try {
      const updatedProfile = await profileService.updateProfile(userId, data);
      setProfile(updatedProfile);
      return updatedProfile;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const uploadImage = async (file: File) => {
    try {
      const imageUrl = await profileService.uploadProfileImage(userId, file);
      setProfile(prev => prev ? { ...prev, imageUrl: imageUrl } : null);
      return imageUrl;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload image';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deleteProfile = async () => {
    try {
      await profileService.deleteProfile(userId);
      setProfile(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete profile';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  return {
    profile,
    loading,
    error,
    refetch: fetchProfile,
    updateProfile,
    uploadImage,
    deleteProfile,
    setError
  };
}