const express = require('express');
const app = express();

app.options('*', (req, res) => {
  res.send(200);
});

app.use(express.static('dist'));

app.listen(3000, () => console.log('Listening on port 3000!'));
