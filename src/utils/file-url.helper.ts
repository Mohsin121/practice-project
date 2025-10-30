/**
 * Helper function to construct full URLs for uploaded files
 * Works in both development and production environments
 */
export function getFileUrl(filePath: string | null): string | null {
  if (!filePath) return null;
  
  // Get base URL from environment variable
  const baseUrl = process.env.APP_URL || 'http://localhost:8000';
  
  // Normalize path (remove leading slash if present)
  const normalizedPath = filePath.replace(/\\/g, '/').replace(/^\//, '');
  
  // Return full URL
  return `${baseUrl}/${normalizedPath}`;
}


