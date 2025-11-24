import { NextApiRequest, NextApiResponse } from 'next';

interface HealthResponse {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  version: string;
  services: {
    gemini: 'configured' | 'missing';
    googleDrive: 'configured' | 'missing';
  };
  environment: string;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<HealthResponse>
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      services: {
        gemini: 'missing',
        googleDrive: 'missing'
      },
      environment: process.env.NODE_ENV || 'unknown'
    });
  }

  // Check service configurations
  const geminiConfigured = !!process.env.GEMINI_API_KEY;
  const googleDriveConfigured = !!(
    process.env.GOOGLE_DRIVE_FOLDER_ID && 
    process.env.GOOGLE_SERVICE_ACCOUNT_KEY
  );

  const allServicesConfigured = geminiConfigured && googleDriveConfigured;

  const response: HealthResponse = {
    status: allServicesConfigured ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    services: {
      gemini: geminiConfigured ? 'configured' : 'missing',
      googleDrive: googleDriveConfigured ? 'configured' : 'missing'
    },
    environment: process.env.NODE_ENV || 'development'
  };

  const statusCode = allServicesConfigured ? 200 : 503;
  return res.status(statusCode).json(response);
}