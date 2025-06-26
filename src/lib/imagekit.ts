// lib/imagekit.ts
import ImageKit from "imagekit";

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || '',
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || '',
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || '',
});

// Server-side file conversion (for API routes)
export async function uploadToImageKit(file: File): Promise<string> {
  try {
    // Convert File to Buffer (server-side compatible)
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Generate unique filename with timestamp
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const fileName = `profile-${timestamp}.${fileExtension}`;
    
    const response = await imagekit.upload({
      file: buffer, // Use buffer directly instead of base64
      fileName,
      folder: "/profile-images",
      useUniqueFileName: false,
    });

    if (!response.url) {
      throw new Error('Upload failed - no URL returned');
    }

    return response.url;
  } catch (error) {
    console.error('ImageKit upload error:', error);
    throw new Error('Failed to upload image');
  }
}

// Client-side file conversion (for browser environments)
export async function uploadToImageKitFromBrowser(file: File): Promise<string> {
  async function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  }

  const base64File = await fileToBase64(file);
  
  try {
    // Generate unique filename with timestamp
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const fileName = `profile-${timestamp}.${fileExtension}`;
    
    const response = await imagekit.upload({
      file: base64File.split(',')[1], // Extract base64 content after the comma
      fileName,
      folder: "/profile-images",
      useUniqueFileName: false,
    });

    if (!response.url) {
      throw new Error('Upload failed - no URL returned');
    }

    return response.url;
  } catch (error) {
    console.error('ImageKit upload error:', error);
    throw new Error('Failed to upload image');
  }
}

// Delete image from ImageKit
export async function deleteFromImageKit(fileId: string): Promise<void> {
  try {
    await imagekit.deleteFile(fileId);
  } catch (error) {
    console.error('ImageKit delete error:', error);
    throw new Error('Failed to delete image');
  }
}

// For client-side usage (without exposing private key)
export function getImageKitClient() {
  return new ImageKit({
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || '',
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || '',
    privateKey: '', // Empty for client-side
  });
}

// Helper function to extract file ID from ImageKit URL for deletion
export function extractFileIdFromUrl(url: string): string {
  try {
    // ImageKit URLs typically follow this pattern:
    // https://ik.imagekit.io/your_imagekit_id/path/filename.ext
    const urlParts = url.split('/');
    const filename = urlParts[urlParts.length - 1];
    
    // Remove query parameters if any
    const cleanFilename = filename.split('?')[0];
    
    // Return filename without extension as file ID
    return cleanFilename.split('.')[0];
  } catch (error) {
    console.error('Error extracting file ID from URL:', error);
    return '';
  }
}