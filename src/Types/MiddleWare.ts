import { Request, Response } from 'express';

export type Middleware = (req: Request, res: Response, next: any) => void | Promise<void>;
