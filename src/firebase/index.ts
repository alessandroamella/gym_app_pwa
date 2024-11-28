import { FirebaseApp, initializeApp } from 'firebase/app';
import { getMessaging, getToken, Messaging } from 'firebase/messaging';
import config from '../config';

class FirebaseService {
  private app: FirebaseApp;
  // private analytics: Analytics;
  private messaging: Messaging;

  constructor() {
    this.app = initializeApp(config.firebase.config);
    // this.analytics = getAnalytics(this.app);
    this.messaging = getMessaging(this.app);
  }

  async getDeviceToken(): Promise<string> {
    return getToken(this.messaging, {
      vapidKey: config.firebase.vapidKey,
    });
  }
}

const firebase = new FirebaseService();
export default firebase;
