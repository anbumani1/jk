using { intern.onboarding as db } from '../db/schema';

service GenAIService {
  
  // Action to handle AI queries
  action queryAI(
    question: String,
    internId: String,
    sessionId: String
  ) returns {
    answer: String;
    confidence: Decimal(3,2);
    queryId: String;
  };
  
  // Function to get chat history for an intern
  function getChatHistory(internId: String, sessionId: String) returns array of {
    id: String;
    question: String;
    answer: String;
    timestamp: DateTime;
    confidence: Decimal(3,2);
  };
  
  // Function to get suggested questions based on intern's progress
  function getSuggestedQuestions(internId: String) returns array of {
    question: String;
    category: String;
  };
}
