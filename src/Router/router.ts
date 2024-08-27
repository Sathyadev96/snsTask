import express from "express"; 
const Router = express.Router();

import {CreateUser,EditUser,DeleteUser,DisplayUser, LoginUser} from '../Controller/user.controller';
 
// USER ROUTER
Router.post('/login',LoginUser);

Router.post('/user/create',CreateUser);
Router.get('/user/display',DisplayUser);
Router.get('/user/display/:id',DisplayUser);
Router.patch('/user/edit/:id',EditUser);
Router.delete('/user/delete/:id',DeleteUser);


export default Router;