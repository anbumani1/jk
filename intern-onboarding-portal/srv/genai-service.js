const cds = require('@sap/cds');
const axios = require('axios');
require('dotenv').config();

class GenAIService extends cds.ApplicationService {
  
  async init() {
    
    // Handle AI query action
    this.on('queryAI', async (req) => {
      try {
        const { question, internId, sessionId } = req.data;
        
        // Get intern context for personalized responses
        const intern = await SELECT.one.from('intern.onboarding.Interns').where({ ID: internId });
        const tasks = await SELECT.from('intern.onboarding.Tasks').where({ intern_ID: internId });
        
        // Build context for AI
        const context = this.buildContext(intern, tasks);
        
        // Call OpenRouter API
        const aiResponse = await this.callOpenRouterAPI(question, context);
        
        // Save query to database
        const queryRecord = await INSERT.into('intern.onboarding.Queries').entries({
          question: question,
          answer: aiResponse.answer,
          category: aiResponse.category || 'General',
          confidence: aiResponse.confidence || 0.8,
          isResolved: true,
          sessionId: sessionId,
          intern_ID: internId
        });
        
        return {
          answer: aiResponse.answer,
          confidence: aiResponse.confidence || 0.8,
          queryId: queryRecord.ID
        };
        
      } catch (error) {
        console.error('Error in queryAI:', error);
        throw new Error('Failed to process AI query: ' + error.message);
      }
    });
    
    // Handle chat history retrieval
    this.on('getChatHistory', async (req) => {
      try {
        const { internId, sessionId } = req.data;
        
        const queries = await SELECT.from('intern.onboarding.Queries')
          .where({ intern_ID: internId, sessionId: sessionId })
          .orderBy('createdAt desc')
          .limit(20);
        
        return queries.map(q => ({
          id: q.ID,
          question: q.question,
          answer: q.answer,
          timestamp: q.createdAt,
          confidence: q.confidence
        }));
        
      } catch (error) {
        console.error('Error getting chat history:', error);
        throw new Error('Failed to retrieve chat history');
      }
    });
    
    // Handle suggested questions
    this.on('getSuggestedQuestions', async (req) => {
      try {
        const { internId } = req.data;
        
        const intern = await SELECT.one.from('intern.onboarding.Interns').where({ ID: internId });
        const pendingTasks = await SELECT.from('intern.onboarding.Tasks')
          .where({ intern_ID: internId, status: 'Pending' });
        
        // Generate contextual suggestions based on intern's current state
        const suggestions = this.generateSuggestions(intern, pendingTasks);
        
        return suggestions;
        
      } catch (error) {
        console.error('Error getting suggested questions:', error);
        return [];
      }
    });
    
    await super.init();
  }
  
  // Build context for AI based on intern data
  buildContext(intern, tasks) {
    const pendingTasks = tasks.filter(t => t.status === 'Pending');
    const completedTasks = tasks.filter(t => t.status === 'Completed');
    
    return `
You are an AI assistant helping ${intern.firstName} ${intern.lastName}, an intern in the ${intern.department} department.
Intern started on: ${intern.startDate}
Current status: ${intern.status}

Pending tasks (${pendingTasks.length}):
${pendingTasks.map(t => `- ${t.title}: ${t.description}`).join('\n')}

Completed tasks (${completedTasks.length}):
${completedTasks.map(t => `- ${t.title}`).join('\n')}

Please provide helpful, accurate, and encouraging responses related to:
- SAP systems and processes
- Company onboarding procedures
- Task completion guidance
- General workplace questions
- Technical support for development tasks

Keep responses concise but informative, and always maintain a supportive tone.
    `.trim();
  }
  
  // Call OpenRouter API with GPT-4o
  async callOpenRouterAPI(question, context) {
    try {
      const response = await axios.post(
        process.env.OPENROUTER_API_URL,
        {
          model: "openai/gpt-4o",
          messages: [
            {
              role: "system",
              content: context
            },
            {
              role: "user",
              content: question
            }
          ],
          max_tokens: 500,
          temperature: 0.7
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'http://localhost:4004',
            'X-Title': 'Intern Onboarding Portal'
          }
        }
      );
      
      const aiAnswer = response.data.choices[0].message.content;
      
      // Determine category based on question content
      const category = this.categorizeQuestion(question);
      
      return {
        answer: aiAnswer,
        confidence: 0.85, // Could be enhanced with actual confidence scoring
        category: category
      };
      
    } catch (error) {
      console.error('OpenRouter API Error:', error.response?.data || error.message);
      
      // Fallback response
      return {
        answer: "I'm sorry, I'm currently unable to process your question. Please try again later or contact your mentor for assistance.",
        confidence: 0.1,
        category: 'Error'
      };
    }
  }
  
  // Categorize questions for better organization
  categorizeQuestion(question) {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('sap') || lowerQuestion.includes('btp') || lowerQuestion.includes('fiori')) {
      return 'SAP';
    } else if (lowerQuestion.includes('hr') || lowerQuestion.includes('benefits') || lowerQuestion.includes('policy')) {
      return 'HR';
    } else if (lowerQuestion.includes('it') || lowerQuestion.includes('computer') || lowerQuestion.includes('software')) {
      return 'IT';
    } else if (lowerQuestion.includes('task') || lowerQuestion.includes('assignment') || lowerQuestion.includes('project')) {
      return 'Tasks';
    } else {
      return 'General';
    }
  }
  
  // Generate contextual question suggestions
  generateSuggestions(intern, pendingTasks) {
    const suggestions = [
      { question: "What are my next steps in the onboarding process?", category: "General" },
      { question: "How do I access SAP systems?", category: "SAP" },
      { question: "Who should I contact for IT support?", category: "IT" },
      { question: "What are the company's core values?", category: "General" }
    ];
    
    // Add task-specific suggestions
    if (pendingTasks.length > 0) {
      const nextTask = pendingTasks[0];
      suggestions.unshift({
        question: `How do I complete: ${nextTask.title}?`,
        category: "Tasks"
      });
    }
    
    // Add department-specific suggestions
    if (intern.department === 'IT') {
      suggestions.push({
        question: "What development tools should I be familiar with?",
        category: "IT"
      });
    }
    
    return suggestions;
  }
}

module.exports = GenAIService;
