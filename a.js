const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();
const port = 7000

// Webhook token'ınız
const WEBHOOK_TOKEN = 'webhook-server-start';

// Webhook URL'iniz
const WEBHOOK_URL = 'https://webhook.rahatyonetim.com/';

app.use(bodyParser.json());

// Webhook doğrulama
app.get('/', (req, res) => {
  if (
    req.query['hub.mode'] === 'subscribe' &&
    req.query['hub.verify_token'] === WEBHOOK_TOKEN
  ) {
    res.send(req.query['hub.challenge']);
  } else {
    res.sendStatus(400);
  }
  res.send("Merhaba, isteğinizi dinliyorum");

});

// Webhook olaylarını işleme
app.post('/', (req, res) => {
  const signature = req.headers['x-hub-signature'];
  
  if (!signature) {
    res.sendStatus(401);
    return;
  }

  const buf = JSON.stringify(req.body);
  const hmac = crypto.createHmac('sha1', WEBHOOK_TOKEN);
  const expected = hmac.update(buf).digest('hex');

  if (signature !== `sha1=${expected}`) {
    res.sendStatus(401);
    return;
  }

  const data = req.body;

  if (data.object === 'whatsapp_business_account') {
    data.entry.forEach(entry => {
      entry.changes.forEach(change => {
        if (change.field === 'messages') {
          const messages = change.value.messages;
          if (messages) {
            messages.forEach(message => {
              console.log('Yeni mesaj:', message);
              // Burada mesaj durumunu kontrol edebilir ve işleyebilirsiniz
              if (message.status) {
                console.log('Mesaj durumu:', message.status);
              }
            });
          }
        }
      });
    });
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

app.listen(port, () => {
  console.log(`Webhook sunucusu ${port} portunda çalışıyor`);
});