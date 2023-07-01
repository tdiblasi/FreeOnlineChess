const express = require('express');
const cors = require('cors')
const admin = require('firebase-admin');

const serviceAccount = require('./firebase_admin_config.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://two-player-chess-6342c-default-rtdb.firebaseio.com/'
});

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(cors());

var db = admin.database();
var ref = db.ref("github");
ref.on("value", (snapshot) => {
  console.log(snapshot.val());
});

app.get('/test', async (req, res) => {
  res.json({"result":"success"})
})

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});