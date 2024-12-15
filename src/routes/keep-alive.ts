// Example for an Express app
import express, { Request, Response } from 'express';
const app = express();

app.get('/keep-alive', (req: Request, res: Response) => {
    res.status(200).send('Server is aliveeeeeee!');
});

export default app;
