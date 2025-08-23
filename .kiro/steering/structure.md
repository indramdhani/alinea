# Project Structure

## Root Directory
```
├── frontend/          # Next.js application
├── backend/           # AWS SAM serverless backend
├── .github/           # GitHub Actions workflows
├── .kiro/             # Kiro IDE configuration and steering
└── README.md          # Project documentation
```

## Frontend Structure (`frontend/`)
```
├── app/               # Next.js App Router
│   ├── globals.css    # Global styles and CSS variables
│   ├── layout.tsx     # Root layout with navigation
│   ├── page.tsx       # Home page (article browsing)
│   ├── write/         # Article writing page
│   └── disclaimer/    # Legal disclaimer page
├── components/        # Reusable UI components
│   └── ui/           # shadcn/ui component library
├── lib/              # Utility functions
│   └── utils.ts      # Tailwind class merging utilities
├── package.json      # Dependencies and scripts
├── tailwind.config.js # Tailwind CSS configuration
└── tsconfig.json     # TypeScript configuration
```

## Backend Structure (`backend/`)
```
├── src/
│   ├── articles.js   # Lambda function handlers
│   └── package.json  # Backend dependencies
└── template.yaml     # SAM template (infrastructure as code)
```

## Code Organization Patterns

### Frontend Components
- Use TypeScript for all components
- Follow shadcn/ui patterns for component structure
- Place reusable UI components in `components/ui/`
- Use Tailwind classes with the `cn()` utility for conditional styling
- Implement proper TypeScript interfaces for props and data

### API Integration
- Use environment variables for API endpoints (`NEXT_PUBLIC_API_URL`)
- Handle loading and error states consistently
- Use async/await for API calls with proper error handling
- Update local state optimistically for better UX

### Backend Functions
- Each Lambda function handles one specific operation
- Use consistent error handling and CORS headers
- Follow DynamoDB best practices (use UpdateExpression for atomic updates)
- Return proper HTTP status codes and JSON responses

### File Naming Conventions
- Use kebab-case for directories (`write/`, `disclaimer/`)
- Use PascalCase for React components (`Button.tsx`, `Card.tsx`)
- Use camelCase for JavaScript/TypeScript files (`articles.js`, `utils.ts`)
- Use lowercase for configuration files (`package.json`, `template.yaml`)