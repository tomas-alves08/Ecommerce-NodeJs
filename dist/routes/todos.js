"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// import { Todo } from "../models/todo";
// let todos: Array<Todo> = [
//   {
//     id: "1",
//     text: "Do dishes",
//   },
// ];
// type RequestBody = { text: string };
// type RequestParams = { todoId: string };
const router = (0, express_1.Router)();
// router.get("/", (req, res, next) => {
//   res.status(200).json({ todos: todos });
// });
// router.post("/todos", (req, res, next) => {
//   const body = req.body as RequestBody;
//   const newTodo: Todo = {
//     id: new Date().toISOString(),
//     text: body.text,
//   };
//   todos.push(newTodo);
//   res
//     .status(201)
//     .json({ message: "Todo created successfully", todo: newTodo, todos });
// });
// router.put("/todos/:todoId", (req, res, next) => {
//   const params = req.params as RequestParams;
//   const body = req.body as RequestBody;
//   const todoIndex = todos.findIndex((todo) => todo.id === params.todoId);
//   if (todoIndex >= 0) {
//     todos[todoIndex] = { id: todos[todoIndex].id, text: body.text };
//     return res
//       .status(200)
//       .json({ message: "Todo updated successfully", todos });
//   }
//   res.status(404).json({ message: "Could not find todo for this id" });
// });
// router.delete("/todos/:todoId", (req, res, next) => {
//   const params = req.params as RequestParams;
//   todos = todos.filter((todo) => todo.id !== params.todoId);
//   res.status(201).json({ message: "Todo deleted succesfully" });
// });
exports.default = router;
