const express = require('express');
const cors = require('cors');
const { User } = require('./db');
const router = require('./routes/index');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use('/api/v1', router);

app.listen(PORT, () => {
    console.log(`Listening on Port: ${PORT}`);
})