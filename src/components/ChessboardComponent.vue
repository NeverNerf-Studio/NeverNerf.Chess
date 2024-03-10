<template>
  <div
    style="width: 100%"
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
                :src="`/chess/chesspieces/wikipedia/${chessboardStore.turn}${piece}.png`" />
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

.rarity {
  max-width: 500px;
}

.cm-chessboard.default.border-type-frame .board .border-inner {
  stroke: #000;
}
</style>

<script setup>
//cm-chessboard imports, manages gameboard and UI
import 'src/css/cm-chessboard/chessboard.css';
import 'src/css/cm-chessboard/arrows.css';

import { Chessboard } from 'cm-chessboard/src/Chessboard.js';
import {
  MARKER_TYPE,
  Markers,
} from 'cm-chessboard/src/extensions/markers/Markers.js';
import {
  ARROW_TYPE,
  Arrows,
} from 'cm-chessboard/src/extensions/arrows/Arrows.js';
import { RarityBorder } from 'src/pages/features/gameplay/cm-chessboard/extensions/rarityBorder.js';
import { useChessboardStore } from 'src/stores/chessboard-store';
import { createInputHandler } from 'src/pages/features/gameplay/cm-chessboard/chessboardInputHandler.js';
import { usePassportStore } from 'src/stores/passport-store';

//vue imports
import { ref, onMounted, onBeforeUnmount } from 'vue';
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
      board.value.removeArrows();
      board.value.removeMarkers();
      board.value.setPosition(chessboardStore.fen);
    }
  },
  {
    immediate: false,
  }
);

watch(
  () => chessboardStore.bestMove,
  () => {
    //Highlight best move
    if (!chessboardStore.checkMate && chessboardStore.bestMove) {
      board.value.addMarker(MARKER_TYPE.bevel, chessboardStore.bestMove.to);
      board.value.addArrow(
        usePassportStore().isAuthenticated
          ? ARROW_TYPE.pointy
          : ARROW_TYPE.danger,
        chessboardStore.bestMove.from,
        chessboardStore.bestMove.to
      );
    }
  },
  {
    immediate: false,
  }
);

onBeforeUnmount(() => {
  // Cleanup function
  if (board.value) {
    board.value.destroy();
  }
});

onMounted(() => {
  let boardFen = props.playable ? chessboardStore.fen : props.fen;
  if (!boardFen && props.pgn) {
    chessboardStore.updateGameFromPGN(props.pgn);
    boardFen = chessboardStore.fen;
  }

  // Initialize chessboard UI
  board.value = new Chessboard(boardElement.value, {
    position: boardFen,
    style: {
      pieces: { file: 'chesspieces/pieces/staunty.svg' },
      animationDuration: 300,
      borderType: 'frame',
    },
    extensions: [
      { class: Markers, props: { autoMarkers: MARKER_TYPE.square } },
      { class: RarityBorder },
      { class: Arrows },
    ],
    assetsUrl: '/chess/',
  });

  // Use chessboardInputHandler.createInputHandler for handling user input
  if (props.playable)
    board.value.enableMoveInput(createInputHandler(chessboardStore));
});
</script>
