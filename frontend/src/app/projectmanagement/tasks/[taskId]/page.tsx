
'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Edit, Trash2, User, Flag, Calendar, Tag, MessageSquare, Paperclip, Send } from 'lucide-react';
import { useState } from 'react';
// DashboardLayout is already applied in projectmanagement/layout.tsx

const tasks = [
  {
    id: 'TASK-001',
    title: 'Design the database schema',
    description: 'Create an ER diagram and define all tables, relationships, and constraints for the project database.',
    assignee: 'Alia Bhatt',
    priority: 'High',
    status: 'To Do',
    dueDate: '2023-10-20',
    comments: [
      { id: 'C1', author: 'Ranbir Kapoor', text: 'Consider using PostgreSQL for better JSON support.', time: '2023-10-10 10:00 AM' },
      { id: 'C2', author: 'Alia Bhatt', text: 'Good point, I will look into it.', time: '2023-10-10 10:15 AM' },
    ],
    attachments: [
      { id: 'A1', name: 'ER_Diagram_v1.png', url: '/path/to/ER_Diagram_v1.png' },
      { id: 'A2', name: 'Database_Requirements.pdf', url: '/path/to/Database_Requirements.pdf' },
    ],
  },
  {
    id: 'TASK-002',
    title: 'Set up the development environment',
    description: 'Install all necessary tools and configure the project for local development.',
    assignee: 'Ranbir Kapoor',
    priority: 'Medium',
    status: 'In Progress',
    dueDate: '2023-10-18',
    comments: [],
    attachments: [],
  },
];

const statusColors: { [key: string]: string } = {
  'To Do': 'bg-gray-200 text-gray-800',
  'In Progress': 'bg-blue-100 text-blue-800',
  'Review': 'bg-yellow-100 text-yellow-800',
  'Done': 'bg-green-100 text-green-800',
};

export default function TaskDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { taskId } = params;
  const [newTaskComment, setNewTaskComment] = useState('');

  const task = tasks.find(t => t.id === taskId);

  if (!task) {
    return (
      
        <div className="py-3 lg:py-4 flex items-center justify-center">
          <p className="text-muted-foreground">Task not found</p>
        </div>
      
    );
  }

  const handleAddComment = () => {
    if (newTaskComment.trim() === '') return;
    // In a real app, you'd update the backend and then refetch/update state
    console.log('Adding comment:', newTaskComment);
    setNewTaskComment('');
  };

  return (
    
      <div className="py-3 lg:py-4 space-y-3 lg:space-y-4">
        <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
                <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-gray-100 mr-4">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <div>
                    <h1 className="text-3xl font-bold">{task.title}</h1>
                    <p className="text-gray-500">{task.id}</p>
                </div>
            </div>
            <div className="flex items-center space-x-2">
                <button className="flex items-center bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50">
                    <Edit className="w-5 h-5 mr-2" />
                    Edit
                </button>
                <button className="flex items-center bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
                    <Trash2 className="w-5 h-5 mr-2" />
                    Delete
                </button>
            </div>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Task Description */}
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-xl font-bold mb-4">Description</h2>
            <p className="text-gray-700">{task.description}</p>
          </div>

          {/* Comments */}
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-xl font-bold mb-4">Comments</h2>
            <div className="space-y-4 mb-6">
              {task.comments.length > 0 ? (
                task.comments.map((comment) => (
                  <div key={comment.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <User className="w-8 h-8 rounded-full bg-gray-100 p-1 text-gray-600" />
                    </div>
                    <div>
                      <div className="flex items-baseline space-x-2">
                        <p className="font-semibold">{comment.author}</p>
                        <p className="text-xs text-gray-500">{comment.time}</p>
                      </div>
                      <p className="text-gray-700">{comment.text}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No comments yet.</p>
              )}
            </div>
            <div className="flex items-center space-x-3">
              <textarea
                className="flex-1 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500" 
                rows={2}
                placeholder="Add a comment..."
                value={newTaskComment}
                onChange={(e) => setNewTaskComment(e.target.value)}
              ></textarea>
              <button onClick={handleAddComment} className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700">
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Attachments */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Attachments</h2>
            {task.attachments.length > 0 ? (
              <div className="space-y-3">
                {task.attachments.map((attachment) => (
                  <a key={attachment.id} href={attachment.url} target="_blank" rel="noopener noreferrer" className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <Paperclip className="w-5 h-5 text-gray-500 mr-3" />
                    <span className="text-blue-600 hover:underline">{attachment.name}</span>
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No attachments.</p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {/* Task Details Card */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Details</h2>
            <div className="space-y-3">
                <div className="flex items-center">
                    <User className="w-5 h-5 text-gray-500 mr-3" />
                    <div>
                        <p className="text-sm text-gray-500">Assignee</p>
                        <p className="font-semibold">{task.assignee}</p>
                    </div>
                </div>
                <div className="flex items-center">
                    <Flag className="w-5 h-5 text-gray-500 mr-3" />
                    <div>
                        <p className="text-sm text-gray-500">Priority</p>
                        <p className="font-semibold">{task.priority}</p>
                    </div>
                </div>
                <div className="flex items-center">
                    <Tag className="w-5 h-5 text-gray-500 mr-3" />
                    <div>
                        <p className="text-sm text-gray-500">Status</p>
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[task.status]}`}>
                            {task.status}
                        </span>
                    </div>
                </div>
                <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-gray-500 mr-3" />
                    <div>
                        <p className="text-sm text-gray-500">Due Date</p>
                        <p className="font-semibold">{task.dueDate}</p>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    
  );
}
