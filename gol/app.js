import game from './game.js';

const nxC = 160;
const nyC = 160;

const gHeight = 600;
const gWidth = 600;

const app = document.querySelector('#app');

window.game = new game(app, gWidth, gHeight, nxC, nyC);

