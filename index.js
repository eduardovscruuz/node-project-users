const { request, response } = require("express");
const express = require("express");
const uuid = require("uuid");
const cors = require("cors");

const app = express();
const port = 3001;
app.use(express.json());
app.use(cors());

const users = [];

// ROTA DE -->> MIDDLEWARES <<--

const checkUserId = (request, response, next) => {
	const { id } = request.params;
	const index = users.findIndex((user) => user.id === id);

	if (index < 0) {
		return response.status(404).json({ message: "User not found" });
	}

	request.userIndex = index;
	request.userId = id;

	next();
};

//ROTA DE -->> POST <<-- PARA CRIAR

app.post("/users", (request, response) => {
	const { name, age } = request.body;
	const user = { id: uuid.v4(), name, age };
	users.push(user);
	return response.status(201).json(user);
});

//ROTA DE -->> PUT <<-- PRA ATUALIZAR

app.put("/users/:id", checkUserId, (request, response) => {
	const { name, age } = request.body;
	const index = request.userIndex;
	const id = request.userId;

	const updatedUser = { id, name, age };

	users[index] = updatedUser;

	return response.json(updatedUser);
});

//ROTA DE -->> GET <<-- PARA PEGAR INFORMAÇÕES

app.get("/users", (request, response) => {
	return response.json(users);
});

//ROTA DE -->> DELETE <<-- PARA DELETAR USER

app.delete("/users/:id", checkUserId, (request, response) => {
	const index = request.userIndex;

	users.splice(index, 1);

	return response.status(204).json();
});

// LISTEN APP

app.listen(port, () => {
	console.log(`Server Running on port ${port}`);
});
