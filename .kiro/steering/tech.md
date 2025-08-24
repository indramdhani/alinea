# Technology Stack

## Frontend
- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS with monochrome design system
- **UI Components**: Radix UI primitives with shadcn/ui components
- **Icons**: Lucide React
- **Markdown**: ReactMarkdown for content rendering
- **Editor**: @uiw/react-md-editor for writing interface
- **HTTP Client**: Native fetch API
- **Internationalization**: Custom i18n with locale-based routing (English/Indonesian)
- **Hosting**: AWS Amplify

## Backend
- **Runtime**: Node.js 18.x
- **Framework**: AWS SAM (Serverless Application Model)
- **Functions**: AWS Lambda
- **Database**: DynamoDB with pay-per-request billing
- **API**: API Gateway with CORS enabled
- **Dependencies**: AWS SDK v3, UUID for ID generation

## Infrastructure
- **Cloud Provider**: AWS
- **Database**: DynamoDB with GSI for time-based queries
- **Storage**: S3 (for future file uploads)
- **CI/CD**: GitHub Actions
- **IaC**: AWS SAM templates (CloudFormation)

## Development Commands

### Frontend Development
```bash
cd frontend
npm install          # Install dependencies
npm run dev         # Start development server (localhost:3000)
npm run build       # Build for production
npm run start       # Start production server
npm run lint        # Run ESLint
```

### Backend Development
```bash
cd backend
sam build           # Build SAM application
sam local start-api # Start local API (localhost:3000)
sam deploy          # Deploy to AWS
```

## Environment Variables
- `NEXT_PUBLIC_API_URL`: Frontend API endpoint
- `ARTICLES_TABLE`: DynamoDB table name (backend)
- `CORS_ORIGIN`: CORS configuration (backend)