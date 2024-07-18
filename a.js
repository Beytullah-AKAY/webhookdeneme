const express = require('express');
const cors = require('cors');
const webhookRoutes = require('./routes/webhookRoutes');

const app = express();
const port = 7000;

app.use(express.json());
app.use(cors());
app.options('*', cors());

// Webhook rotalarını kullan
app.use('/webhook', webhookRoutes);

app.listen(port, () => {
  console.log(`Webhook sunucusu ${port} portunda çalışıyor`);
});