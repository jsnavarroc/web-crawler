import { Application, Request, Response } from 'express';
import { test } from '../services/web-crawler';

export const loadApiEndpoints = (app: Application): void => {
  app.get('/', (req: Request, res: Response) => {
    return res.status(200).send("It's runing");
  });
  app.get('/test', (req: Request, res: Response) => {
    return res.status(200).send(test());
  });
};
