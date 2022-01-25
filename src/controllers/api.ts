import { Application, Request, Response } from 'express';
import { crawler } from '../services';

export const loadApiEndpoints = (app: Application): void => {
  app.get('/', (req: Request, res: Response) => {
    return res
      .status(200)
      .send("It's runing for check all the info just '/crawler'");
  });
  app.get('/crawler', async (req: Request, res: Response) => {
    const responst = await crawler('https://www.lightningreach.org/');

    return res.status(200).json(responst);
  });
};
