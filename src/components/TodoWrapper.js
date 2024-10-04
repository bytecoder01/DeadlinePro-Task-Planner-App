import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Todo } from './Todo';
import { TodoForm } from './TodoForm';
import { EditTodoForm } from './EditTodoForm';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PieChart, Pie, Cell, Legend } from 'recharts';

export const TodoWrapper = () => {
    const [todos, setTodos] = useState([]);
    const [analyticsData, setAnalyticsData] = useState({ total: 0, completed: 0 });
    const [selectedTag, setSelectedTag] = useState('');

    useEffect(() => {
        const total = todos.length;
        const completed = todos.filter(todo => todo.completed).length;
        setAnalyticsData({ total, completed });
        
        // Set reminders for approaching due dates
        todos.forEach(todo => {
            if (todo.dueDate && !todo.completed) {
                const reminderTime = new Date(todo.dueDate).getTime() - new Date().getTime();
                if (reminderTime > 0 && reminderTime < 24 * 60 * 60 * 1000) { 
                    setTimeout(() => {
                        toast.info(`Reminder: Task "${todo.task}" is approaching its deadline!`);
                    }, reminderTime);
                }
            }
        });
    }, [todos]);

    const addTodo = ({ task, dueDate, tags }) => {
        setTodos([
            ...todos,
            { id: uuidv4(), task, dueDate, tags, completed: false, isEditing: false },
        ]);
        toast.success('Task added successfully!');
    };

    const deleteTodo = (id) => {
        setTodos(todos.filter((todo) => todo.id !== id));
        toast.error('Task deleted!');
    };

    const toggleComplete = (id) => {
        setTodos(
            todos.map((todo) =>
                todo.id === id ? { ...todo, completed: !todo.completed } : todo
            )
        );
        toast.info('Task status updated!');
    };

    const editTodo = (id) => {
        setTodos(
            todos.map((todo) =>
                todo.id === id ? { ...todo, isEditing: !todo.isEditing } : todo
            )
        );
    };

    const editTask = (task, id) => {
        setTodos(
            todos.map((todo) =>
                todo.id === id ? { ...todo, task, isEditing: !todo.isEditing } : todo
            )
        );
        toast.success('Task updated successfully!');
    };

    const filteredTodos = selectedTag
        ? todos.filter(todo => todo.tags.includes(selectedTag))
        : todos;

    const data = [
        { name: 'Completed', value: analyticsData.completed },
        { name: 'Pending', value: analyticsData.total - analyticsData.completed },
    ];

    // Group todos by tags
    const groupedTodos = filteredTodos.reduce((acc, todo) => {
        if (todo.tags && todo.tags.length > 0) {
            todo.tags.forEach(tag => {
                if (!acc[tag]) acc[tag] = [];
                acc[tag].push(todo);
            });
        } else {
            if (!acc['Uncategorized']) acc['Uncategorized'] = [];
            acc['Uncategorized'].push(todo);
        }
        return acc;
    }, {});

    return (
        <div className="TodoWrapper">
            <h1>Get Things Done!</h1>
            <div className='tags-cont'>
                <label>Filter by tag: </label>
                <input
                    className='tags-cont-i'
                    type="text"
                    value={selectedTag}
                    onChange={(e) => setSelectedTag(e.target.value)}
                />
            </div>
            <div className="todo-container">
                <div className="todo-list">
                    <TodoForm addTodo={addTodo} />
                    {Object.keys(groupedTodos).map(tag => (
                        <div key={tag} className="tag-group">
                            <h2 className="tag-heading">{tag}</h2>
                            <div className="todos">
                                {groupedTodos[tag].map(todo =>
                                    todo.isEditing ? (
                                        <EditTodoForm key={todo.id} editTodo={editTask} task={todo} />
                                    ) : (
                                        <Todo
                                            key={todo.id}
                                            task={todo}
                                            deleteTodo={deleteTodo}
                                            editTodo={editTodo}
                                            toggleComplete={toggleComplete}
                                        />
                                    )
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="analytics">
                    <h2>Task Analytics</h2>
                    <PieChart width={400} height={400}>
                        <Pie
                            data={data}
                            dataKey="value"
                            outerRadius={150}
                            label
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index === 0 ? '#00C49F' : '#FF8042'} />
                            ))}
                        </Pie>
                        <Legend />
                    </PieChart>
                    <div>
                        <p>Total Tasks: {analyticsData.total}</p>
                        <p>Completed Tasks: {analyticsData.completed}</p>
                        <p>Pending Tasks: {analyticsData.total - analyticsData.completed}</p>
                    </div>
                </div>
            </div>
            <ToastContainer
                position="top-left"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </div>
    );
};
