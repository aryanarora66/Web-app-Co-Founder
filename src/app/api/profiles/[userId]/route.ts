import { NextRequest, NextResponse } from 'next/server';
import { Profile, UpdateProfileData, ApiResponse } from '../../../../../types/profile';

// This is a mock implementation - replace with your actual database logic
const mockProfile: Profile = {
    id: 'current-user-id', // This should match your actual user ID from auth
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Technical Founder',
    bio: 'Full-stack developer passionate about building scalable startups. Currently working on an AI-powered analytics platform.',
    website: 'https://johndoe.com',
    skills: [
        { id: '1', skill: 'React', level: 'Expert' },
        { id: '2', skill: 'Node.js', level: 'Advanced' },
        { id: '3', skill: 'AWS', level: 'Intermediate' },
    ],
    socialLinks: [
        { id: '1', platform: 'GitHub', url: 'https://github.com/johndoe' },
        { id: '2', platform: 'LinkedIn', url: 'https://linkedin.com/in/johndoe' },
        { id: '3', platform: 'Twitter', url: 'https://twitter.com/johndoe' },
    ],
    projects: [
        {
            id: '1',
            title: 'AI Analytics Platform',
            description: 'Next-gen analytics solution powered by machine learning',
            url: 'https://aianalytics.com',
            technologies: ['React', 'Python', 'TensorFlow']
        },
        {
            id: '2',
            title: 'DevTools Suite',
            description: 'Open source developer productivity toolkit',
            url: 'https://devtools.com',
            technologies: ['TypeScript', 'Node.js', 'Docker']
        }
    ],
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    username: '',
    profileImage: undefined
};

// GET /api/profiles/[userId]
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> }
): Promise<NextResponse<ApiResponse<Profile>>> {
  try {
    // Await the params object (required in newer Next.js versions)
    const { userId } = await context.params;
    
    console.log('Fetching profile for userId:', userId); // Debug log
    
    // TODO: Replace with actual database query
    // const profile = await db.profile.findUnique({ where: { id: userId } });
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    // For now, return mock profile for any valid user ID
    // In production, you should query your database here
    const profile = { ...mockProfile, id: userId };

    return NextResponse.json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error('GET /api/profiles/[userId] error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/profiles/[userId]
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> }
): Promise<NextResponse<ApiResponse<Profile>>> {
  try {
    // Await the params object
    const { userId } = await context.params;
    const updateData: UpdateProfileData = await request.json();
    
    console.log('Updating profile for userId:', userId); // Debug log
    
    // TODO: Replace with actual database update
    // const updatedProfile = await db.profile.update({
    //   where: { id: userId },
    //   data: updateData
    // });

    const updatedProfile: Profile = {
      ...mockProfile,
      id: userId, // Use the actual user ID
      ...updateData,
      skills: updateData.skills?.map((skill, index) => ({
        id: (index + 1).toString(),
        ...skill
      })) || mockProfile.skills,
      socialLinks: updateData.socialLinks?.map((link, index) => ({
        id: (index + 1).toString(),
        ...link
      })) || mockProfile.socialLinks,
      projects: updateData.projects?.map((project, index) => ({
        id: (index + 1).toString(),
        ...project
      })) || mockProfile.projects,
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: updatedProfile,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('PUT /api/profiles/[userId] error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}

// DELETE /api/profiles/[userId]
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> }
): Promise<NextResponse<ApiResponse<null>>> {
  try {
    // Await the params object
    const { userId } = await context.params;
    
    console.log('Deleting profile for userId:', userId); // Debug log
    
    // TODO: Replace with actual database deletion
    // await db.profile.delete({ where: { id: userId } });

    return NextResponse.json({
      success: true,
      message: 'Profile deleted successfully'
    });
  } catch (error) {
    console.error('DELETE /api/profiles/[userId] error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete profile' },
      { status: 500 }
    );
  }
}