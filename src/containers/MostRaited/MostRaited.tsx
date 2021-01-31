import * as React from "react"
import { observer } from "mobx-react"
import { RouteComponentProps } from "@reach/router";

 const TodoListView: React.FC<RouteComponentProps | any> = observer(({ todoList }) => (
    <div>
        <ul>
            {todoList.map(todo => (
                <TodoView todo={todo} key={todo.id} />
            ))}
        </ul>
        Tasks left: {todoList.unfinishedTodoCount}
    </div>
))

const TodoView = observer(({ todo }) => (
    <li>
        <input type="checkbox" checked={todo.finished} onClick={() => todo.toggle()} />
        {todo.title}
    </li>
))
export default TodoListView;