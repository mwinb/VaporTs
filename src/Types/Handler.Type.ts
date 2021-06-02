import { Request, Response } from 'express';

export type Handler = (req: Request, res: Response, next: any) => any | Promise<any>;
