const express = require('express');
const cors = require('cors');

const app = express();
const port = 7000;

const VERIFY_TOKEN = "webhook-server-start";

app.use(express.json());
app.use(cors());
app.options('*', cors());

app.get('/webhook/whatsapp', (req, res) => {
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (token === VERIFY_TOKEN) {
    res.status(200).send(challenge);
    console.log("Webhook onaylandı");
  } else {
    res.sendStatus(403);
    console.log("Webhook reddedildi");
  }
});

app.post('/webhook/whatsapp', async (req, res) => {
  try {
    const body = req.body;
console.log(req)
    if (body.entry && Array.isArray(body.entry)) {
      for (const entry of body.entry) {
        if (entry.changes && Array.isArray(entry.changes)) {
          for (const change of entry.changes) {
            if (change.field === 'messages' && change.value && change.value.messages && Array.isArray(change.value.messages)) {
              for (const message of change.value.messages) {
                console.log('Gelen mesaj:', message);
              }
            }
            if (change.field === 'messages' && change.value && change.value.statuses && Array.isArray(change.value.statuses)) {
              for (const status of change.value.statuses) {
                await processStatusUpdate(status);
              }
            }
          }
        }
      }
    }

    res.sendStatus(200);
  } catch (error) {
    console.error('Webhook işleme hatası:', error);
    res.sendStatus(500);
  }
});

const processStatusUpdate = async (status) => {
  try {
    const messageId = status.id;
    const statusType = status.status;
    const recipientId = status.recipient_id;
    console.log(`Mesaj ID: ${messageId}, Durum: ${statusType}, Alıcı: ${recipientId}`);

    switch (statusType) {
      case 'sent':
        console.log('Mesaj gönderildi');
        break;
      case 'delivered':
        console.log('Mesaj teslim edildi (çift tik)');
        break;
      case 'read':
        console.log('Mesaj okundu (mavi tik)');
        break;
      default:
        console.log('MESAJ GÖNDERİLEMEDİ');
    }
  } catch (error) {
    console.error('Durum güncelleme işleme hatası:', error);
  }
};

app.listen(port, () => {
  console.log(`Webhook sunucusu ${port} portunda çalışıyor`);
});