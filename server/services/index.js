/**
 * Service Registration
 * 
 * This file registers all services with the dependency injection container.
 * It configures service instances and their dependencies.
 */

const OpenAI = require('openai');
const Anthropic = require('@anthropic-ai/sdk');
const User = require('../models/User.js');
const { generatePasswordHash, validatePassword } = require('../utils/password.js');
const container = require('./container');
const UserService = require('./userService');
const LLMService = require('./llmService');

// Register User Service
container.register('userService', () => {
  const passwordUtils = {
    generatePasswordHash,
    validatePassword
  };
  return new UserService(User, passwordUtils);
});

// Register LLM Service
container.register('llmService', () => {
  const config = {
    maxRetries: 3,
    retryDelay: 1000
  };
  
  const providers = {
    openai: new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    }),
    anthropic: new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    })
  };
  
  return new LLMService(config, providers);
});

module.exports = container;