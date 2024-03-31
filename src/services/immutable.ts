import { config, x, passport } from '@imtbl/sdk';

export class ImmutableService {
  passportInstance;
  imxClientInstance;

  constructor() {
    const { IMXClient, imxClientConfig } = x;

    try {
      const environment = process.env.PASSPORT_env as config.Environment;
      this.passportInstance = new passport.Passport({
        baseConfig: {
          environment: environment,
          publishableKey: process.env.PASSPORT_publishableKey,
        },
        clientId: process.env.PASSPORT_clientId as string,
        redirectUri: `${window.location.protocol}//${window.location.host}/#/callback`,
        logoutRedirectUri: `${window.location.protocol}//${window.location.host}/#/logout`,
        audience: process.env.PASSPORT_audience,
        scope: process.env.PASSPORT_scope,
      });
      this.imxClientInstance = new IMXClient(imxClientConfig({ environment }));
    } catch {
      console.log('Immutable Passport connection error');
    }
  }

  async loginCallback() {
    await this.passportInstance?.loginCallback();
  }

  // async connectImx() {
  //   return await this.passportInstance?.connectImx();
  // }

  async logout() {
    await this.passportInstance?.logout();
  }

  async getUserInfo() {
    return await this.passportInstance?.getUserInfo();
  }

  async isOwner(): Promise<boolean> {
    const collectionAddress = process.env.NEVERNERF_COLLECTION_ADDRESS;
    const response = await this.imxClientInstance?.listAssets({
      collection: collectionAddress,
      user: await this.getAddress(),
      orderBy: 'name',
    });

    if (!response?.result) return false;

    return response?.result.length > 0 ? true : false;
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
