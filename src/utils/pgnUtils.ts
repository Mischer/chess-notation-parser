import { Chess } from 'chess.js';

export const generatePGNFromMoves = (moves: string[]): string => {
    const chess = new Chess();
    moves.forEach(move => chess.move(move));
    return chess.pgn();
};

export const parseChessMoves = (text: string): string[] => {
    const moveRegex = /(?:^|[^a-zA-Z0-9_])(O-O(?:-O)?|[KQRBN]?(?:[a-h1-8]{0,2})?x?[a-h][1-8](?:=[QRBN])?[+#]?)(?=[^a-zA-Z0-9_]|$)/g;
    const moves = [];
    let match;

    while ((match = moveRegex.exec(text)) !== null) {
        moves.push(match[1]);
    }

    return moves;
};


