import cors from 'cors';
import express from 'express';
import session from 'express-session';

import { ONE_HOUR } from './interfaces/Time';
import { connect } from './mongo';
import { router } from './routes';

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: process.env.AXIOS_BASE_URL,
  })
);
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: ONE_HOUR },
  })
);
app.use(router);

connect();

app.listen(process.env.PORT, () => {
  console.log('**********************************************');
  console.log(`************Auth API - Porta: ${process.env.PORT}************`);
  console.log('**********************************************');
});
