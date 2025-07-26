# 🚀 Deployment Guide - Intern Onboarding Portal

This guide provides step-by-step instructions for deploying the Intern Onboarding Portal to various environments.

## 📋 Prerequisites

- Node.js v18 or higher
- SAP BTP account (for cloud deployment)
- OpenRouter API key (already configured)
- Git (for version control)

## 🏠 Local Development

### Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Run setup verification**
   ```bash
   npm test
   ```

3. **Start the server**
   ```bash
   npm start
   ```

4. **Access the application**
   - Main Portal: http://localhost:4004/app/
   - Intern Dashboard: http://localhost:4004/app/intern-dashboard/webapp/
   - API Documentation: http://localhost:4004/$metadata

### Development Commands

```bash
# Start with auto-reload (development)
npm run watch

# Run setup tests
npm run test:setup

# Build for production
npm run build

# Deploy database schema
npm run deploy
```

## ☁️ SAP BTP Deployment

### Step 1: Prepare for Cloud Deployment

1. **Install CF CLI**
   ```bash
   # Download from https://github.com/cloudfoundry/cli/releases
   cf --version
   ```

2. **Login to SAP BTP**
   ```bash
   cf login -a https://api.cf.us10.hana.ondemand.com
   # Enter your SAP BTP credentials
   ```

3. **Target your space**
   ```bash
   cf target -o your-org -s your-space
   ```

### Step 2: Configure for Cloud

1. **Create manifest.yml**
   ```yaml
   applications:
   - name: intern-onboarding-portal
     memory: 512M
     disk_quota: 1G
     instances: 1
     buildpacks:
       - nodejs_buildpack
     env:
       NODE_ENV: production
       OPENROUTER_API_KEY: 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
   ```

2. **Update package.json for cloud**
   ```json
   {
     "engines": {
       "node": ">=18.0.0",
       "npm": ">=8.0.0"
     }
   }
   ```

### Step 3: Create HANA Cloud Service

1. **Create HANA Cloud instance**
   ```bash
   cf create-service hana-cloud hana intern-portal-db
   ```

2. **Wait for service creation**
   ```bash
   cf service intern-portal-db
   ```

### Step 4: Deploy Application

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy to Cloud Foundry**
   ```bash
   cf push
   ```

3. **Bind database service**
   ```bash
   cf bind-service intern-onboarding-portal intern-portal-db
   ```

4. **Restart application**
   ```bash
   cf restart intern-onboarding-portal
   ```

### Step 5: Verify Deployment

1. **Check application status**
   ```bash
   cf apps
   ```

2. **View logs**
   ```bash
   cf logs intern-onboarding-portal --recent
   ```

3. **Test the application**
   ```bash
   cf app intern-onboarding-portal
   # Note the URL and test in browser
   ```

## 🔧 Environment Configuration

### Production Environment Variables

```bash
# Required
OPENROUTER_API_KEY=your-api-key
OPENROUTER_API_URL=https://openrouter.ai/api/v1/chat/completions

# Optional
NODE_ENV=production
PORT=4004
LOG_LEVEL=info
```

### Database Configuration

For production, update `package.json`:

```json
{
  "cds": {
    "requires": {
      "db": {
        "kind": "hana-cloud"
      }
    }
  }
}
```

## 🧪 Testing Deployment

### Health Checks

```bash
# Test health endpoint
curl https://your-app-url.cfapps.us10.hana.ondemand.com/health

# Test OData services
curl https://your-app-url.cfapps.us10.hana.ondemand.com/odata/v4/onboarding/

# Test GenAI endpoint
curl -X POST https://your-app-url.cfapps.us10.hana.ondemand.com/genai/query \
  -H "Content-Type: application/json" \
  -d '{"question":"Hello","internId":"1","sessionId":"test"}'
```

### Load Testing

```bash
# Install artillery for load testing
npm install -g artillery

# Run load test
artillery quick --count 10 --num 5 https://your-app-url.cfapps.us10.hana.ondemand.com/health
```

## 🔒 Security Considerations

### API Key Management

- Store API keys in environment variables
- Use SAP BTP User-Provided Services for sensitive data
- Rotate API keys regularly

### Network Security

- Configure proper CORS settings
- Use HTTPS in production
- Implement rate limiting for API endpoints

### Data Protection

- Encrypt sensitive data at rest
- Implement proper access controls
- Regular security audits

## 📊 Monitoring & Logging

### Application Logs

```bash
# View real-time logs
cf logs intern-onboarding-portal

# Download recent logs
cf logs intern-onboarding-portal --recent > app-logs.txt
```

### Performance Monitoring

- Monitor response times
- Track API usage
- Monitor database performance
- Set up alerts for errors

## 🔄 CI/CD Pipeline

### GitHub Actions Example

```yaml
name: Deploy to SAP BTP
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm test
      - run: npm run build
      - name: Deploy to CF
        run: |
          cf login -a ${{ secrets.CF_API }} -u ${{ secrets.CF_USER }} -p ${{ secrets.CF_PASSWORD }}
          cf push
```

## 🆘 Troubleshooting

### Common Issues

1. **Application won't start**
   - Check environment variables
   - Verify database connection
   - Review application logs

2. **GenAI API not working**
   - Verify OpenRouter API key
   - Check network connectivity
   - Review API rate limits

3. **Database connection issues**
   - Verify HANA Cloud service status
   - Check service bindings
   - Review connection credentials

### Support Resources

- SAP BTP Documentation
- SAP Community Forums
- OpenRouter API Documentation
- GitHub Issues

---

**Happy Deploying! 🚀**
