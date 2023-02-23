const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const packageDef = protoLoader.loadSync("todo.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const todoPackage = grpcObject.todoPackage;
const { generateRandomTodos, generateRandomTodo } = require("./utils");

const client = new todoPackage.Todo(
	"localhost:9090",
	grpc.credentials.createInsecure()
);

const getPromise = (method, data = {}) => {
	return new Promise((resolve, reject) => {
		client[method](data, (err, response) => {
			if (err) {
				reject({ err, response });
			} else {
				resolve({ err, response });
			}
		});
	});
};

async function main() {
	try {
		let addCount = 0
		for (let i=0; i<2000000; i++) {
			const { err, response } = await getPromise("createTodo", generateRandomTodo());
			console.log("==> Added Count: ", ++addCount)
		}

		// const { err, response } = await getPromise(client.readTodos);
		// console.log("==> Read Response: ", response.totalItems);

		const call = await client.readTodosStream();
		call.on("data", (item) => {
			console.log("==> Received Item:", JSON.stringify(item));
		});
		call.on("end", () => {
			console.log("==> Item Receiving Ended!");
		});
	} catch (err) {
		console.log("==> Error: ", err);
	}
}
main();
