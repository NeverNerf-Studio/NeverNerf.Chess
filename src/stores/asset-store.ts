import { md5 } from 'md5js';
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
    fen: string;
    pgn: string;
    rarity: string;
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
  created_at: string;
  updated_at: string;
}

interface AssetState {
  [fenstring: string]: string; // or any, if the types of asset properties vary
}

interface TokenMap {
  [fenString: string]: string; // Map FEN string to token_id
}

interface CollectionConfig {
  assetConfig: Record<string, string>;
  tokenMap: TokenMap;
}

export const useAssetStore = defineStore('asset', {
  state: () => ({
    imx: null as IMXMetadata | null,
    standardValues: {} as AssetState,
    tokenMap: {} as TokenMap,
    loading: true, // Add a loading state
    collection_id: '' as string,
    collection_name: '' as string,
    collection_icon_url: '' as string,
  }),
  actions: {
    async loadCollection(collection_id: string) {
      this.loading = true;
      if (collection_id === this.collection_id) return; // Don't load collection data if already loaded
      if (collection_id === '0') return; // Don't load collection data for 0

      try {
        const collectionConfigResponse = await fetch(
          `/imx_metadata/${collection_id}.json`
        );
        if (!collectionConfigResponse.ok) {
          throw new Error(
            `Network response was not ok for collection: ${collection_id}`
          );
        }
        const collectionConfig = await collectionConfigResponse.json();
        this.tokenMap = collectionConfig.tokenMap || {};
        this.standardValues = this.setAssetProperties(collectionConfig);
        this.collection_id = collectionConfig.collection.id;
        this.collection_name = collectionConfig.collection.name;
        this.collection_icon_url = collectionConfig.collection.icon_url;

        console.log('Data loaded for collection:', collection_id);
      } catch (error) {
        console.error('Error loading collection:', error);
      }
      this.loading = false;
    },
    async loadMetadata(token_id: string) {
      this.loading = true;
      if (token_id === '0') {
        this.loading = false;
        return; // Don't load metadata for the 0 token
      }

      if (!token_id) {
        this.loading = false;
        console.error('TokenID not provided');
        return;
      }

      const current_token_id = this.imx?.token_id;
      if (this.imx && current_token_id === token_id) {
        this.loading = false;
        return; // Avoid reloading if data is already present
      }
      try {
        //Load token metadata
        const response = await fetch(
          `/imx_metadata/${token_id}/${token_id}.json`
        );
        if (!response.ok) {
          throw new Error(`Network response was not ok for token: ${token_id}`);
        }
        this.imx = await response.json();
      } catch (error) {
        console.error('Error loading metadata:', error);
        this.imx = null; // Only reset if this is intended on error
      }
      this.loading = false;
    },
    setAssetProperties(collectionConfig: CollectionConfig): AssetState {
      const newAssetState: AssetState = {};

      for (const [key, value] of Object.entries(collectionConfig.assetConfig)) {
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
    getTokenIdByFen(fenString: string): string | undefined {
      const fenStringHash = md5(fenString, 32).substring(0, 8);
      return this.tokenMap[fenStringHash];
    },
  },
});
