import { defineStore } from 'pinia';
import { immutableService } from 'src/immutable';
import { provider } from '@imtbl/sdk';

type UserProfile = {
  email?: string;
  nickname?: string;
  sub: string;
};

export const usePassportStore = defineStore('passport', {
  state: () => ({
    provider: null as provider.IMXProvider | null,
    buttonState: 'Connect Passport',
    userProfile: null as UserProfile | undefined | null,
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
      this.userProfile = null;
      this.buttonState = 'Connect Passport';
    },
    async handleLoginCallback() {
      await immutableService.loginCallback();
    },
    async getUserInfo() {
      try {
        if (!this.userProfile) {
          this.userProfile = await immutableService.getUserInfo();
          return this.userProfile;
        } else {
          return this.userProfile;
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
        return null;
      }
    },
  },
});
