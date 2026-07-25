const mongoose = require('mongoose');
const url = 'mongodb://127.0.0.1:27017/portfolio';

mongoose.connect(url).then(async () => {
  const heroSchema = new mongoose.Schema({ cvUrl: String }, { collection: 'hero' });
  const Hero = mongoose.model('Hero', heroSchema);
  const data = await Hero.findOne();
  console.log('CV URL:', data ? data.cvUrl : 'null');
  process.exit(0);
});
