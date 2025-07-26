#!/usr/bin/env node

/**
 * Test script to verify the Intern Onboarding Portal setup
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Intern Onboarding Portal Setup...\n');

// Test 1: Check if all required files exist
console.log('📁 Checking file structure...');
const requiredFiles = [
  'package.json',
  '.env',
  'index.js',
  'db/schema.cds',
  'srv/onboarding-service.cds',
  'srv/onboarding-service.js',
  'srv/genai-service.cds',
  'srv/genai-service.js',
  'srv/server.js',
  'app/index.html',
  'app/intern-dashboard/webapp/index.html'
];

let allFilesExist = true;
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    allFilesExist = false;
  }
});

if (!allFilesExist) {
  console.log('\n❌ Some required files are missing. Please check the setup.');
  process.exit(1);
}

// Test 2: Check environment configuration
console.log('\n🔧 Checking environment configuration...');
require('dotenv').config();

const requiredEnvVars = [
  'OPENROUTER_API_KEY',
  'OPENROUTER_API_URL'
];

let allEnvVarsSet = true;
requiredEnvVars.forEach(envVar => {
  if (process.env[envVar]) {
    console.log(`✅ ${envVar} is set`);
  } else {
    console.log(`❌ ${envVar} is missing`);
    allEnvVarsSet = false;
  }
});

if (!allEnvVarsSet) {
  console.log('\n❌ Some environment variables are missing. Please check .env file.');
  process.exit(1);
}

// Test 3: Check package.json dependencies
console.log('\n📦 Checking dependencies...');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const requiredDeps = ['@sap/cds', 'express', 'axios', 'dotenv'];

let allDepsPresent = true;
requiredDeps.forEach(dep => {
  if (packageJson.dependencies && packageJson.dependencies[dep]) {
    console.log(`✅ ${dep} v${packageJson.dependencies[dep]}`);
  } else {
    console.log(`❌ ${dep} is missing`);
    allDepsPresent = false;
  }
});

if (!allDepsPresent) {
  console.log('\n❌ Some dependencies are missing. Run: npm install');
  process.exit(1);
}

// Test 4: Validate CDS schema
console.log('\n📊 Validating CDS schema...');
const schemaContent = fs.readFileSync('db/schema.cds', 'utf8');
const requiredEntities = ['Interns', 'Tasks', 'Guides', 'Queries', 'ChecklistTemplates'];

let allEntitiesPresent = true;
requiredEntities.forEach(entity => {
  if (schemaContent.includes(`entity ${entity}`)) {
    console.log(`✅ Entity ${entity} found`);
  } else {
    console.log(`❌ Entity ${entity} missing`);
    allEntitiesPresent = false;
  }
});

if (!allEntitiesPresent) {
  console.log('\n❌ Some entities are missing from schema.cds');
  process.exit(1);
}

// Test 5: Check data files
console.log('\n📄 Checking initial data files...');
const dataFiles = [
  'db/data/intern.onboarding-ChecklistTemplates.csv',
  'db/data/intern.onboarding-Guides.csv',
  'db/data/intern.onboarding-Interns.csv'
];

let allDataFilesExist = true;
dataFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    allDataFilesExist = false;
  }
});

if (!allDataFilesExist) {
  console.log('\n❌ Some data files are missing.');
  process.exit(1);
}

console.log('\n🎉 All setup checks passed!');
console.log('\n📋 Next steps:');
console.log('1. Run: npm start');
console.log('2. Open: http://localhost:4004/app/');
console.log('3. Test the AI Assistant');
console.log('4. Explore the Intern Dashboard');

console.log('\n🔗 Useful URLs:');
console.log('- Main Portal: http://localhost:4004/app/');
console.log('- OData Services: http://localhost:4004/odata/v4/');
console.log('- Health Check: http://localhost:4004/health');
console.log('- GenAI API: http://localhost:4004/genai/query (POST)');

console.log('\n✨ Setup verification complete!');
