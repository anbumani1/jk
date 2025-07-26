const cds = require('@sap/cds');
require('dotenv').config();

// Set port from environment or default
const PORT = process.env.PORT || 4004;

// Start the CAP server
cds.serve('all').in('express').at(PORT).then(() => {
  console.log(`🚀 Intern Onboarding Portal started at http://localhost:${PORT}`);
  console.log(`📊 OData services available at http://localhost:${PORT}/odata/v4/`);
  console.log(`🤖 GenAI endpoint available at http://localhost:${PORT}/genai/query`);
  console.log(`📚 API documentation at http://localhost:${PORT}/$metadata`);
}).catch(console.error);
