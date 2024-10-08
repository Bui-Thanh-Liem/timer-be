import { google } from 'googleapis';

export class GgDriveService {
  static driver() {
    const oauth2Client = new google.auth.OAuth2({
      clientId: process.env.GG_CLIENT_ID,
      clientSecret: process.env.GG_CLIENT_SECRET,
      redirectUri: process.env.GG_REDIRECT_URI,
    });

    oauth2Client.setCredentials({
      refresh_token: process.env.GG_REFRESH_TOKEN,
    });

    const ggDrive = google.drive({
      version: 'v3',
      auth: oauth2Client,
    });
    return ggDrive;
  }
}