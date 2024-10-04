import React, { useState } from 'react';
import './../App.css'
export const TodoForm = ({ addTodo }) => {
    const [task, setTask] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [tags, setTags] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (task) {
            addTodo({
                task,
                dueDate,
                tags: tags.split(',').map(tag => tag.trim())
            });
            setTask('');
            setDueDate('');
            setTags('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="TodoForm">
            <input
                type="text"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                className="todo-input"
                placeholder="What is the task today?"
            />
            <input

                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="due-date-input"
            />
            <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="tags-input"
                placeholder="Add tags (e.g., work)"
            />
            <button type="submit" className="todo-btn">Add Task</button>
        </form>
    );
};
