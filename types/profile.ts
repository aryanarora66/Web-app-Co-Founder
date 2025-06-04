// Update the Profile interface to extend your existing User
export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  role: string;
  instagramUrl?: string;
  imageUrl?: string;
}

export interface Profile extends User {
  profileImage: any;
  bio: string;
  website?: string;
  skills: Skill[];
  socialLinks: SocialLink[];
  projects: Project[];
  createdAt: string;
  updatedAt: string;
}

export interface Skill {
  id: string;
  skill: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  url: string;
  technologies: string[];
}

export interface UpdateProfileData {
  name?: string;
  role?: string;
  bio?: string;
  username?: string;
  website?: string;
  instagramUrl?: string;
  skills?: Omit<Skill, 'id'>[];
  socialLinks?: Omit<SocialLink, 'id'>[];
  projects?: Omit<Project, 'id'>[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}