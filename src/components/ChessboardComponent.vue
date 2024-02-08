<template>
  <div ref="boardElement"></div>
  <div v-if="playable">
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
  COLOR,
  Chessboard,
} from 'cm-chessboard/src/Chessboard.js';
import {
  MARKER_TYPE,
  Markers,
} from 'cm-chessboard/src/extensions/markers/Markers.js';
import {
  PROMOTION_DIALOG_RESULT_TYPE,
  PromotionDialog,
} from 'cm-chessboard/src/extensions/promotion-dialog/PromotionDialog.js';
import { Accessibility } from 'cm-chessboard/src/extensions/accessibility/Accessibility.js';

// Import chess.js, manages game state, legal moves etc.
import { Chess } from 'chess.js';

//vue imports
import { ref, onMounted } from 'vue';
import { reactive, computed } from 'vue';

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

// const currentFEN = computed(() => {
//   gameStateChangeTracker.value;
//   return chess.fen();
// });
// const currentPGN = computed(() => {
//   gameStateChangeTracker.value;
//   return chess.pgn();
// });
// const turn = computed(() => {
//   gameStateChangeTracker.value;
//   return chess.turn() === 'w' ? 'White' : 'Black';
// });
// const check = computed(() => {
//   gameStateChangeTracker.value;
//   return chess.isCheck();
// });
// const checkMate = computed(() => {
//   gameStateChangeTracker.value;
//   return chess.isCheckmate();
// });

const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text);
};
function generateMoves(chess, depth = 2, moveId = 1, history = []) {
  if (depth === 0) return []; // Base case: no further recursion needed.

  let movesList = [];
  chess.moves().forEach((move) => {
    const newChess = new Chess();
    newChess.loadPgn(chess.pgn()); // Clone the current board.
    newChess.move(move); // Make the move on the new board.

    // Extend the history with the current move.
    const newHistory = history.concat(move);

    // Prepare the CSV row for this move.
    const moveData = [
      moveId++,
      move, // The move made.
      newChess.fen(), // FEN after the move.
      `["${newHistory.join('","')}"]`, // PGN up to this move in CSV format.
    ];

    // Add the move data as a CSV row.
    movesList.push(moveData.join(','));

    // Generate child moves if depth allows and add them to the list.
    if (depth > 1) {
      movesList = movesList.concat(
        generateMoves(newChess, depth - 1, moveId, newHistory)
      );
      moveId += newChess.moves().length; // Adjust moveId based on the number of moves generated.
    }
  });
  return movesList;
}
const moveDumper = computed(() => {
  gameStateChangeTracker.value;

  console.log('Chess future moves: ' + chess.moves());
  console.log('Chess pgn: ' + chess.pgn());

  const movesList1 = generateMoves(chess, 1).join('\n');
  console.log('Valid 1x moves: ' + movesList1.length);

  const movesList2 = generateMoves(chess, 2).join('\n');
  console.log('Valid 2x moves: ' + movesList2.length);
  return movesList2;
});

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

// Validates and executes a chess move, handling promotions as needed.
function validateAndExecuteMove(event) {
  const move = {
    from: event.squareFrom,
    to: event.squareTo,
    promotion: event.promotion,
  };

  try {
    const result = chess.move(move);
    if (!result) return false; // Move was not successful.

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
      handlePromotion(event.squareTo, COLOR.white, event);
      return true;
    }

    return result; // Return the result of the chess move.
  } catch (error) {
    console.error(error);
    return false; // Indicate failure to process the move.
  }
}

// Handles chess piece promotion by showing a dialog for piece selection.
function handlePromotion(squareTo, color, event) {
  event.chessboard.showPromotionDialog(squareTo, color, (result) => {
    if (result.type === PROMOTION_DIALOG_RESULT_TYPE.pieceSelected) {
      chess.move({
        from: event.squareFrom,
        to: squareTo,
        promotion: result.piece.charAt(0), // Assuming the piece type is the first character.
      });
      event.chessboard.setPosition(chess.fen(), true);
    } else {
      // Handle promotion cancellation.
      event.chessboard.enableMoveInput(inputHandler, color);
      event.chessboard.setPosition(chess.fen(), true);
    }
  });
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
      { class: PromotionDialog },
      { class: Accessibility, props: { visuallyHidden: true } },
    ],
    assetsUrl: 'node_modules/cm-chessboard/assets/',
  });
  board.value.enableMoveInput(inputHandler);
});
</script>
