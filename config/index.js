const dotenv = require('dotenv');

dotenv.config();

module.exports =  {
  PORT: process.env.EXPRESS_PORT,
  MONGO_URI: process.env.MONGO_URI,
  JWT: process.env.JWT, 
  AWS_CONFIG: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION, 
    bucket: process.env.AWS_BUCKET
  }
};