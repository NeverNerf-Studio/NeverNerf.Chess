import { defineStore } from 'pinia';
import { ImmutableService } from 'src/services/immutable';
import { provider } from '@imtbl/sdk';

type UserProfile = {
  email?: string;
  nickname?: string;
  sub: string;
};

export const usePassportStore = defineStore('passport', {
  state: () => ({
    imxService: new ImmutableService(),
    provider: null as provider.IMXProvider | null,
    isAuthenticated: false,
    buttonState: 'Connect Passport',
    userProfile: null as UserProfile | undefined | null,
  }),
  actions: {
    async login() {
      try {
        let userProfile = await this.imxService.login(true); // Try using cached session
        if (!userProfile) {
          userProfile = await this.imxService.login(); // Perform a full login
        }
        if (userProfile) {
          const imxProvider = await this.imxService.connectImx();
          if (imxProvider) {
            this.provider = imxProvider;
          }
          this.isAuthenticated = true;
        } else {
          this.provider = null;
          this.userProfile = null;
          this.isAuthenticated = false;
        }
      } catch (error) {
        console.error('Error Logging into Passport:', error);
        return null;
      }
    },
    async logout() {
      await this.imxService.logout();
      this.provider = null;
      this.userProfile = null;
      this.isAuthenticated = false;
    },
    async handleLoginCallback() {
      await this.imxService.loginCallback();
    },
    async getAddress() {
      if (this.isAuthenticated) this.imxService.getAccounts();
    },
    async getUserInfo() {
      try {
        if (!this.userProfile) {
          this.userProfile = await this.imxService.getUserInfo();
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
