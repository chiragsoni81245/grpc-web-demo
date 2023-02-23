const todoPackage = require('./todo_pb.js');
const todoPackageWeb = require('./todo_grpc_web_pb.js');

const url = window.GRPC_PROXY_URL || 'http://localhost:8080'
var TodoService = new todoPackageWeb.TodoClient(url);

const {TodoItem, TodoItems, voidNoParams: voidParams} = todoPackage

window.getPromise = (method, data = {}) => {
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

window.todo = { TodoService, TodoItem, TodoItems }

function updateTodoList(){
	TodoService.readTodos(new voidParams(), {}, (err, response)=>{
		if(err) return console.log("[Error in read todo]: ", err)
		let lis = [];
		for(let todo of response.getItemsList()){
			lis.push(`<li>${todo.getText()}</li>`)
		}
		const todoContainer = document.getElementById("todo-list")
		todoContainer.innerHTML = lis.join("").trim()
	})
}

window.currentStream = null;
function updateTodoListStream(){
	const todoContainer = document.getElementById("todo-list")
	todoContainer.innerHTML = ""
	if(window.currentStream){
		window.currentStream.cancel()
		window.currentStream = undefined
	}
	window.currentStream = TodoService.readTodosStream(new voidParams(), {})
	console.log("==> Todo Read Stream Started!")
	window.currentStream.on("data", (todo)=>{
		let template = document.createElement("template"); 
		template.innerHTML = `<li>${todo.getText()}</li>`;
		todoContainer.appendChild(template.content.firstChild);
	})
	window.currentStream.on("end", ()=>console.log("==> Todo Read Stream Ended!"))
}

function createTodo({text}){
	if(!text) return alert('Empty values are not allowed!')
	let todo = new TodoItem()
	todo.setText(text)
	TodoService.createTodo(todo, {}, (err, response)=>{
		if(err) return console.log("[Error in create todo]: ", err)
		document.getElementById("todo-text-input").value = "";
		updateTodoListStream()
	})
}

function main(){
	document.getElementById("add-todo").addEventListener("click", ()=>{
		createTodo({text: document.getElementById("todo-text-input").value})
	})
	
	updateTodoListStream()	
}

window.onload = main