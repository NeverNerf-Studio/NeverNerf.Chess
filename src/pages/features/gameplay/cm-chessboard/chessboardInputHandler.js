import { INPUT_EVENT_TYPE } from 'cm-chessboard/src/Chessboard.js';
import { MARKER_TYPE } from 'cm-chessboard/src/extensions/markers/Markers.js';
import { useChessboardStore } from 'src/stores/chessboard-store';

// cm-chessboard inputhandler code
export function createInputHandler() {
  return function inputHandler(event) {
    const chessboardStore = useChessboardStore();
    const move = {
      from: event.squareFrom,
      to: event.squareTo,
    };
    switch (event.type) {
      case INPUT_EVENT_TYPE.movingOverSquare:
        // Ignored event type, no operation required.
        break;
      case INPUT_EVENT_TYPE.moveInputStarted:
        removeMarkers(event.chessboard);
        return addMarkers(event, chessboardStore);
      case INPUT_EVENT_TYPE.validateMoveInput:
        return chessboardStore.makeMove(move);
      case INPUT_EVENT_TYPE.moveInputFinished:
        removeMarkers(event.chessboard);
        break;
      // default:
      //   removeMarkers(event.chessboard);
      //   break;
    }
  };

  // Removes all markers from the chessboard.
  function removeMarkers(chessboard) {
    chessboard.removeMarkers(MARKER_TYPE.dot);
    chessboard.removeMarkers(MARKER_TYPE.bevel);
  }

  // Handles the start of a move input, adding markers to possible destination squares.
  function addMarkers(event, chessboardStore) {
    const moves = chessboardStore.chess.moves({
      square: event.squareFrom,
      verbose: true,
    });
    moves.forEach((move) => {
      if (event.chessboard.getPiece(move.to)) {
        event.chessboard.addMarker(MARKER_TYPE.bevel, move.to);
      } else {
        event.chessboard.addMarker(MARKER_TYPE.dot, move.to);
      }
    });

    return moves.length > 0;
  }
}
