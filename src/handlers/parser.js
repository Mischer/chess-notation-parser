"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
var AWS = require("aws-sdk");
var pgnGenerator_1 = require("../utils/pgnGenerator");
var textract = new AWS.Textract();
var dynamoDb = new AWS.DynamoDB.DocumentClient();
var S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;
var DYNAMO_TABLE_NAME = process.env.DYNAMO_TABLE_NAME;
var handler = function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var record, bucket, key, textractResponse, text, moves, pgn, gameData, error_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                record = event.Records[0];
                bucket = record.s3.bucket.name;
                key = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '));
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                return [4 /*yield*/, textract.detectDocumentText({
                        Document: { S3Object: { Bucket: bucket, Name: key } }
                    }).promise()];
            case 2:
                textractResponse = _b.sent();
                text = ((_a = textractResponse.Blocks) === null || _a === void 0 ? void 0 : _a.filter(function (block) { return block.BlockType === 'LINE'; }).map(function (block) { return block.Text; }).join(' ')) || '';
                moves = parseChessMoves(text);
                if (!moves || moves.length === 0) {
                    return [2 /*return*/, { statusCode: 400, body: JSON.stringify({ message: "No valid chess moves found" }) }];
                }
                pgn = (0, pgnGenerator_1.generatePGNFromMoves)(moves);
                gameData = {
                    gameId: Date.now().toString(),
                    pgn: pgn,
                    date: new Date().toISOString(),
                    moves: moves,
                    sourceImage: "s3://".concat(bucket, "/").concat(key)
                };
                return [4 /*yield*/, dynamoDb.put({
                        TableName: DYNAMO_TABLE_NAME,
                        Item: gameData
                    }).promise()];
            case 3:
                _b.sent();
                return [2 /*return*/, { statusCode: 200, body: JSON.stringify({ message: "PGN file generated and saved", gameId: gameData.gameId }) }];
            case 4:
                error_1 = _b.sent();
                console.error("Error processing chess notation:", error_1);
                return [2 /*return*/, { statusCode: 500, body: JSON.stringify({ message: "Internal server error", error: error_1 }) }];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.handler = handler;
// Вспомогательная функция для парсинга шахматных ходов
var parseChessMoves = function (text) {
    var moveRegex = /([a-h][1-8])([a-h][1-8])/g;
    var moves = [];
    var match;
    while ((match = moveRegex.exec(text)) !== null) {
        moves.push(match[0]);
    }
    return moves;
};
