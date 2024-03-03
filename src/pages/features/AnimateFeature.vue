<template>
  <div v-if="asset?.metadata">
    <ChessboardComponent
      :playable="false"
      :fen="asset.metadata.fen"
      :rarity="asset.metadata.rarity" />

    <q-btn
      color="primary"
      id="playbutton"
      :label="playButtonLabel"
      @click="animate" />
  </div>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue';
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
  chessboardStore.updateGameFromPGN(assetStore.metadata.pgn);
  const validMoves = chessboardStore.$state.chess.moves();
  const historyMoves = chessboardStore.$state.chess.history();

  // Determine the moves for animation based on the number of history moves
  const animationMoves = historyMoves.length > 2 ? historyMoves : validMoves;

  // Initialize chessboardStore conditionally
  if (historyMoves.length <= 2) {
    chessboardStore.updateGameFromFen(assetStore.metadata.fen);
  } else {
    chessboardStore.updateGameFromPGN('newgame');
  }

  console.log(animationMoves);
  let currentMoveIndex = 0; // Start with the first move

  const intervalId = setInterval(() => {
    if (historyMoves.length <= 2) {
      chessboardStore.updateGameFromFen(assetStore.metadata.fen);
    }
    chessboardStore.makeMove(animationMoves[currentMoveIndex]);

    if (currentMoveIndex < animationMoves.length) {
      chessboardStore.makeMove(animationMoves[currentMoveIndex]);
      currentMoveIndex++;
    } else {
      clearInterval(intervalId); // Stop the interval when all moves are played
      playButtonLabel.value = 'Done'; // Update the label after animation completes
    }
  }, 200); // Adjust the timing (1000ms = 1 second) based on your needs
};

onMounted(() => {
  assetStore.loadMetadata(token_id.value);
  chessboardStore.updateGameFromFen(assetStore.metadata.fen);
});
</script>
