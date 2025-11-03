//Inicia o servidor Express.
import express, { NextFunction,Response,Request} from "express";
import cors from "cors"; // ← Importe o pacote cors
import {router} from "./routes";
import "express-async-errors"; // Permite que o express entenda erros assíncronos
import "reflect-metadata";
import "./database/index"; // Importa a configuração do banco de dados
import { CleanupExpiredReservationsService } from "./service/Inventory/CleanupExpiredReservationsService";
import dotenv from "dotenv";
dotenv.config();

const app = express();


app.use(cors({
    origin: 'http://localhost:5173', // URL do FrontEnd
    credentials: true, // Permite cookies/auth headers
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json()); // Permite que a API entenda JSON no body das requisições

app.use(router); // Aplica as rotas definidas em routes.ts

app.use(
    (err: Error, request: Request, response: Response, next: NextFunction) => {
        if (err instanceof Error) {
                response.status(400).send(err.message)
            }
            else{
                response.status(500).send("Erro interno do servidor")
            }
        }
)

console.log("Start at =>3000"); //mostrar msg no console

app.listen(3000);

const cleanupService = new CleanupExpiredReservationsService();

// rodar a cada 30 segundos (30_000 ms)
const CLEANUP_INTERVAL_MS = Number(process.env.RESERVATION_CLEANUP_INTERVAL_MS || 30_000);

setInterval(async () => {
  try {
    const res = await cleanupService.execute();
    if (res && (res.removed || res.restored)) {
      console.info("[cleanup] expired reservations handled:", res);
    }
  } catch (err) {
    console.error("[cleanup] error", err);
  }
}, CLEANUP_INTERVAL_MS);