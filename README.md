# Anonymous Article Sharing Platform

A platform where users can anonymously write and share articles, stories, poems, and notes without requiring login or account creation.

## Features

- Rich text/Markdown editor for writing content
- Random article discovery
- Social media sharing
- Article metrics (likes, visits, shares)
- No authentication required

## Architecture

- **Frontend**: Next.js hosted on AWS Amplify
- **Backend**: AWS SAM (Serverless Application Model)
- **Database**: DynamoDB for articles and metrics
- **Storage**: S3 for any file uploads
- **CI/CD**: GitHub Actions

## Project Structure

```
├── frontend/          # Next.js application
├── backend/           # AWS SAM serverless backend
├── .github/           # GitHub Actions workflows
└── README.md
```

## Getting Started

### Frontend Development
```bash
cd frontend
npm install
npm run dev
```

### Backend Development
```bash
cd backend
sam build
sam local start-api
```

## Deployment

The application is automatically deployed via GitHub Actions:
- Frontend to AWS Amplify
- Backend via AWS SAM CLI