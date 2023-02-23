const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const packageDef = protoLoader.loadSync("todo.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const todoPackage = grpcObject.todoPackage;

const server = new grpc.Server();
server.bindAsync(
	"0.0.0.0:9090",
	grpc.ServerCredentials.createInsecure(),
	() => {
		console.log("==> Listening to 0.0.0.0:9090");
		server.addService(todoPackage.Todo.service, {
			createTodo: createTodo,
			readTodos: readTodos,
			readTodosStream: readTodosStream,
		});

		const toDos = [];
		function createTodo(call, callback) {
			let toDo = {
				id: toDos.length + 1,
				text: call.request.text,
			};
			toDos.push(toDo);
			callback(null, toDo);
		}

		function readTodos(call, callback) {
			callback(null, { items: toDos, totalItems: toDos.length });
		}

		function readTodosStream(call, callback) {
			toDos.forEach((todo) => {
				call.write(todo);
			});
			call.end();
		}

		server.start();
	}
);
