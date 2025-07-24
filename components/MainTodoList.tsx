import React, { useState } from 'react';
import { TodoItem } from '../types';

interface MainTodoListProps {
    todos: TodoItem[];
    setTodos: React.Dispatch<React.SetStateAction<TodoItem[]>>;
}

export const MainTodoList: React.FC<MainTodoListProps> = ({ todos, setTodos }) => {
    const [newTodoText, setNewTodoText] = useState('');

    const handleAddTodo = (e: React.FormEvent) => {
        e.preventDefault();
        if (newTodoText.trim() === '') return;
        const newTodo: TodoItem = {
            id: `m-${Date.now()}`,
            text: newTodoText.trim(),
            completed: false,
        };
        setTodos(prev => [newTodo, ...prev]);
        setNewTodoText('');
    };

    const handleToggleTodo = (id: string) => {
        setTodos(prev => prev.map(todo => 
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ));
    };
    
    const handleDeleteTodo = (id: string) => {
        setTodos(prev => prev.filter(todo => todo.id !== id));
    };

    return (
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
                <span className="material-icons text-blue-500 mr-2">checklist</span>
                내일 할 일
            </h2>
            <form onSubmit={handleAddTodo} className="flex mb-4">
                <input
                    type="text"
                    value={newTodoText}
                    onChange={(e) => setNewTodoText(e.target.value)}
                    placeholder="새로운 작업 추가..."
                    className="flex-grow p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-r-lg flex items-center transition duration-300">
                    <span className="material-icons">add</span>
                </button>
            </form>
            <ul className="space-y-3">
                {todos.map(todo => (
                     <li key={todo.id} className="flex items-center">
                        <input type="checkbox" checked={todo.completed} onChange={() => handleToggleTodo(todo.id)} className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500" id={`task-${todo.id}`} />
                        <label className={todo.completed ? 'ml-3 text-gray-700 line-through text-gray-400' : 'ml-3 text-gray-700'} htmlFor={`task-${todo.id}`}>{todo.text}</label>
                        {/* 삭제 버튼은 디자인에 없으므로 일단 주석 처리하거나 숨김 */}
                        {/* <button onClick={() => handleDeleteTodo(todo.id)} className="p-1 text-gray-500 hover:text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="material-icons">delete</span>
                        </button> */}
                    </li>
                ))}
                 {todos.length === 0 && <p className="text-center text-gray-500 py-4">할 일이 없습니다.</p>}
            </ul>
        </div>
    );
};
