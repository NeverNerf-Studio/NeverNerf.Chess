import { config, passport } from '@imtbl/sdk';

export class ImmutableService {
  passportInstance;

  constructor() {
    try {
      this.passportInstance = new passport.Passport({
        baseConfig: {
          environment: process.env.PASSPORT_env as config.Environment,
          publishableKey: process.env.PASSPORT_publishableKey,
        },
        clientId: process.env.PASSPORT_clientId as string,
        redirectUri: `${window.location.protocol}//${window.location.host}/#/callback`,
        logoutRedirectUri: `${window.location.protocol}//${window.location.host}/#/logout`,
        audience: process.env.PASSPORT_audience,
        scope: process.env.PASSPORT_scope,
      });
    } catch {
      console.log('Immutable Passport connection error');
    }
  }

  async loginCallback() {
    await this.passportInstance?.loginCallback();
  }

  async connectImx() {
    return await this.passportInstance?.connectImx();
  }

  async logout() {
    await this.passportInstance?.logout();
  }

  async getUserInfo() {
    return await this.passportInstance?.getUserInfo();
  }

  async getAddress(): Promise<string> {
    const imxProvider = await this.passportInstance?.connectImx();
    if (!imxProvider) return '';

    let imxAddress = '';
    try {
      imxAddress = await imxProvider.getAddress();
    } catch (error) {
      await imxProvider.registerOffchain();
      imxAddress = await imxProvider.getAddress();
    }

    return imxAddress;
  }

  async login(useCachedSession = false) {
    try {
      return await this.passportInstance?.login({ useCachedSession });
    } catch (error) {
      console.log('Immutable Passport connection error:', error);
    }
  }
}
