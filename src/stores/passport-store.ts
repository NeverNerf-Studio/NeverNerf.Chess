import { defineStore } from 'pinia';
import { ImmutableService } from 'src/services/immutable';

type UserProfile = {
  email?: string;
  nickname?: string;
  sub: string;
};

export const usePassportStore = defineStore('passport', {
  state: () => ({
    imxService: new ImmutableService(),
    isAuthenticated: false,
    isOwner: false,
    ethAddress: '' as string,
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
          this.isAuthenticated = true;
          this.ethAddress = await this.getAddress();
          this.isOwner = await this.imxService.isOwner();
        } else {
          this.userProfile = null;
          this.isAuthenticated = false;
          this.isOwner = false;
          this.ethAddress = '';
        }
      } catch (error) {
        console.error('Error Logging into Passport:', error);
        return null;
      }
    },
    async logout() {
      await this.imxService.logout();
      this.userProfile = null;
      this.isAuthenticated = false;
    },
    async handleLoginCallback() {
      await this.imxService.loginCallback();
    },
    async getAddress(): Promise<string> {
      if (this.isAuthenticated) return this.imxService.getAddress();
      return '';
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
    async getJWT(): Promise<string> {
      if (!this.isAuthenticated) return '';

      const jwtResponse =
        await this.imxService.passportInstance?.getAccessToken();
      if (jwtResponse === undefined) return '';

      return jwtResponse;
    },
  },
});
