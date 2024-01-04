import { config, passport } from '@imtbl/sdk';

export class ImmutableService {
  passportInstance;

  constructor() {
    this.passportInstance = new passport.Passport({
      baseConfig: {
        environment: process.env.PASSPORT_env,
        publishableKey: process.env.PASSPORT_publishableKey,
      },
      clientId: process.env.PASSPORT_clientId,
      redirectUri: `${window.location.protocol}//${window.location.host}/#/callback`,
      logoutRedirectUri: `${window.location.protocol}//${window.location.host}/#//logout`,
      audience: process.env.PASSPORT_audience,
      scope: process.env.PASSPORT_scope,
    });
  }

  async loginCallback() {
    await this.passportInstance.loginCallback();
  }

  async connectImx() {
    return await this.passportInstance.connectImx();
  }

  async logout() {
    await this.passportInstance.logout();
  }

  async getUserInfo() {
    return await this.passportInstance.getUserInfo();
  }

  async login(useCachedSession = false) {
    try {
      return await this.passportInstance.login({ useCachedSession });
    } catch (error) {
      console.log('Immutable Passport connection error:', error);
    }
  }
}

export const immutableService = new ImmutableService();
