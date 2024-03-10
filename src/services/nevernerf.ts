// Import axios for making HTTP requests
import axios from 'axios';
import { Chess, Move } from 'src/pages/features/gameplay/chessjs/chess';
import { usePassportStore } from 'src/stores/passport-store';

async function moveHint(fen: string): Promise<Move | null> {
  const isAuthenticated = await usePassportStore().getUserInfo(); // Check if the user is authenticated
  if (isAuthenticated) return postFen(fen, 'bestMove'); // If the user is authenticated, make a bestMove request to the server

  return postFen(fen, 'okMove');
}

// Define the function to post FEN string
async function postFen(fen: string, hintType: string): Promise<Move | null> {
  const encodedFen = encodeURIComponent(fen); // Encode FEN string to handle special characters
  console.log('Requesting move for FEN:', fen);
  try {
    const response = await axios.get(
      `https://chess-api.nnf.app/v1/${hintType}/${encodedFen}`
    );

    console.log('Server Response:', response.data);
    const chess = new Chess(fen);
    return chess.move(response.data);
  } catch (error) {
    console.error('Error posting FEN:', error);
    return null;
  }
}

export { moveHint };
