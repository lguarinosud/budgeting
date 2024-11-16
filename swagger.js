const swaggerAutogen = require('swagger-autogen')();
const dotenv = require('dotenv');
dotenv.config();

const HOST = process.env.HOST || 'localhost:3000';
const schemes = HOST === 'localhost:3000' ? ['http'] : ['https'];

const doc = {
  info: {
    title: 'Contact API',
    description: 'To interact with my contacts DB'
  },
  host: HOST, // Taken from .env in local and from environment variables in render.com
  schemes: schemes, // local http, render https
  basePath: '/',
  paths: {
    '/': {
      get: {
        description: 'Main route of the API',
        responses: {
          200: {
            description: 'OK'
          }
        }
      }
    }
  }
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./server.js'];

console.log('API running on HOST:', `${schemes}://${doc.host} `);

swaggerAutogen(outputFile, endpointsFiles, doc);
