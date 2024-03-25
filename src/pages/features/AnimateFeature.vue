<template>
  <ChessboardComponent :playable="false" :fen="fen" :rarity="rarity" />
  <q-btn
    color="primary"
    id="playbutton"
    style="display: none"
    :label="playButtonLabel"
    @click="animate()" />
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import ChessboardComponent from 'src/components/ChessboardComponent.vue';
import { useChessboardStore } from 'src/stores/chessboard-store';

const fen = ref('');
const pgn = ref('');
const rarity = ref('');
const chessboardStore = useChessboardStore();
const playButtonLabel = ref('Play');
const route = useRoute();

// Watch the route and update refs accordingly
watch(
  () => route.query,
  (query) => {
    fen.value = (query.fen as string) || '';
    pgn.value = (query.pgn as string) || '';
    rarity.value = (query.rarity as string) || '';
  },
  { immediate: true }
);

function animate() {
  playButtonLabel.value = '...';
  if (pgn.value) {
    chessboardStore.updateGameFromPGN(pgn.value);
  } else {
    chessboardStore.updateGameFromFen(fen.value);
  }
  const validMoves = chessboardStore.$state.chess.moves();
  const historyMoves = chessboardStore.$state.chess.history();

  // Determine the moves for animation based on the number of history moves
  const animationMoves = historyMoves.length > 2 ? historyMoves : validMoves;

  // Initialize chessboardStore conditionally
  if (historyMoves.length <= 2) {
    chessboardStore.updateGameFromFen(fen.value);
  } else {
    chessboardStore.updateGameFromPGN('newgame');
  }

  let currentMoveIndex = 0; // Start with the first move

  const intervalId = setInterval(() => {
    if (historyMoves.length <= 2) {
      chessboardStore.updateGameFromFen(fen.value);
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
}

onMounted(() => {
  chessboardStore.updateGameFromFen(fen.value);
});
</script>
