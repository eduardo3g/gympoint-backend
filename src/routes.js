import { Router } from 'express';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';

import authMiddleware from './app/middlewares/auth';
import StudentController from './app/controllers/StudentController';

const routes = new Router();

routes.post('/students', StudentController.store);
routes.put('/students/:id', StudentController.update);
routes.post('/sessions', SessionController.store);
routes.post('/users', UserController.store);
routes.use(authMiddleware);

routes.put('/users', UserController.update);

export default routes;
