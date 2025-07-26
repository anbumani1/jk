#!/usr/bin/env node

/**
 * Server startup script for Intern Onboarding Portal
 * This script starts the CAP server with proper error handling
 */

const cds = require('@sap/cds');
require('dotenv').config();

console.log('🚀 Starting Intern Onboarding Portal...\n');

// Set port from environment or default
const PORT = process.env.PORT || 4004;

// Configure CDS
cds.env.requires.db = {
  kind: 'sqlite',
  credentials: { url: 'db.sqlite' }
};

// Start the server
async function startServer() {
  try {
    console.log('📊 Initializing database...');
    
    // Deploy database schema
    await cds.deploy('db/schema.cds').to('sqlite:db.sqlite');
    console.log('✅ Database initialized');
    
    console.log('🔧 Starting services...');
    
    // Start the CAP server
    const server = await cds.serve('all').in('express').at(PORT);
    
    console.log(`\n🎉 Intern Onboarding Portal is running!`);
    console.log(`\n📱 Access the portal:`);
    console.log(`   Main Portal: http://localhost:${PORT}/app/`);
    console.log(`   Intern Dashboard: http://localhost:${PORT}/app/intern-dashboard/webapp/`);
    console.log(`\n🔗 API Endpoints:`);
    console.log(`   OData Services: http://localhost:${PORT}/odata/v4/`);
    console.log(`   GenAI API: http://localhost:${PORT}/genai/query`);
    console.log(`   Health Check: http://localhost:${PORT}/health`);
    console.log(`\n🤖 AI Assistant: Ready with OpenRouter GPT-4o`);
    console.log(`\n📚 Documentation: Check README.md for usage instructions`);
    console.log(`\n⏹️  Press Ctrl+C to stop the server`);
    
    return server;
    
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    console.error('\n🔧 Troubleshooting:');
    console.error('1. Check if port 4004 is available');
    console.error('2. Verify .env file configuration');
    console.error('3. Run: npm install');
    console.error('4. Check logs above for specific errors');
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n👋 Shutting down Intern Onboarding Portal...');
  console.log('✅ Server stopped gracefully');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n\n👋 Shutting down Intern Onboarding Portal...');
  console.log('✅ Server stopped gracefully');
  process.exit(0);
});

// Start the server
startServer();
