const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

app.post('/webhook', (req, res) => {
    const statuses = req.body.statuses;
    
    if (statuses) {
        statuses.forEach(status => {
            const messageId = status.id;
            const recipientId = status.recipient_id;
            const messageStatus = status.status;
            const timestamp = status.timestamp;

            console.log(`Mesaj ID: ${messageId}`);
            console.log(`Alıcı: ${recipientId}`);
            console.log(`Durum: ${messageStatus}`);
            console.log(`Zaman: ${timestamp}`);
            console.log('------------------------');

            // Burada durum bilgisini veritabanına kaydedebilir veya başka işlemler yapabilirsiniz
        });
    }

    res.sendStatus(200);
});

const PORT = 7000;
app.listen(PORT, () => console.log(`Webhook sunucusu ${PORT} portunda çalışıyor`));


