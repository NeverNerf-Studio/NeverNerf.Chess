<template>
  <div ref="boardElement"></div>
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
                :src="`/chesspieces/wikipedia/${chess.turn()}${piece}.png`" />
            </q-btn>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <div>
      <q-item-section side>
        <q-btn
          icon="content_copy"
          @click="copyToClipboard(moveDumper)"
          flat
          dense
          >Future moves</q-btn
        >
      </q-item-section>
    </div>
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
</style>

<script setup>
//cm-chessboard imports, manages gameboard and UI
import 'cm-chessboard/assets/chessboard.css';
import {
  INPUT_EVENT_TYPE,
  BORDER_TYPE,
  Chessboard,
} from 'cm-chessboard/src/Chessboard.js';
import {
  MARKER_TYPE,
  Markers,
} from 'cm-chessboard/src/extensions/markers/Markers.js';

// Import chess.js, manages game state, legal moves etc.
import { Chess } from 'chess.js';

//vue imports
import { ref, onMounted } from 'vue';
import { reactive, watch } from 'vue';

// Define props
const props = defineProps({
  playable: Boolean,
  fen: String,
  pgn: String,
});

const boardElement = ref(null); // This is the container tag for the board
const board = ref(null); // This will hold the chessboard object
const chess = new Chess(); // This will hold the chess game logic

// Define the reactive state object
const gameState = reactive({
  fen: chess.fen(),
  pgn: chess.pgn(),
  turn: chess.turn() === 'w' ? 'White' : 'Black',
  check: chess.isCheck(),
  checkMate: chess.isCheckmate(),
  moves: chess.moves(),
});

const emit = defineEmits(['gameStateUpdate']);
function updateGameState() {
  gameState.fen = chess.fen();
  gameState.pgn = chess.pgn();
  gameState.turn = chess.turn() === 'w' ? 'White' : 'Black';
  gameState.check = chess.isCheck();
  gameState.checkMate = chess.isCheckmate();
  gameState.moves = chess.moves();

  // Emit the updated gameState object to the parent component
  emit('gameStateUpdate', gameState);
}

// cm-chessboard inputhandler code
// Main input handler function
function inputHandler(event) {
  switch (event.type) {
    case INPUT_EVENT_TYPE.movingOverSquare:
      // Ignored event type, no operation required.
      break;
    case INPUT_EVENT_TYPE.moveInputStarted:
      return handleMoveStart(event);
    case INPUT_EVENT_TYPE.validateMoveInput:
      return validateAndExecuteMove(event);
    case INPUT_EVENT_TYPE.moveInputFinished:
      removeMarkers(event.chessboard);
      updateGameState();
      break;
    default:
      removeMarkers(event.chessboard);
      break;
  }
}

// Removes all markers from the chessboard.
function removeMarkers(chessboard) {
  chessboard.removeMarkers(MARKER_TYPE.dot);
  chessboard.removeMarkers(MARKER_TYPE.bevel);
}

// Handles the start of a move input, adding markers to possible destination squares.
function handleMoveStart(event) {
  removeMarkers(event.chessboard); // Clear existing markers.

  const moves = chess.moves({ square: event.squareFrom, verbose: true });
  moves.forEach((move) => {
    if (event.chessboard.getPiece(move.to)) {
      event.chessboard.addMarker(MARKER_TYPE.bevel, move.to);
    } else {
      event.chessboard.addMarker(MARKER_TYPE.dot, move.to);
    }
  });

  return moves.length > 0;
}

const pieceLabels = {
  q: 'Queen',
  r: 'Rook',
  b: 'Bishop',
  n: 'Knight',
};
const promotionDialogVisible = ref(false);
const promotionPieces = ['q', 'r', 'b', 'n']; // Queen, Rook, Bishop, Knight

// Function to handle promotion piece selection
const userPromotionChoice = ref(null);
function selectPromotionPiece(piece) {
  userPromotionChoice.value = piece;
}
// Modify the selectPromotionPiece to actually use the modal for selection
function promptPromotionPiece() {
  return new Promise((resolve) => {
    promotionDialogVisible.value = true; // Show the dialog
    const unwatch = watch(userPromotionChoice, (newValue) => {
      if (newValue) {
        resolve(newValue); // Resolve the promise with the selected piece
        promotionDialogVisible.value = false; // Hide the dialog
        userPromotionChoice.value = null; // Reset for next promotion
        unwatch(); // Stop watching the variable
      }
    });
  });
}

// Validates and executes a chess move, handling promotions as needed.
function validateAndExecuteMove(event) {
  const move = {
    from: event.squareFrom,
    to: event.squareTo,
  };

  try {
    // Check if promotion is needed and handle accordingly.
    const possibleMoves = chess.moves({
      square: event.squareFrom,
      verbose: true,
    });
    const promotionMove = possibleMoves.find(
      (possibleMove) =>
        possibleMove.promotion && possibleMove.to === event.squareTo
    );

    if (promotionMove) {
      promptPromotionPiece()
        .then((selectedOption) => {
          const promotionMove = {
            from: event.squareFrom,
            to: event.squareTo,
            promotion: selectedOption,
          };
          //Remove Pawn
          board.value.setPiece(event.squareFrom, '', true);

          //Add replacement
          board.value.setPiece(
            event.squareTo,
            chess.turn() + selectedOption,
            true
          );

          const validPromotion = chess.move(promotionMove);

          removeMarkers(event.chessboard);
          updateGameState();

          return validPromotion;
        })
        .catch((error) => {
          // Handle any error
          console.log('An error occurred:', error);
        });
      return false; // Prevent the move until the piece is selected
    }

    return chess.move(move);
  } catch (error) {
    console.error(error);
    return false; // Indicate failure to process the move.
  }
}

onMounted(() => {
  //Initialise game state
  if (props.pgn) chess.loadPgn(props.pgn);
  else chess.load(props.fen);

  //Initialise chessboard UI
  board.value = new Chessboard(boardElement.value, {
    position: chess.fen(),
    style: {
      borderType: BORDER_TYPE.none,
      pieces: { file: 'pieces/staunty.svg' },
      animationDuration: 300,
    },
    extensions: [
      { class: Markers, props: { autoMarkers: MARKER_TYPE.square } },
    ],
    assetsUrl: 'node_modules/cm-chessboard/assets/',
  });
  board.value.enableMoveInput(inputHandler);
  updateGameState();
});
</script>
