const TodosApp = {
    data() {
        return {
            isLoading: false,
            todos: [],
            enteredTodoText: "",
            editedTodoId: null,
        };
    },
    methods: {
        async saveTodo(event) {
            event.preventDefault();

            if (this.editedTodoId) {
                const todoId = this.editedTodoId;
                const todoIndex = this.todos.findIndex(
                    (todo) => todo.id === todoId
                );

                const updatedTodoItem = {
                    id: this.todos[todoIndex].id,
                    text: this.enteredTodoText,
                };

                this.todos[todoIndex] = updatedTodoItem;
                this.editedTodoId = null;
            } else {
                let response;

                try {
                    response = await fetch("http://localhost:3000/todos", {
                        method: "POST",
                        body: JSON.stringify({
                            text: this.enteredTodoText,
                        }),
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });
                } catch (error) {
                    alert("Something went wrong!");
                    return;
                }

                if (!response.ok) {
                    alert("Something went wrong!");
                    return;
                }

                const responseData = await response.json();
                const todoId = responseData.createdTodo.id;

                const newTodo = {
                    text: this.enteredTodoText,
                    id: todoId,
                };

                this.todos.push(newTodo);
            }

            this.enteredTodoText = "";
        },
        startEditTodo(todoId) {
            this.editedTodoId = todoId;
            const todo = this.todos.find((todoItem) => todoItem.id === todoId);
            this.enteredTodoText = todo.text;
        },
        deleteTodo(todoId) {
            const todoIndex = this.todos.findIndex(
                (todoItem) => todoItem.id === todoId
            );
            this.todos.splice(todoIndex, 1);
        },
    },
    async created() {
        let response;
        this.isLoading = true;
        try {
            response = await fetch("http://localhost:3000/todos");
        } catch (error) {
            alert("Server not reached");
            this.isLoading = false;
            return;
        }

        if (!response.ok) {
            alert("Something went wrong!");
            this.isLoading = false;
            return;
        }

        this.isLoading = false;

        const responseData = await response.json();
        this.todos = responseData.todos;
    },
};

Vue.createApp(TodosApp).mount("body");
