import { md5 } from 'md5js';
import { defineStore } from 'pinia';

interface Metadata {
  token_id: string;
  name: string;
  description: string | null;
  image_url: string;
  animation_url: string;
  opening: string;
  placeholderName: string;
  fen: string;
  pgn: string;
  rarity: string;
  moves: number;
}

interface TokenMap {
  [fenString: string]: string; // Map FEN string to token_id
}

export const useAssetStore = defineStore('asset', {
  state: () => ({
    metadata: null as Metadata | null,
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
        const collectionConfigResponse = await fetch(`/${collection_id}.json`);
        if (!collectionConfigResponse.ok) {
          throw new Error(
            `Network response was not ok for collection: ${collection_id}`
          );
        }
        const collectionConfig = await collectionConfigResponse.json();
        this.tokenMap = collectionConfig.tokenMap || {};
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

      const current_token_id = this.metadata?.token_id;
      if (this.metadata && current_token_id === token_id) {
        this.loading = false;
        return; // Avoid reloading if data is already present
      }
      try {
        //Load token metadata
        const response = await fetch(`/api/${token_id}`);
        if (!response.ok) {
          throw new Error(`Network response was not ok for token: ${token_id}`);
        }
        this.metadata = await response.json();
      } catch (error) {
        console.error('Error loading metadata:', error);
        this.metadata = null; // Only reset if this is intended on error
      }
      this.loading = false;
    },
    getTokenIdByFen(fenString: string): string | undefined {
      const fenStringHash = md5(fenString, 32).substring(0, 8);
      return this.tokenMap[fenStringHash];
    },
  },
});
