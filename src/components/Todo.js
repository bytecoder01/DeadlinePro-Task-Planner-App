import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';

export const Todo = ({ task, deleteTodo, editTodo, toggleComplete }) => {
    return (
        <div className="Todo">
            <p
                className={`${task.completed ? "completed" : "incompleted"}`}
                onClick={() => toggleComplete(task.id)}
            >
                {task.task}
              

            </p>
            <div>
            {task.dueDate &&     <span className="due-date" style={{ color: '#37392E' }}>Due: {new Date(task.dueDate).toLocaleDateString()}</span>}
                <FontAwesomeIcon
                    className="edit-icon"
                    icon={faPenToSquare}
                    onClick={() => editTodo(task.id)}
                    
                />
                <FontAwesomeIcon
                    className="delete-icon"
                    icon={faTrash}
                    onClick={() => deleteTodo(task.id)}
                />
            </div>
        </div>
    );
};
