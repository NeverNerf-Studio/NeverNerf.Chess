<template>
  <div v-if="asset?.imx?.metadata" class="q-pa-md">
    <div ref="boardElement"></div>
  </div>
</template>

<script setup>
import 'cm-chessboard/assets/chessboard.css';
import { Chessboard, FEN } from 'cm-chessboard/src/Chessboard.js';

import { watch, ref, onMounted, computed } from 'vue';
import { useAssetStore } from 'src/stores/asset-store';
import { useRoute } from 'vue-router';

const token_id = computed(() => useRoute().params.token_id);
const assetStore = useAssetStore();
const asset = computed(() => assetStore);

const boardElement = ref(null); // The div tag above
const board = ref(null); // The cm-chessboard instance

watch(boardElement, (readyBoard) => {
  if (readyBoard && !board.value) {
    board.value = new Chessboard(boardElement.value, {
      assetsUrl: 'node_modules/cm-chessboard/assets/',
    });
    board.value.setPosition(asset.value.imx.metadata.FEN || FEN.start, true);
  }
});

watch(
  () => asset.value?.imx?.metadata?.FEN,
  (newFEN) => {
    console.log('NewFen:' + newFEN);
    if (newFEN && board.value) {
      board.value.setPosition(newFEN, true);
    }
  },
  { immediate: true }
);

onMounted(() => {
  assetStore.loadMetadata(token_id.value);
});
</script>
