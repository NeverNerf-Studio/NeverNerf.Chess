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

export const useAssetStore = defineStore('asset', {
  state: () => ({
    metadata: null as Metadata | null,
    tokens: null as Metadata[] | null,
    loading: true, // Add a loading state
    collection_id: '' as string,
    collection_name: '' as string,
    collection_icon_url: '' as string,
  }),
  actions: {
    async loadCollection() {
      this.loading = true;
      if (this.tokens) return; // Don't load collection if already loaded
      const indexFile = `${process.env.NEVERNERF_METADATA_API_URL}/index.json`;
      try {
        const collectionConfigResponse = await fetch(indexFile);
        if (!collectionConfigResponse.ok) {
          throw new Error(
            `Network response was not ok for collection: ${indexFile}`
          );
        }
        const collectionConfig = await collectionConfigResponse.json();
        this.tokens = collectionConfig.tokens || {};
        this.collection_id = collectionConfig.collection_id;
        this.collection_name = collectionConfig.collection_name;
        this.collection_icon_url = collectionConfig.collection_icon_url;

        console.log(`${this.tokens?.length} loaded for collection.`);
      } catch (error) {
        console.error('Error loading collection:', error);
      }
      this.loading = false;
    },
    async loadMetadata(token_id: string) {
      this.loading = true;

      // Don't load metadata if token_id missing
      if (!token_id) {
        this.loading = false;
        console.error('TokenID not provided');
        return;
      }

      // Don't load metadata if collection index missing
      if (!this.tokens) {
        this.loading = false;
        return;
      }

      // Don't load metadata for the 0 token
      if (token_id === '0') {
        this.loading = false;
        return;
      }

      // Avoid reloading if data is already present
      const current_token_id = this.metadata?.token_id;
      if (this.metadata && current_token_id === token_id) {
        this.loading = false;
        return;
      }

      try {
        //Load token metadata
        const index = this.tokens.findIndex(
          (item) => item.token_id === token_id
        );
        if (index !== -1) {
          console.log(`Switching token context to: ${token_id}`);
          this.metadata = this.tokens[index];
        } else {
          console.log(`No token found for: ${token_id}`);
          return;
        }
      } catch (error) {
        console.error('Error loading metadata:', error);
        this.metadata = null; // Only reset if this is intended on error
      }
      this.loading = false;
    },
    getTokenIdByFen(fenString: string): string | undefined {
      if (!this.tokens) return;
      try {
        //Load token metadata
        const index = this.tokens?.findIndex((item) => item.fen === fenString);
        if (index !== -1) {
          return this.tokens[index].token_id;
        } else {
          console.log(`No token found for FEN: ${fenString}`);
          return;
        }
      } catch (error) {
        console.error(`Error loading token via FEN:${fenString}`, error);
        this.metadata = null; // Only reset if this is intended on error
      }
    },
  },
});
