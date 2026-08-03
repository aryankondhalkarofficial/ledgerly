import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import cookieParser from 'cookie-parser'

const app = express()

app.use(helmet())
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

export default app