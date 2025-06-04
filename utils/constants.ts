export const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'] as const;

export const SOCIAL_PLATFORMS = [
  'GitHub',
  'LinkedIn',
  'Twitter',
  'Instagram',
  'Facebook',
  'YouTube',
  'Medium',
  'Dev.to'
] as const;

export const API_ENDPOINTS = {
  PROFILES: '/api/profiles',
  UPLOAD_IMAGE: '/api/profiles/:userId/image'
} as const;

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];