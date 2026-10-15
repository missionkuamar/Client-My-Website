import React, { useState } from 'react';
import { PlusCircle, BookOpen, Trash2 } from 'lucide-react';

const BlogManager = () => {
  const [blogs, setBlogs] = useState([
    { id: 1, title: 'How to scale SaaS in 2026', date: 'Oct 12, 2026' }
  ]);

  const [newTitle, setNewTitle] = useState('');

  const handleAddBlog = (e) => {
    e.preventDefault();
    if (!newTitle) return;
    setBlogs([...blogs, { id: Date.now(), title: newTitle, date: 'Today' }]);
    setNewTitle('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Add Blog Form */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 h-fit">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Add New Blog Post</h3>
        <form onSubmit={handleAddBlog} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Blog Title</label>
            <input 
              type="text" 
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" 
              placeholder="Enter post title..."
            />
          </div>
          <button type="submit" className="w-full py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
            <PlusCircle size={18} /> Publish Blog
          </button>
        </form>
      </div>

      {/* Blog List */}
      <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <BookOpen size={20} className="text-indigo-600" /> Published Blogs
        </h3>
        <div className="space-y-3">
          {blogs.map(blog => (
            <div key={blog.id} className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:border-slate-200 transition-all">
              <div>
                <h4 className="font-medium text-slate-800">{blog.title}</h4>
                <p className="text-xs text-slate-400 mt-0.5">{blog.date}</p>
              </div>
              <button 
                onClick={() => setBlogs(blogs.filter(b => b.id !== blog.id))}
                className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogManager;