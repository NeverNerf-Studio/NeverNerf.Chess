<template>
  <div v-if="assetStore?.imx?.metadata" class="q-pa-md flex flex-center">
    <div class="text-center" style="max-width: 100%">
      <h4>Gameplay</h4>
      <div class="text-h5 q-my-md">{{ assetStore.imx.metadata.name }}</div>
      <div id="myBoard" style="width: 300px; margin: 0 auto"></div>
      <h5>{{ turn.replace(/^./, (str) => str.toUpperCase()) }}'s turn</h5>
      <div class="text-caption">{{ board?.value?.fen() }}</div>
      <div class="text-caption">Check: {{ game.inCheck() }}</div>
      <div class="text-caption">Checkmate: {{ game.isCheckmate() }}</div>
    </div>
  </div>
</template>

<style>
/* Add responsive styling if needed */
@media (max-width: 600px) {
  #myBoard {
    width: 100%; /* Adjust board size on smaller screens */
  }
  h4,
  .text-h5,
  h5,
  .text-caption {
    font-size: smaller; /* Adjust font size on smaller screens */
  }

  #myBoard img {
    /* Use the correct class for chess pieces */
    touch-action: none;
  }
}
</style>

<script setup>
import { Chess } from 'chess.js'; // Import chess.js
import { onMounted, ref, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { useAssetStore } from 'src/stores/asset-store';

const board = ref(null); // This will hold the chessboard object
const game = new Chess(); // This will hold the chess game logic
const turn = ref('white');

const token_id = ref(useRoute().params.token_id);
const assetStore = useAssetStore();

onMounted(async () => {
  try {
    await loadjQuery();
    await loadChessCSS();
    await loadChessboardScript();
    await assetStore.loadMetadata(token_id.value);
    nextTick().then(() => {
      initializeChessboard();
    });
  } catch (error) {
    console.error(error);
  }
});

const loadjQuery = () => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://code.jquery.com/jquery-3.5.1.min.js';
    script.integrity =
      'sha384-ZvpUoO/+PpLXR1lu4jmpXWu80pZlYUAfxl5NsBMWOEPSjUn/6Z/hRTt8+pR6L4N2';
    script.crossOrigin = 'anonymous';
    script.onload = resolve;
    script.onerror = () => reject('Failed to load jQuery');
    document.head.appendChild(script);
  });
};

const loadChessboardScript = () => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src =
      'https://unpkg.com/@chrisoakman/chessboardjs@1.0.0/dist/chessboard-1.0.0.min.js';
    script.integrity =
      'sha384-8Vi8VHwn3vjQ9eUHUxex3JSN/NFqUg3QbPyX8kWyb93+8AC/pPWTzj+nHtbC5bxD';
    script.crossOrigin = 'anonymous';
    script.onload = resolve;
    script.onerror = () => reject('Failed to load Chessboard script');
    document.head.appendChild(script);
  });
};

const loadChessCSS = () => {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href =
    'https://unpkg.com/@chrisoakman/chessboardjs@1.0.0/dist/chessboard-1.0.0.min.css';
  link.integrity =
    'sha384-q94+BZtLrkL1/ohfjR8c6L+A6qzNH9R2hBLwyoAfu3i/WCvQjzL2RQJ3uNHDISdU';
  link.crossOrigin = 'anonymous';
  link.onerror = (error) =>
    console.error('Failed to load Chessboard CSS:', error);
  document.head.appendChild(link);
};

const initializeChessboard = () => {
  const pieceTheme = (piece) => '/chesspieces/wikipedia/' + piece + '.png';
  const whiteSquareGrey = '#a9a9a9';
  const blackSquareGrey = '#696969';

  function onChange() {
    turn.value = game.turn() === 'w' ? 'white' : 'black';
  }

  // Integrate the chess.js legal move highlighting functions
  function removeGreySquares() {
    $('#myBoard .square-55d63').css('background', '');
  }

  function greySquare(square) {
    var $square = $('#myBoard .square-' + square);

    var background = whiteSquareGrey;
    if ($square.hasClass('black-3c85d')) {
      background = blackSquareGrey;
    }

    $square.css('background', background);
  }

  function onDragStart(source, piece) {
    //Exit if checkmate
    if (game.isCheckmate()) return false;
    // or if it's not that side's turn
    if (
      (game.turn() === 'w' && piece.search(/^b/) !== -1) ||
      (game.turn() === 'b' && piece.search(/^w/) !== -1)
    ) {
      return false;
    }
    // or if there are no moves available for this square
    // get list of possible moves for this square
    var moves = game.moves({
      square: source,
      verbose: true,
    });
    if (moves.length === 0) return false;

    // highlight the square they moused over
    greySquare(source);

    // highlight the possible squares for this piece
    for (var i = 0; i < moves.length; i++) {
      greySquare(moves[i].to);
    }
  }

  function onDrop(source, target) {
    removeGreySquares();

    // Create a move object for validation
    try {
      var move = game.move({
        from: source,
        to: target,
        promotion: 'q', // Always promote to a queen for simplicity
      });

      // If the move is illegal, chess.js will throw an error which we catch here
      if (move === null) throw new Error('Illegal move');
    } catch (error) {
      return 'snapback'; // This reverts the piece to its original position
    }

    // Update the board position after the piece snap for valid moves
    board.value.position(game.fen());
  }

  function onSnapEnd() {
    console.log('onSnapEnd');
    board.value.position(game.fen());
  }

  // Initialize the game with the current FEN string
  game.load(assetStore.imx.metadata.FEN);
  turn.value = game.turn() === 'w' ? 'white' : 'black';

  // Chessboard.js configuration with chess.js integration
  var config = {
    pieceTheme: pieceTheme,
    draggable: true,
    position: game.fen(),
    orientation: turn,
    onDragStart: onDragStart,
    onDrop: onDrop,
    onSnapEnd: onSnapEnd,
    onChange: onChange,
  };
  board.value = Chessboard('myBoard', config); // Set the board reference
};
</script>
