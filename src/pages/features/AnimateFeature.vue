<template>
  <div v-if="asset?.imx?.metadata">
    <ChessboardComponent
      :playable="false"
      :fen="asset.imx.metadata.fen"
      :rarity="asset.imx.metadata.rarity" />

    <q-btn
      color="primary"
      id="playbutton"
      :label="playButtonLabel"
      @click="animate" />
  </div>
</template>

<script setup>
import { onMounted, computed, onUnmounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import ChessboardComponent from 'src/components/ChessboardComponent.vue';
import { useChessboardStore } from 'src/stores/chessboard-store';
import { useAssetStore } from 'src/stores/asset-store';

const assetStore = useAssetStore();
const asset = computed(() => assetStore);
const token_id = computed(() => useRoute().params.token_id);
const chessboardStore = useChessboardStore();
const playButtonLabel = ref('Play');

const animate = () => {
  playButtonLabel.value = '...';
  const validMoves = chessboardStore.$state.chess.moves();
  console.log(validMoves);
  let currentMoveIndex = 0; // Start with the first move

  const intervalId = setInterval(() => {
    if (currentMoveIndex > 0) chessboardStore.$state.chess.undo();
    chessboardStore.makeMove(validMoves[currentMoveIndex]);

    if (currentMoveIndex >= validMoves.length - 1) {
      // Check if this is the last move
      clearInterval(intervalId); // Stop the animation
      playButtonLabel.value = 'Done'; // Update the label after animation completes
    } else {
      currentMoveIndex++; // Proceed to the next move
    }
  }, 500); // Adjust the timing (1000ms = 1 second) based on your needs

  // Cleanup on component unmount
  onUnmounted(() => {
    clearInterval(intervalId);
    chessboardStore.updateGameFromFen(assetStore.imx?.metadata.fen);
  });
};

onMounted(() => {
  assetStore.loadMetadata(token_id.value);
  chessboardStore.updateGameFromFen(assetStore.imx?.metadata.fen);
});
</script>