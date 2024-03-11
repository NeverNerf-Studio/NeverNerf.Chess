// Import axios for making HTTP requests
import axios from 'axios';
import { Chess, Move } from 'src/pages/features/gameplay/chessjs/chess';
import { usePassportStore } from 'src/stores/passport-store';

async function moveHint(fen: string): Promise<Move | null> {
  const isAuthenticated = await usePassportStore().isAuthenticated; // Check if the user is authenticated
  const isOwner = await usePassportStore().isOwner; // Check if the user is the owner of an asset
  if (!isAuthenticated || !isOwner) return postFen(fen, 'okMove');

  const jwtToken = await usePassportStore().getJWT();
  return postFen(fen, 'bestMove', jwtToken); // If the user is authenticated, make a bestMove request to the server
}

// Define the function to post FEN string
async function postFen(
  fen: string,
  hintType: string,
  jwtToken = ''
): Promise<Move | null> {
  const encodedFen = encodeURIComponent(fen); // Encode FEN string to handle special characters
  console.log('Requesting move for FEN:', fen);
  try {
    const response = await axios.get(
      `https://chess-api.nnf.app/v1/${hintType}/${encodedFen}`,
      { headers: { Authorization: jwtToken } }
    );

    console.log(`Server ${hintType} Response:`, response.data);
    const chess = new Chess(fen);
    return chess.move(response.data);
  } catch (error) {
    console.error('Error posting FEN:', error);
    return null;
  }
}

export { moveHint };
