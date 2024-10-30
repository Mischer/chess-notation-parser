import { S3Event, APIGatewayProxyResult } from 'aws-lambda';
import * as AWS from 'aws-sdk';
import { generatePGNFromMoves, parseChessMoves } from '../utils/pgnUtils';

const textract = new AWS.Textract({ region: process.env.TEXTRACT_REGION });
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME!;
const DYNAMO_TABLE_NAME = process.env.DYNAMO_TABLE_NAME!;

export const handler = async (event: S3Event): Promise<APIGatewayProxyResult> => {
    const record = event.Records[0];
    const bucket = record.s3.bucket.name;
    const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '));

    try {
        const textractResponse = await textract.detectDocumentText({
            Document: { S3Object: { Bucket: bucket, Name: key } }
        }).promise();

        const text = textractResponse.Blocks
            ?.filter(block => block.BlockType === 'LINE')
            .map(block => block.Text)
            .join(' ') || '';
        console.log("Parsed text:", text);

        const moves = parseChessMoves(text);
        if (!moves || moves.length === 0) {
            return { statusCode: 400, body: JSON.stringify({ message: "No valid chess moves found" }) };
        }

        const pgn = generatePGNFromMoves(moves);

        const gameData = {
            gameId: Date.now().toString(),
            pgn,
            date: new Date().toISOString(),
            moves,
            sourceImage: `s3://${bucket}/${key}`
        };

        await dynamoDb.put({
            TableName: DYNAMO_TABLE_NAME,
            Item: gameData
        }).promise();

        return { statusCode: 200, body: JSON.stringify({ message: "PGN file generated and saved", gameId: gameData.gameId }) };

    } catch (error) {
        console.error("Error processing chess notation:", error);
        return { statusCode: 500, body: JSON.stringify({ message: "Internal server error", error }) };
    }
};

