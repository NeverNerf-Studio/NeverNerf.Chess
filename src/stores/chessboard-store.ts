import { defineStore } from 'pinia';
import { Chess, Square, Move } from 'src/pages/features/gameplay/chessjs/chess';
import { moveHint } from 'src/services/nevernerf';
export const useChessboardStore = defineStore('chessboard', {
  state: () => ({
    chess: new Chess(),
    bestMove: null as Move | null,
    bestMoveLoading: false,
    fen: '',
    pgn: '',
    turn: 'w',
    check: false,
    checkMate: false,
    moves: [] as string[],
    promotionMove: null as { from: string; to: string } | null,
  }),
  actions: {
    updateGameFromFen(fen: string) {
      try {
        this.chess.load(fen);
      } catch (err) {
        console.error('Invalid FEN string:', fen);
        console.error(err);
      } finally {
        this.syncGameState();
        this.getBestMove();
      }
    },
    updateGameFromPGN(pgn: string) {
      try {
        if (pgn === 'newgame') {
          this.chess = new Chess();
        } else {
          this.chess.loadPgn(pgn);
        }
      } catch (err) {
        console.error('Invalid PGN string:', pgn);
        console.error(err);
      } finally {
        this.syncGameState();
        this.getBestMove();
      }
    },
    async syncGameState() {
      this.fen = this.chess.fen();
      this.pgn = this.chess.pgn();
      this.turn = this.chess.turn();
      this.check = this.chess.isCheck();
      this.checkMate = this.chess.isCheckmate();
      this.moves = this.chess.moves();
    },
    async getBestMove() {
      if (!this.checkMate && !this.bestMoveLoading) {
        const bestMoveFen = this.chess.fen();
        this.bestMoveLoading = true;
        const bestMoveResponse = await moveHint(bestMoveFen);

        //Is FEN still the same?
        if (this.fen === bestMoveFen) this.bestMove = bestMoveResponse;

        this.bestMoveLoading = false;
      }
    },
    isPromotion(move: { from: string; to: string }) {
      const possibleMoves = this.chess.moves({
        square: move.from as Square,
        verbose: true,
      });
      const promotionMove = possibleMoves.find(
        (possibleMove) =>
          possibleMove.promotion && possibleMove.to === (move.to as Square)
      );
      return promotionMove ? true : false;
    },
    makeMove(move: { from: string; to: string; promotion?: string }) {
      try {
        if (this.isPromotion(move)) {
          // If the promotion is set then this.promotionMove has been resolved
          if (move.promotion) {
            this.promotionMove = null;
          } else {
            this.promotionMove = move; // Stash the move until a promotion piece is selected
            return false;
          }
        }
        const result = this.chess.move(move);
        if (result) {
          this.syncGameState();
          this.getBestMove();
        }
        return result;
      } catch (err) {
        return false;
      }
    },
  },
});
