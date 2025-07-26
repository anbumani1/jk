const cds = require('@sap/cds');
const express = require('express');
require('dotenv').config();

// Custom Express middleware for GenAI REST endpoint
cds.on('bootstrap', (app) => {
  
  // Enable CORS for frontend integration
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
    } else {
      next();
    }
  });
  
  // REST endpoint for GenAI queries
  app.post('/genai/query', async (req, res) => {
    try {
      const { question, internId, sessionId } = req.body;
      
      if (!question || !internId) {
        return res.status(400).json({
          error: 'Missing required fields: question and internId'
        });
      }
      
      // Get the GenAI service
      const genaiService = await cds.connect.to('GenAIService');
      
      // Call the AI query action
      const result = await genaiService.run(
        'queryAI',
        {
          question,
          internId,
          sessionId: sessionId || `session_${Date.now()}`
        }
      );
      
      res.json({
        success: true,
        data: result
      });
      
    } catch (error) {
      console.error('GenAI REST endpoint error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Internal server error'
      });
    }
  });
  
  // REST endpoint to get chat history
  app.get('/genai/history/:internId/:sessionId?', async (req, res) => {
    try {
      const { internId, sessionId } = req.params;
      
      const genaiService = await cds.connect.to('GenAIService');
      
      const history = await genaiService.run(
        'getChatHistory',
        {
          internId,
          sessionId: sessionId || null
        }
      );
      
      res.json({
        success: true,
        data: history
      });
      
    } catch (error) {
      console.error('Chat history endpoint error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Internal server error'
      });
    }
  });
  
  // REST endpoint to get suggested questions
  app.get('/genai/suggestions/:internId', async (req, res) => {
    try {
      const { internId } = req.params;
      
      const genaiService = await cds.connect.to('GenAIService');
      
      const suggestions = await genaiService.run(
        'getSuggestedQuestions',
        { internId }
      );
      
      res.json({
        success: true,
        data: suggestions
      });
      
    } catch (error) {
      console.error('Suggestions endpoint error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Internal server error'
      });
    }
  });
  
  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    });
  });
  
});

module.exports = cds.server;
