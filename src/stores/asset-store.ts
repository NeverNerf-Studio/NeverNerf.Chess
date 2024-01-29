import { defineStore } from 'pinia';

interface IMXMetadata {
  token_address: string;
  token_id: string;
  id: string;
  user: string;
  status: string;
  uri: string | null;
  name: string;
  description: string | null;
  image_url: string;
  metadata: {
    name: string;
    type: number;
    class: string;
    series: string;
    assetId: string;
    element: string;
    faction: string;
    tagline: string;
    image_url: string;
    rarityStr: string;
    serialNumber: string;
    animation_url: string;
    specialEditionStr: string;
    animation_url_mime_type: string;
  };
  collection: {
    name: string;
    icon_url: string;
  };
  created_at: string;
  updated_at: string;
}

interface AssetState {
  [key: string]: string; // or any, if the types of asset properties vary
}

interface CollectionConfig {
  asset: Record<string, string>;
}

export const useAssetStore = defineStore('asset', {
  state: () => ({
    imx: null as IMXMetadata | null,
    standardValues: {} as AssetState,
    loading: false, // Add a loading state
  }),
  actions: {
    async loadMetadata(token_id: string) {
      if (!token_id) {
        console.error('TokenID not provided');
        return;
      }

      if (this.imx && this.imx.token_id === token_id) {
        console.log('Data already loaded for this token:', token_id);
        return; // Avoid reloading if data is already present
      }

      this.loading = true;
      try {
        //Load token metadata
        const response = await fetch(
          `/imx_metadata/${token_id}/${token_id}.json`
        );
        if (!response.ok) {
          throw new Error(`Network response was not ok for token: ${token_id}`);
        }
        this.imx = await response.json();
        console.log('Data loaded for token:', token_id);

        //Load asset configuration from collection metadata
        if (this.imx) {
          const collectionId = this.imx.token_address;
          const collectionConfigResponse = await fetch(
            `/imx_metadata/${collectionId}.json`
          );
          if (!collectionConfigResponse.ok) {
            throw new Error(
              `Network response was not ok for collection: ${collectionId}`
            );
          }
          const collectionConfig = await collectionConfigResponse.json();
          console.log('Data loaded for collection:', collectionId);

          this.standardValues = this.setAssetProperties(collectionConfig);
        }
      } catch (error) {
        console.error('Error loading metadata:', error);
        this.imx = null; // Only reset if this is intended on error
      } finally {
        this.loading = false;
      }
    },
    setAssetProperties(collectionConfig: CollectionConfig): AssetState {
      const newAssetState: AssetState = {};

      for (const [key, value] of Object.entries(collectionConfig.asset)) {
        const path = value.split('.');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let currentContext: any = this.imx; // Type assertion to any

        for (const p of path) {
          if (currentContext === null) {
            console.warn(
              `Current context is null at property ${p} in path ${value}`
            );
            break; // Skip to the next key-value pair in the collectionConfig.asset
          }

          if (currentContext[p] !== undefined) {
            currentContext = currentContext[p];
          } else {
            console.warn(`Property ${p} not found in path ${value}`);
            currentContext = null;
            break;
          }
        }

        if (currentContext !== null && currentContext !== undefined) {
          newAssetState[key] = currentContext;
        }
      }

      return newAssetState;
    },
  },
});
