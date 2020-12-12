const express = require('express');
require('./db/mongoose');
const dogRouter = require('./routers/dog');

const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(dogRouter);

app.listen(port, () => {
    console.log(`Listening at port ${port}`)
});
