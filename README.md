# Chess Notation Parser

An AWS Lambda project that processes handwritten chess notations from S3 bucket images using AWS Textract, converts them to Portable Game Notation (PGN) format, and stores the result in DynamoDB.

## Features

- **Textract Integration**: Extracts text from images containing chess notations.
- **PGN Conversion**: Converts extracted moves into PGN format.
- **Data Storage**: Saves games with metadata in DynamoDB.

## Project Structure

```plaintext
├── src                    # Source code
│   ├── handlers           # Lambda handler
│   └── utils              # Utilities for parsing and PGN generation
├── __tests__              # Tests
└── serverless.yml         # Serverless Framework configuration
```

Setup & Deployment

	1.	Install Dependencies:

        npm install

	2.	Build & Deploy:

        npm run deploy

Environment Variables

	•	S3_BUCKET_NAME: Stores images.
	•	DYNAMO_TABLE_NAME: Stores PGN data.
	•	TEXTRACT_REGION: AWS Textract region.

Testing

    Run tests locally:

        npm run test

Removal

    To remove deployed resources:

        npm run remove

License

ISC License.

Acknowledgments

	•	Uses AWS Textract for text extraction.
	•	Built with Serverless Framework for simplified deployment.