/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import cookieParser from 'cookie-parser';
import express, { Application, Request, Response } from 'express'
import cors from 'cors'
import router from './app/routes'
import globalErrorHandler from './app/middlewares/globalErrorHandler'
import notFound from './app/middlewares/notFound'


const app: Application = express()
// parser
app.use(express.json())
app.use(cookieParser());
app.use(cors({ origin: ['http://localhost:5173', 'https://speed-x-jade.vercel.app'], credentials: true }))
// routes
app.use('/api/', router)
// testing
const test = async (req: Request, res: Response) => {
  res.send('Server Running!!!')
}
app.get('/', test)

app.use(globalErrorHandler)
app.use('*', notFound);


export default app