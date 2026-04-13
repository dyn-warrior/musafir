import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.musafir.app',
  appName: 'Musafir',
  webDir: 'out',
  server: {
    url: 'https://nomadicircle-8024a.web.app',
    cleartext: true
  }
};

export default config;
