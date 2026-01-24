import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'video.onwalk.app',
  appName: 'Onwalk',
  webDir: 'public',
  server: {
    url: 'https://www.onwalk.net',
    cleartext: true
  }
};

export default config;
