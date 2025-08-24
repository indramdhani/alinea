# Anonymous Article Sharing Platform

A privacy-first platform where users can anonymously write and share articles, stories, poems, and notes without requiring login or account creation. Built with modern web technologies and a monochrome design system for distraction-free reading and writing.

## ✨ Features

### Core Functionality
- **Rich Markdown Editor**: Full-featured editor with live preview using @uiw/react-md-editor
- **Random Article Discovery**: Discover content through randomized article browsing
- **Social Engagement**: Like, view, and share articles with real-time metrics
- **Tag System**: Organize content with customizable tags (up to 10 per article)
- **No Authentication**: Completely anonymous - no accounts, tracking, or personal data collection
- **Report Abuse System**: Built-in content reporting mechanism for community safety

### User Experience
- **Internationalization**: Full support for English and Indonesian languages with locale-based routing
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Monochrome Theme**: Clean, distraction-free interface with light/dark mode support
- **Accessibility**: Built with Radix UI primitives for screen reader compatibility
- **Progressive Enhancement**: Works without JavaScript for basic functionality
- **Native Sharing**: Web Share API integration with clipboard fallback

### Content Management
- **Markdown Support**: Full Markdown rendering with ReactMarkdown
- **Character Limits**: 200 character title limit with real-time counter
- **Content Validation**: Client and server-side validation
- **Legal Framework**: Comprehensive disclaimer and terms of service in multiple languages

## 🏗️ Architecture

### Frontend Stack
- **Framework**: Next.js 14 with TypeScript and App Router
- **Styling**: Tailwind CSS with custom monochrome design system
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Icons**: Lucide React for consistent iconography
- **Markdown**: ReactMarkdown for content rendering, @uiw/react-md-editor for writing
- **Internationalization**: Custom i18n implementation with locale-based routing (English/Indonesian)
- **Theme**: Custom theme provider with system/light/dark mode support
- **Deployment**: Static export optimized for AWS Amplify

### Backend Stack
- **Runtime**: Node.js 22.x on AWS Lambda (ARM64 architecture)
- **Framework**: AWS SAM (Serverless Application Model)
- **Database**: DynamoDB with pay-per-request billing and GSI for time-based queries
- **API**: REST API via API Gateway with full CORS support
- **Dependencies**: AWS SDK v3, UUID for ID generation

### Infrastructure
- **Cloud Provider**: AWS
- **Database**: DynamoDB with Global Secondary Index for efficient queries
- **API Gateway**: RESTful endpoints with CORS configuration
- **CI/CD**: GitHub Actions for automated deployment
- **IaC**: CloudFormation templates via AWS SAM

## 📁 Project Structure

```
├── frontend/                    # Next.js application
│   ├── app/                    # App Router structure
│   │   ├── [locale]/          # Internationalized routes
│   │   │   ├── page.tsx       # Home page (article browsing)
│   │   │   ├── write/         # Article creation
│   │   │   ├── disclaimer/    # Legal terms
│   │   │   └── layout.tsx     # Localized layout with navigation
│   │   ├── globals.css        # Global styles and CSS variables
│   │   └── layout.tsx         # Root layout
│   ├── components/            # Reusable UI components
│   │   ├── ui/               # shadcn/ui component library
│   │   ├── language-switcher.tsx  # Language selection
│   │   ├── tag-input.tsx     # Tag management component
│   │   └── theme-provider.tsx # Dark/light theme management
│   ├── lib/                  # Utility functions
│   │   ├── i18n.ts          # Internationalization utilities
│   │   └── utils.ts         # Tailwind class merging
│   ├── messages/            # Translation files
│   │   ├── en.json         # English translations
│   │   └── id.json         # Indonesian translations
│   └── package.json        # Dependencies and scripts
├── backend/                 # AWS SAM serverless backend
│   ├── src/
│   │   ├── articles.js     # Lambda function handlers
│   │   └── package.json    # Backend dependencies
│   └── template.yaml       # SAM template (Infrastructure as Code)
├── .github/                # GitHub Actions workflows
├── .kiro/                  # Kiro IDE configuration and steering
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or later
- AWS CLI configured (for backend deployment)
- AWS SAM CLI (for local backend development)

### Frontend Development
```bash
cd frontend
npm install                 # Install dependencies
npm run dev                # Start development server (localhost:3000)
npm run build              # Build for production
npm run start              # Start production server
npm run lint               # Run ESLint
```

### Backend Development
```bash
cd backend
sam build                  # Build SAM application
sam local start-api        # Start local API (localhost:3000)
sam deploy                 # Deploy to AWS
```

### Environment Configuration
Create a `.env.local` file in the frontend directory:
```bash
NEXT_PUBLIC_API_URL=http://localhost:3000  # For local development
# or
NEXT_PUBLIC_API_URL=https://your-api-gateway-url.amazonaws.com/Prod  # For production
```

## 🌐 API Endpoints

### Articles API
- `POST /articles` - Create new article
- `GET /articles/random` - Get random articles (up to 10)
- `POST /articles/{id}/like` - Like an article
- `POST /articles/{id}/share` - Increment share count
- `POST /articles/{id}/view` - Increment view count

### Request/Response Examples

#### Create Article
```bash
POST /articles
Content-Type: application/json

{
  "title": "My Anonymous Story",
  "content": "# Hello World\n\nThis is my story...",
  "tags": ["story", "personal", "thoughts"]
}
```

#### Response
```json
{
  "id": "uuid-here",
  "title": "My Anonymous Story",
  "content": "# Hello World\n\nThis is my story...",
  "tags": ["story", "personal", "thoughts"],
  "createdAt": "2024-01-01T00:00:00.000Z",
  "likes": 0,
  "views": 0,
  "shares": 0
}
```

## 🌍 Internationalization

The platform supports multiple languages with locale-based routing:

- **English**: `/` or `/en/`
- **Indonesian**: `/id/`

### Adding New Languages
1. Add locale to `frontend/lib/i18n.ts`
2. Create translation file in `frontend/messages/{locale}.json`
3. Update `generateStaticParams` in layout files

## 🎨 Design System

### Monochrome Theme
- **Light Mode**: Clean whites and grays for distraction-free reading
- **Dark Mode**: Deep blacks and subtle grays for comfortable night reading
- **Typography**: Inter font family for optimal readability
- **Components**: Consistent spacing and interaction patterns

### CSS Variables
All colors are defined as HSL values in CSS custom properties, enabling easy theme switching and customization.

## 🚀 Deployment

### Automated Deployment
The application uses GitHub Actions for continuous deployment:

1. **Frontend**: Automatically deployed to AWS Amplify on push to main
2. **Backend**: Deployed via AWS SAM CLI with CloudFormation

### Manual Deployment

#### Frontend (AWS Amplify)
```bash
cd frontend
npm run build
# Upload dist/ folder to AWS Amplify
```

#### Backend (AWS SAM)
```bash
cd backend
sam build
sam deploy --guided  # First time only
sam deploy           # Subsequent deployments
```

## 🔒 Privacy & Security

- **No User Tracking**: No analytics, cookies, or personal data collection
- **Anonymous by Design**: No user accounts or authentication required
- **CORS Protection**: Properly configured CORS headers
- **Input Validation**: Client and server-side content validation
- **Rate Limiting**: Built-in AWS API Gateway throttling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For issues and questions:
1. Check existing GitHub Issues
2. Create a new issue with detailed description
3. Include steps to reproduce for bugs

---

**Built for anonymous expression. No accounts, no tracking, just pure creativity.**