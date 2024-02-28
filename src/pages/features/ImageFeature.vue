<template>
  <div v-if="asset.loading">Loading...</div>
  <div v-else class="q-pa-md">
    <ChessboardComponent
      :playable="false"
      :fen="asset.metadata.fen"
      :rarity="asset.metadata.rarity" />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useAssetStore } from 'src/stores/asset-store';
import ChessboardComponent from 'src/components/ChessboardComponent.vue';

const asset = computed(() => useAssetStore());
</script>
