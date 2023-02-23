function generateRandomText() {
	const length = Math.floor(Math.random() * 100) + 1;
	let result = "";
	const characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	const charactersLength = characters.length;
	let counter = 0;
	while (counter < length) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
		counter += 1;
	}
	return result;
}

function generateRandomTodos(length) {
	let lastTodoId = 0;
	const todos = [];
	for (let i = 0; i < length; i++) {
		const todo = {
			id: ++lastTodoId,
			text: generateRandomText(),
		};
		todos.push(todo);
	}
	return todos;
}

function generateRandomTodo() {
	const todo = {
		id: -1,
		text: generateRandomText(),
	};
	return todo;
}

module.exports = { generateRandomTodos, generateRandomTodo };
