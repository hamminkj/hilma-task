import React, { useState } from 'react';
import { Plus, Download } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const CardWrapper = ({ className, children }) => (
  <div className={`rounded-lg border border-slate-800 bg-slate-900/50 p-4 ${className}`}>
    {children}
  </div>
);

const CardHeaderWrapper = ({ children }) => (
  <div className="pb-4">{children}</div>
);

const CardTitleWrapper = ({ children }) => (
  <h3 className="text-lg font-semibold">{children}</h3>
);

const CardContentWrapper = ({ children }) => (
  <div>{children}</div>
);

const CATEGORIES = {
  admin: { label: 'Admin', color: '#93c5fd' },
  portfolio: { label: 'Portfolio', color: '#ef4444' },
  prep: { label: 'Prep', color: '#bef264' },
  teaching: { label: 'Teaching', color: '#fb923c' },
  making: { label: 'Making', color: '#fbbf24' },
  learning: { label: 'Learning', color: '#d8b4fe' },
  other: { label: 'Other', color: '#64748b' }
};

const TaskIcon = ({ points }) => {
  const renderIcon = (points) => {
    switch(parseInt(points)) {
      case 1:
        return (
          <svg viewBox="0 0 100 100" className="w-6 h-6">
            <circle cx="50" cy="50" r="48" fill="#1e3a8a"/>
            <path d="M50 10 A40 40 0 0 1 90 50 A40 40 0 0 1 50 90 A40 40 0 0 1 10 50 A40 40 0 0 1 50 10 L50 20 A30 30 0 0 0 20 50 A30 30 0 0 0 50 80 A30 30 0 0 0 80 50 A30 30 0 0 0 50 20Z" fill="#ef4444"/>
          </svg>
        );
      case 2:
        return (
          <svg viewBox="0 0 100 100" className="w-6 h-6">
            <circle cx="50" cy="50" r="48" fill="#fbbf24"/>
            <path d="M50 15 A35 35 0 0 1 85 50 A35 35 0 0 1 50 85 A35 35 0 0 1 15 50 A35 35 0 0 1 50 15 L50 25 A25 25 0 0 0 25 50 A25 25 0 0 0 50 75 A25 25 0 0 0 75 50 A25 25 0 0 0 50 25Z" fill="#64748b"/>
          </svg>
        );
      case 3:
        return (
          <svg viewBox="0 0 100 100" className="w-6 h-6">
            <circle cx="50" cy="50" r="48" fill="#fb923c"/>
            <circle cx="30" cy="35" r="15" fill="#93c5fd"/>
            <circle cx="60" cy="35" r="15" fill="#1e3a8a"/>
            <circle cx="45" cy="60" r="15" fill="#d8b4fe"/>
            <circle cx="75" cy="60" r="15" fill="#ef4444"/>
            <circle cx="15" cy="60" r="15" fill="#bef264"/>
          </svg>
        );
      case 4:
        return (
          <svg viewBox="0 0 100 100" className="w-6 h-6">
            <circle cx="50" cy="50" r="48" fill="#fce7f3"/>
            <path d="M50 50 L50 5 M50 50 L72 7 M50 50 L90 15 M50 50 L95 50 M50 50 L90 85 M50 50 L72 93 M50 50 L50 95 M50 50 L28 93 M50 50 L10 85 M50 50 L5 50 M50 50 L10 15 M50 50 L28 7" stroke="#f472b6" strokeWidth="1" fill="none"/>
            <circle cx="50" cy="50" r="3" fill="#f472b6"/>
          </svg>
        );
      case 5:
        return (
          <svg viewBox="0 0 100 100" className="w-6 h-6">
            <circle cx="50" cy="50" r="48" fill="#e5e7eb"/>
            <circle cx="50" cy="50" r="40" fill="#9ca3af"/>
            <circle cx="50" cy="50" r="32" fill="#6b7280"/>
            <circle cx="50" cy="50" r="24" fill="#4b5563"/>
            <circle cx="50" cy="50" r="16" fill="#374151"/>
          </svg>
        );
      default:
        return null;
    }
  };

  return renderIcon(points);
};

export default function TodoList() {
  const [tasks, setTasks] = useState([
    { 
      id: 1, 
      text: "Prepare lecture slides", 
      points: 3, 
      category: "teaching", 
      dateAdded: new Date().toISOString(),
      dateCompleted: null
    }
  ]);
  const [score, setScore] = useState(0);
  const [newTask, setNewTask] = useState('');
  const [points, setPoints] = useState('1');
  const [category, setCategory] = useState('teaching');
  const [dateAdded, setDateAdded] = useState(new Date().toISOString().split('T')[0]);

  const addTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    setTasks([...tasks, { 
      id: Date.now(), 
      text: newTask, 
      points: parseInt(points), 
      category,
      dateAdded: new Date(dateAdded).toISOString(),
      dateCompleted: null
    }]);
    setNewTask('');
  };

  const completeTask = (id, e) => {
    e.stopPropagation();
    const task = tasks.find(t => t.id === id);
    if (task && !task.dateCompleted) {
      setScore(score + task.points);
      setTasks(tasks.map(t => 
        t.id === id 
          ? { ...t, dateCompleted: new Date().toISOString() } 
          : t
      ));
    }
  };

  const downloadCsv = () => {
    const headers = ['Task', 'Points', 'Category', 'Date Added', 'Date Completed'];
    const csvContent = [
      headers.join(','),
      ...tasks.map(task => [
        `"${task.text}"`,
        task.points,
        CATEGORIES[task.category].label,
        new Date(task.dateAdded).toLocaleDateString(),
        task.dateCompleted ? new Date(task.dateCompleted).toLocaleDateString() : ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tasks-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 min-h-screen bg-slate-950">
      <div className="max-w-2xl mx-auto space-y-4">
        <CardWrapper>
          <CardHeaderWrapper>
            <CardTitleWrapper>
              <div className="flex items-center justify-between text-slate-200">
                <div className="flex items-center gap-2">
                  <TaskIcon points={3} />
                  <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500 bg-clip-text text-transparent">
                    Score: {score}
                  </span>
                </div>
                <Button 
                  size="sm" 
                  onClick={downloadCsv}
                  className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white border-0"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </CardTitleWrapper>
          </CardHeaderWrapper>
        </CardWrapper>

        <CardWrapper>
          <CardHeaderWrapper>
            <CardTitleWrapper>
              <span className="text-slate-200">Tasks</span>
            </CardTitleWrapper>
          </CardHeaderWrapper>
          <CardContentWrapper>
            <form onSubmit={addTask} className="flex gap-2 mb-6">
              <Input
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Enter new task..."
                className="bg-slate-900 border-slate-800 text-slate-200"
              />
              <Input
                type="date"
                value={dateAdded}
                onChange={(e) => setDateAdded(e.target.value)}
                className="w-40 bg-slate-900 border-slate-800 text-slate-200"
              />
              <Select value={points} onValueChange={setPoints}>
                <SelectTrigger className="w-24 bg-slate-900 border-slate-800 text-slate-200">
                  <SelectValue placeholder="Points" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  {[1, 2, 3, 4, 5].map(p => (
                    <SelectItem 
                      key={p} 
                      value={p.toString()} 
                      className="text-slate-200 focus:bg-slate-700 focus:text-white hover:bg-slate-700"
                    >
                      {p} pts
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-32 bg-slate-900 border-slate-800 text-slate-200">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  {Object.entries(CATEGORIES).map(([key, { label, color }]) => (
                    <SelectItem 
                      key={key} 
                      value={key}
                      className="text-slate-200 focus:bg-slate-700 focus:text-white hover:bg-slate-700"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }}></div>
                        {label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                type="submit" 
                size="icon"
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                disabled={!newTask.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </form>

            <div className="space-y-2">
              {tasks.map(task => (
                <div
                  key={task.id}
                  className="p-4 rounded-lg border border-slate-800 bg-slate-900/30 hover:bg-slate-900/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <TaskIcon points={task.points} />
                      <div className="flex flex-col">
                        <span className="text-slate-200">{task.text}</span>
                        <span className="text-sm text-slate-400">
                          Added: {new Date(task.dateAdded).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm px-2 py-1 rounded bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                          {task.points} pts
                        </span>
                        <span 
                          className="text-sm px-2 py-1 rounded text-white"
                          style={{ backgroundColor: CATEGORIES[task.category]?.color }}
                        >
                          {CATEGORIES[task.category]?.label}
                        </span>
                      </div>
                      {!task.dateCompleted ? (
                        <Button 
                          size="sm" 
                          onClick={(e) => completeTask(task.id, e)}
                          className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white border-0"
                        >
                          Mark Complete
                        </Button>
                      ) : (
                        <span className="text-sm text-green-500">
                          Completed: {new Date(task.dateCompleted).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContentWrapper>
        </CardWrapper>
      </div>
    </div>
  );
}
