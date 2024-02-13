import {
  Extension,
  EXTENSION_POINT,
} from 'cm-chessboard/src/model/Extension.js';

export class RarityBorder extends Extension {
  constructor(chessboard, props = {}) {
    super(chessboard);
    this.props = {
      chessboardBorderType: chessboard.props.style.borderType,
      borderNoneBelow: 540, // pixels width of the board, where the border is set to none
    };
    Object.assign(this.props, props);
    this.registerExtensionPoint(
      EXTENSION_POINT.beforeRedrawBoard,
      this.extensionPointBeforeRedrawBoard.bind(this)
    );
  }
  extensionPointBeforeRedrawBoard() {
    let newBorderType;
    if (this.chessboard.view.width < this.props.borderNoneBelow) {
      newBorderType = 'none';
    } else {
      newBorderType = this.props.chessboardBorderType;
    }
    if (newBorderType !== this.chessboard.props.style.borderType) {
      this.chessboard.props.style.borderType = newBorderType;
      this.chessboard.view.updateMetrics();
    }
  }
}
