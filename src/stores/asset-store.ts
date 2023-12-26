import { defineStore } from 'pinia';

export const useMetadataStore = defineStore('imx', {
  state: () => ({
    imx: null,
    loading: false, // Add a loading state
  }),
  actions: {
    async loadMetadata(token_id: string) {
      this.loading = true; // Set loading to true when starting to load
      if (token_id) {
        try {
          const response = await fetch(`/imx_metadata/${token_id}.json`);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          this.imx = await response.json();
        } catch (error) {
          console.error('Error loading metadata:', error);
        } finally {
          this.loading = false; // Set loading to false after loading is done or if there's an error
        }
      } else {
        this.loading = false; // Ensure to set loading false if token_id is not provided
      }
    },
  },
});
