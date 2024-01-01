import { defineStore } from 'pinia';
import { immutableService } from 'src/immutable';
import { provider } from '@imtbl/sdk';

export const usePassportStore = defineStore('passport', {
  state: () => ({
    provider: null as provider.IMXProvider | null,
    buttonState: 'Connect Passport',
    userProfile: null,
  }),
  actions: {
    async login() {
      let userProfile = await immutableService.login(true); // Try using cached session
      if (!userProfile) {
        userProfile = await immutableService.login(); // Perform a full login
      }
      if (userProfile) {
        this.provider = await immutableService.connectImx();
        this.buttonState = 'Connected';
      } else {
        this.buttonState = 'Connect Passport';
      }
    },
    async logout() {
      await immutableService.logout();
      this.provider = null;
      this.buttonState = 'Connect Passport';
    },
    async handleLoginCallback() {
      await immutableService.loginCallback();
    },
    async getUserInfo() {
      try {
        const userInfo = await immutableService.getUserInfo();
        return userInfo;
      } catch (error) {
        console.error('Error fetching user info:', error);
        return null;
      }
    },
  },
});
