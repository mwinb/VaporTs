import { Request, Response } from 'express';

export type MiddleWare = (req: Request, res: Response, next: any) => void | Promise<void>;
