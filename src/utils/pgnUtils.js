"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePGNFromMoves = void 0;
var chess_js_1 = require("chess.js");
var generatePGNFromMoves = function (moves) {
    var chess = new chess_js_1.Chess();
    moves.forEach(function (move) { return chess.move(move); });
    return chess.pgn();
};
exports.generatePGNFromMoves = generatePGNFromMoves;
