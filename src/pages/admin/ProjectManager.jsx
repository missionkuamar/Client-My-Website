import React, { useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';

const ProjectManager = () => {
  const [projects, setProjects] = useState([
    { id: 1, title: 'InvoiceHub.fun', category: 'SaaS Platform', status: 'Active' },
    { id: 2, title: 'Task Management App', category: 'MERN Stack', status: 'Active' },
  ]);

  const handleDelete = (id) => {
    setProjects(projects.filter(p => p.id !== id));
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <h2 className="text-xl font-bold text-slate-800 mb-4">Manage Projects (CRUD)</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase">
              <th className="pb-3">Project Title</th>
              <th className="pb-3">Category</th>
              <th className="pb-3">Status</th>
              <th className="pb-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-sm text-slate-600">
            {projects.map((proj) => (
              <tr key={proj.id}>
                <td className="py-4 font-medium text-slate-800">{proj.title}</td>
                <td>{proj.category}</td>
                <td><span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-medium">{proj.status}</span></td>
                <td className="py-4 text-right space-x-2">
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Edit size={16} /></button>
                  <button onClick={() => handleDelete(proj.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectManager;