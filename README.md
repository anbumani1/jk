# 🎓 Intern Onboarding & Assistant Portal

A smart, AI-powered Intern Onboarding Portal built with SAP CAP and GenAI integration using OpenRouter GPT-4o.

## 🚀 Features

- **AI-Powered Assistant**: 24/7 intelligent support using OpenRouter GPT-4o API
- **Personalized Dashboard**: Customized onboarding experience based on department and role
- **Task Management**: Automated onboarding checklist with progress tracking
- **SAP Integration**: Built on SAP BTP with CAP (Cloud Application Programming Model)
- **Real-time Chat**: Interactive AI assistant for instant help
- **Progress Tracking**: Visual progress indicators and deadline management
- **Mobile Responsive**: Works seamlessly across all devices

## 🛠️ Tech Stack

- **Backend**: SAP CAP (Cloud Application Programming Model)
- **Database**: SAP HANA Cloud / SQLite (for development)
- **Frontend**: SAP Fiori Elements UI5
- **AI Integration**: OpenRouter GPT-4o API
- **Runtime**: Node.js
- **Platform**: SAP Business Technology Platform (BTP)

## 📁 Project Structure

```
intern-onboarding-portal/
├── app/                          # Frontend applications
│   ├── index.html               # Main portal landing page
│   └── intern-dashboard/        # Fiori dashboard app
│       └── webapp/
│           ├── controller/      # UI5 controllers
│           ├── view/           # UI5 views and fragments
│           ├── model/          # Data models
│           └── i18n/           # Internationalization
├── db/                          # Database schema and data
│   ├── schema.cds              # CDS data model
│   └── data/                   # Initial data (CSV files)
├── srv/                         # Service layer
│   ├── onboarding-service.cds  # Main OData service definition
│   ├── onboarding-service.js   # Service implementation
│   ├── genai-service.cds       # AI service definition
│   ├── genai-service.js        # AI service implementation
│   └── server.js               # Custom Express middleware
├── .env                         # Environment configuration
├── package.json                # Dependencies and scripts
└── index.js                    # Application entry point
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- SAP BTP trial account (optional for cloud deployment)
- OpenRouter API key (already configured)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd intern-onboarding-portal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   The `.env` file is already configured with your OpenRouter API key:
   ```
   OPENROUTER_API_KEY=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
   OPENROUTER_API_URL=https://openrouter.ai/api/v1/chat/completions
   PORT=4004
   ```

4. **Start the application**
   ```bash
   npm start
   ```

5. **Access the portal**
   - Main Portal: http://localhost:4004/app/
   - OData Services: http://localhost:4004/odata/v4/
   - GenAI API: http://localhost:4004/genai/query

## 🎯 Usage

### For Interns

1. **Access Dashboard**: Navigate to the intern dashboard to view your personalized onboarding progress
2. **AI Assistant**: Click "Ask AI Assistant" to get instant help with:
   - SAP system navigation
   - Company policies and procedures
   - Onboarding task guidance
   - Technical support questions
3. **Task Management**: Track your onboarding checklist and mark tasks as complete
4. **Training Guides**: Access comprehensive documentation and training materials

### For Administrators

1. **Intern Management**: Use OData services to manage intern records
2. **Task Templates**: Configure onboarding checklists via ChecklistTemplates entity
3. **Analytics**: Monitor intern progress and completion rates
4. **Content Management**: Update training guides and documentation

## 🤖 AI Assistant Features

The AI assistant is powered by OpenRouter GPT-4o and provides:

- **Contextual Responses**: Answers are personalized based on intern's department and progress
- **Multi-category Support**: Handles questions about SAP, HR, IT, and general topics
- **Chat History**: Maintains conversation context within sessions
- **Suggested Questions**: Provides relevant question suggestions based on current tasks
- **Confidence Scoring**: Shows AI confidence levels for transparency

### Example API Usage

```javascript
// Query the AI assistant
const response = await fetch('/genai/query', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    question: "How do I access SAP BTP?",
    internId: "intern-123",
    sessionId: "session-456"
  })
});

const data = await response.json();
console.log(data.data.answer); // AI response
```

## 📊 Data Model

### Core Entities

- **Interns**: Intern profiles with personal and professional information
- **Tasks**: Onboarding tasks with status tracking and deadlines
- **Guides**: Training materials and documentation
- **Queries**: AI chat history and interactions
- **ChecklistTemplates**: Configurable onboarding task templates

### Key Relationships

- Interns have many Tasks and Queries
- Tasks can reference Guides for additional information
- ChecklistTemplates are used to auto-generate Tasks for new interns

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `OPENROUTER_API_KEY` | OpenRouter API key for GPT-4o | Required |
| `OPENROUTER_API_URL` | OpenRouter API endpoint | https://openrouter.ai/api/v1/chat/completions |
| `PORT` | Application port | 4004 |
| `NODE_ENV` | Environment mode | development |

### Database Configuration

For development, the application uses SQLite. For production on SAP BTP:

```json
{
  "cds": {
    "requires": {
      "db": {
        "kind": "hana-cloud",
        "credentials": {
          "url": "your-hana-cloud-url"
        }
      }
    }
  }
}
```

## 🚀 Deployment to SAP BTP

### Prerequisites

- SAP BTP trial or productive account
- Cloud Foundry CLI
- SAP HANA Cloud instance

### Deployment Steps

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy to Cloud Foundry**
   ```bash
   cf push
   ```

3. **Bind services**
   ```bash
   cf bind-service intern-portal hana-service
   ```

## 🧪 Testing

### Manual Testing

1. **Start the server**: `npm start`
2. **Open browser**: Navigate to http://localhost:4004/app/
3. **Test AI Assistant**: Click "Test AI Assistant" button
4. **Verify OData**: Check http://localhost:4004/odata/v4/onboarding/

### API Testing

```bash
# Test GenAI endpoint
curl -X POST http://localhost:4004/genai/query \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What is SAP BTP?",
    "internId": "1",
    "sessionId": "test"
  }'

# Test OData service
curl http://localhost:4004/odata/v4/onboarding/Interns
```

## 🔒 Security

- **API Key Management**: OpenRouter API key is stored in environment variables
- **CORS Configuration**: Properly configured for frontend-backend communication
- **Input Validation**: All user inputs are validated before processing
- **Error Handling**: Comprehensive error handling with appropriate user feedback

## 📈 Future Enhancements

- [ ] **Advanced Analytics**: Detailed reporting and analytics dashboard
- [ ] **Mobile App**: Native mobile application for iOS and Android
- [ ] **Integration Hub**: Connect with more enterprise systems (HR, Learning Management)
- [ ] **Advanced AI**: Multi-modal AI support (voice, document analysis)
- [ ] **Workflow Automation**: Automated task assignment and notifications
- [ ] **Multi-language Support**: Internationalization for global teams

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- **Documentation**: Check this README and inline code comments
- **Issues**: Create an issue in the repository
- **SAP Community**: Post questions in SAP Community forums
- **OpenRouter**: Check OpenRouter documentation for AI-related issues

## 🙏 Acknowledgments

- **SAP**: For the excellent CAP framework and BTP platform
- **OpenRouter**: For providing access to GPT-4o API
- **UI5**: For the comprehensive frontend framework
- **Community**: For the open-source tools and libraries used

---

**Built with ❤️ for better intern onboarding experiences**
