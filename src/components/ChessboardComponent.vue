<template>
  <div ref="boardElement"></div>
  <!-- <div v-if="playable">
    <h5>{{ turn.replace(/^./, (str) => str.toUpperCase()) }}'s turn</h5>
    <div class="text-caption">{{ board?.value?.fen() }}</div>
    <div class="text-caption">Check: {{ game.inCheck() }}</div>
    <div class="text-caption">Checkmate: {{ game.isCheckmate() }}</div>
  </div> -->
</template>

<style>
/* Add responsive styling if needed */
@media (max-width: 600px) {
  #boardElement {
    width: 100%; /* Adjust board size on smaller screens */
  }

  #boardElement img {
    /* Use the correct class for chess pieces */
    touch-action: none;
  }
}
</style>

<script setup>
import 'cm-chessboard/assets/chessboard.css';
import { Chessboard } from 'cm-chessboard/src/Chessboard.js';

import { watch, ref, defineProps } from 'vue';

// Define props
const props = defineProps({
  playable: Boolean,
  fen: String,
});

const boardElement = ref(null);
const board = ref(null);

//Was a watch when boardElement was inside a v-if waiting for assetStore to load
//TODO should this still be watch?
watch(boardElement, (readyBoard) => {
  if (readyBoard && !board.value) {
    board.value = new Chessboard(boardElement.value, {
      position: props.fen,
      // style: {
      //   cssClass: props.playable ? 'playable' : 'default',
      // },
      assetsUrl: 'node_modules/cm-chessboard/assets/',
    });
  }
});

// Respond to FEN prop changes
watch(
  () => props.fen,
  (newFEN) => {
    if (newFEN && board.value) {
      board.value.setPosition(newFEN, true);
    }
  },
  { immediate: true }
);
</script>
