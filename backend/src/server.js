require('module-alias/register');
// const serverless = require('serverless-http');
const mongoose = require('mongoose');
const { globSync } = require('glob');
const path = require('path');

// Make sure we are running node 7.6+
const [major, minor] = process.versions.node.split('.').map(parseFloat);
if (major < 20) {
  console.warn('Please upgrade your node.js version at least 20 or greater. 👌\n ');
  // process.exit();
}

// import environmental variables from our variables.env file
if (process.env.NODE_ENV != 'production') {
  require('dotenv').config({ path: '.env' });
  require('dotenv').config({ path: '.env.local' });
}

mongoose.connect(process.env.DATABASE);

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

mongoose.connection.on('error', (error) => {
  console.log(
    `1. 🔥 Common Error caused issue → : check your .env file first and add your mongodb url`
  );
  console.error(`2. 🚫 Error → : ${error.message}`);
});

const modelsFiles = globSync('./src/models/**/*.js');

for (const filePath of modelsFiles) {
  try {
    require(path.resolve(filePath));
  } catch (error) {
    console.error(`❌ Failed to load model at ${filePath}`, error);
  }
}
// Start our app!

const app = require('./app');
// module.exports = serverless(app);
app.set('port', process.env.PORT || 8888);
const server = app.listen(app.get('port'), () => {
  console.log(`Express running → On PORT : ${server.address().port}`);
});
