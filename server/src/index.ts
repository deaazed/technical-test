import express, { Request, Response } from "express";
import dotenv from "dotenv";
import Database from "./services/database";
import AppRouter from "./services/router";
import Book from "./entity/book";

dotenv.config();

const db = new Database({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

const entities = [Book];

entities.forEach(entity => entity.setDatabase(db));

const app = express();
const PORT = process.env.BACKEND_PORT || 3000;

app.use(express.json());

const router = new AppRouter(app);

const routes = [
    { method: 'get', path: '/books', handler: (req : any, res: any) => Book.getAllBooks(req, res) },
    { method: 'get', path: '/book/:id', handler: (req : any, res: any) => Book.getBookById(req, res) },
    { method: 'post', path: '/books', handler: (req : any, res: any) => Book.addBook(req, res) },
    // { method: 'put', path: '/books/:id', handler: router.updateUser },
    // { method: 'delete', path: '/books/:id', handler: router.deleteUser }
];

routes.forEach(route => router.add(route.method as any, route.path, route.handler));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});