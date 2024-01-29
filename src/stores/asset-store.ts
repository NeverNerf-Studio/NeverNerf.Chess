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

export const useAssetStore = defineStore('asset', {
  state: () => ({
    imx: null as IMXMetadata | null,
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
        const response = await fetch(`/imx_metadata/${token_id}.json`);
        if (!response.ok) {
          throw new Error(`Network response was not ok for token: ${token_id}`);
        }
        this.imx = await response.json();
        console.log('Data loaded for token:', token_id);
      } catch (error) {
        console.error('Error loading metadata:', error);
        this.imx = null; // Only reset if this is intended on error
      } finally {
        this.loading = false;
      }
    },
  },
});
