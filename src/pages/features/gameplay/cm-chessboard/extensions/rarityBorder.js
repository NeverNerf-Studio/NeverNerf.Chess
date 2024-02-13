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
    this.registerExtensionPoint(
      EXTENSION_POINT.afterRedrawBoard,
      this.extensionPointAfterRedrawBoard.bind(this)
    );
  }

  extensionPointBeforeRedrawBoard() {
    this.addTextures();
  }

  extensionPointAfterRedrawBoard() {
    this.addCoordinateBorder();
  }

  addCoordinateBorder() {
    const svg = this.chessboard.view.svg;
    const coordinates = svg.querySelectorAll('.coordinate');
    coordinates.forEach((textElement) => {
      const clone = textElement.cloneNode(true);
      const fontSize = textElement.style.fontSize;
      // Apply stroke to cloned element for border effect
      clone.setAttribute(
        'style',
        `font-size: ${fontSize}; stroke: black; stroke-width: 2; fill: none;`
      );
      // Insert clone behind original text for border effect
      textElement.parentNode.insertBefore(clone, textElement);
    });
  }

  addTextures() {
    const svg = this.chessboard.view.svg;
    // Assuming svg is the root SVG element of the chessboard, otherwise, adjust accordingly.
    if (!svg.querySelector('#richMahogany')) {
      // Define the SVG gradient block as a string
      const textureSVG = `
      <defs>
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#fff7e0;"></stop> <!-- Lighter, reflective gold highlight -->
            <stop offset="5%" style="stop-color:#ffd700;"></stop> <!-- Classic gold highlight -->
            <stop offset="20%" style="stop-color:#fcd440;"></stop> <!-- Warm, sunlit gold -->
            <stop offset="40%" style="stop-color:#cda434;"></stop> <!-- Rich mid-tone gold -->
            <stop offset="60%" style="stop-color:#cda434;"></stop> <!-- Consistent rich mid-tone for depth -->
            <stop offset="80%" style="stop-color:#fcd440;"></stop> <!-- Warm, sunlit gold returning -->
            <stop offset="95%" style="stop-color:#ffd700;"></stop> <!-- Classic gold highlight -->
            <stop offset="100%" style="stop-color:#fff7e0;"></stop> <!-- Lighter, reflective gold highlight for balance -->
        </linearGradient>
        <linearGradient id="silverGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#f0f0f0;"></stop> <!-- Very light silver for highlight -->
            <stop offset="10%" style="stop-color:#d8d8d8;"></stop> <!-- Light silver -->
            <stop offset="50%" style="stop-color:#a0a0a0;"></stop> <!-- Mid-tone silver -->
            <stop offset="90%" style="stop-color:#d8d8d8;"></stop> <!-- Light silver -->
            <stop offset="100%" style="stop-color:#f0f0f0;"></stop> <!-- Very light silver for highlight -->
        </linearGradient>
        <linearGradient id="diamondGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#5bb9e2;"></stop> <!-- Pure white for intense highlight -->
            <stop offset="10%" style="stop-color:#e0ffff;"></stop> <!-- Light blue for refracted light -->
            <stop offset="50%" style="stop-color:#DAF0F2;"></stop> <!-- Pure white for core brilliance -->
            <stop offset="90%" style="stop-color:#51f2fb;"></stop> <!-- Light blue for refracted light -->
            <stop offset="100%" style="stop-color:#DAF0F2;"></stop> <!-- Pure white for intense highlight -->
        </linearGradient>
        <linearGradient id="texturedGradient" x1="0%" y1="0%" x2="100%" y2="0%" patternTransform="rotate(30)">
            <!-- Start with a light base -->
            <stop offset="0%" style="stop-color:#fdf09b;"></stop> <!-- Light gold for highlight -->
            <stop offset="10%" style="stop-color:#e9c663;"></stop> <!-- Warm gold transition -->
            <!-- Introduce texture with darker tones -->
            <stop offset="25%" style="stop-color:#81350a;"></stop> <!-- Deep orange-brown -->
            <stop offset="40%" style="stop-color:#e45d1d;"></stop> <!-- Bright orange for vibrancy -->
            <stop offset="50%" style="stop-color:#702c07;"></stop> <!-- Dark brown for depth -->
            <!-- Repeat pattern for marbled effect -->
            <stop offset="60%" style="stop-color:#e45d1d;"></stop> <!-- Bright orange for vibrancy -->
            <stop offset="75%" style="stop-color:#81350a;"></stop> <!-- Deep orange-brown -->
            <stop offset="90%" style="stop-color:#e9c663;"></stop> <!-- Warm gold transition -->
            <stop offset="100%" style="stop-color:#fdf09b;"></stop> <!-- Light gold for highlight -->
        </linearGradient>
        <filter id="noiseFilter" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="noise"></feTurbulence>
            <feColorMatrix type="saturate" values="0" in="noise" result="monoNoise"></feColorMatrix>
            <feBlend in="SourceGraphic" in2="monoNoise" mode="multiply"></feBlend>
        </filter>
        <pattern id="richMahogany" patternUnits="userSpaceOnUse" width="10" height="10" patternTransform="rotate(30)">
            <!-- Lighter brown background -->
            <rect width="10" height="10" fill="#A0522D"></rect>
            <!-- Original grain pattern -->
            <path d="M 0,10 l 10,-10 M -2.5,2.5 l 5,-5 M 7.5,12.5 l 5,-5" stroke="#8B4513" strokeWidth="0.5"></path>
            <!-- Additional varied grain -->
            <path d="M 0,5 l 5,-5 M 5,15 l 10,-10" stroke="#8B4513" strokeWidth="0.3"></path>
            <path d="M 3,10 l 7,-7 M 1,12 l 8,-8" stroke="#8B4513" strokeWidth="0.7"></path>
        </pattern>
    </defs>`;

      // Inject the gradient definition into the SVG
      svg.insertAdjacentHTML('beforeend', textureSVG);
    }
  }

  addRichMahogany() {
    const svg = this.chessboard.view.svg;
    // Assuming svg is the root SVG element of the chessboard, otherwise, adjust accordingly.
    if (!svg.querySelector('#richMahogany')) {
      // Define the SVG gradient block as a string
      const mahoganySVG = `
        <defs>
          <filter id="noiseFilter" x="0" y="0" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="noise"></feTurbulence>
              <feColorMatrix type="saturate" values="0" in="noise" result="monoNoise"></feColorMatrix>
              <feBlend in="SourceGraphic" in2="monoNoise" mode="multiply"></feBlend>
          </filter>
          <pattern id="richMahogany" patternUnits="userSpaceOnUse" width="10" height="10" patternTransform="rotate(30)">
              <!-- Lighter brown background -->
              <rect width="10" height="10" fill="#A0522D"></rect>
              <!-- Original grain pattern -->
              <path d="M 0,10 l 10,-10 M -2.5,2.5 l 5,-5 M 7.5,12.5 l 5,-5" stroke="#8B4513" strokeWidth="0.5"></path>
              <!-- Additional varied grain -->
              <path d="M 0,5 l 5,-5 M 5,15 l 10,-10" stroke="#8B4513" strokeWidth="0.3"></path>
              <path d="M 3,10 l 7,-7 M 1,12 l 8,-8" stroke="#8B4513" strokeWidth="0.7"></path>
          </pattern>
        </defs>`;

      // Inject the gradient definition into the SVG
      svg.insertAdjacentHTML('beforeend', mahoganySVG);
    }
  }
}
