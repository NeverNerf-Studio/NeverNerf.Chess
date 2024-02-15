<template>
  <div
    :class="rarity ? `rarity ${props.rarity.toLowerCase()}` : ''"
    ref="boardElement"></div>
  <div v-if="playable">
    <q-dialog v-model="promotionDialogVisible">
      <q-card>
        <div class="text-h6 text-center">Promotion</div>
        <q-card-section class="row items-center justify-around">
          <div
            v-for="piece in promotionPieces"
            :key="piece"
            @click="selectPromotionPiece(piece)">
            <q-btn flat :label="pieceLabels[piece]" icon-size="2em">
              <img
                style="background-color: #ecdab9; display: inline-block"
                :src="`/chesspieces/wikipedia/${chessboardStore.turn}${piece}.png`" />
            </q-btn>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
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

.cm-chessboard.default.border-type-frame .board .border-inner {
  stroke: #000;
}
</style>

<script setup>
//cm-chessboard imports, manages gameboard and UI
import 'cm-chessboard/assets/chessboard.css';
import { Chessboard } from 'cm-chessboard/src/Chessboard.js';
import {
  MARKER_TYPE,
  Markers,
} from 'cm-chessboard/src/extensions/markers/Markers.js';
import { RarityBorder } from 'src/pages/features/gameplay/cm-chessboard/extensions/rarityBorder.js';
import { useChessboardStore } from 'src/stores/chessboard-store';
import { createInputHandler } from 'src/pages/features/gameplay/cm-chessboard/chessboardInputHandler.js';

//vue imports
import { ref, onMounted } from 'vue';
import { watch } from 'vue';

// Define props
const props = defineProps({
  playable: Boolean,
  rarity: String,
  fen: String,
  pgn: String,
});

// This is the container tag for the board
const boardElement = ref(null);

// Contains chess gamestate in pinia store
const chessboardStore = useChessboardStore();

const pieceLabels = {
  q: 'Queen',
  r: 'Rook',
  b: 'Bishop',
  n: 'Knight',
};
const promotionPieces = ['q', 'r', 'b', 'n']; // Queen, Rook, Bishop, Knight

// Toggle
const promotionDialogVisible = ref(false);
watch(
  () => chessboardStore.promotionMove,
  () => {
    promotionDialogVisible.value = true;
  }
);
// Function to handle promotion piece selection
function selectPromotionPiece(piece) {
  if (chessboardStore.promotionMove) {
    chessboardStore.promotionMove.promotion = piece;
    chessboardStore.makeMove(chessboardStore.promotionMove);
    promotionDialogVisible.value = false; // Close the dialog after selection
  }
}

const board = ref(null);
watch(
  () => chessboardStore.pgn,
  () => {
    if (board.value) {
      board.value.setPosition(chessboardStore.fen);
    }
  },
  {
    immediate: false,
  }
);

onMounted(() => {
  // Initialize chessboard UI
  board.value = new Chessboard(boardElement.value, {
    position: chessboardStore.fen,
    style: {
      pieces: { file: 'pieces/staunty.svg' },
      animationDuration: 300,
      borderType: 'frame',
    },
    extensions: [
      { class: Markers, props: { autoMarkers: MARKER_TYPE.square } },
      { class: RarityBorder },
    ],
    assetsUrl: 'node_modules/cm-chessboard/assets/',
  });

  // Use chessboardInputHandler.createInputHandler for handling user input
  board.value.enableMoveInput(createInputHandler(chessboardStore));
});
</script>
