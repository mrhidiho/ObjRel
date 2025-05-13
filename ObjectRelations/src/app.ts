import express, { Application } from 'express';
import path from 'path';
import cors from 'cors';
import errorHandler from './middleware/error';
import companyRouter from './routes/company';
import contactRouter from './routes/contact';

const app: Application = express();

// CORS for all origins
app.use(cors());

// JSON body parser with 10 MB limit
app.use(express.json({ limit: '10mb' }));
const publicPath = path.join(__dirname, '../public');
app.use(express.static(publicPath));
app.get('/', (_req, res) => res.sendFile(path.join(publicPath, 'index.html')));

app.use('/companies', companyRouter);
app.use('/contacts', contactRouter);
app.use(errorHandler);
export default app;