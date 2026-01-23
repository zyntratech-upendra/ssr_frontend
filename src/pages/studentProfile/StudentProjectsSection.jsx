import { Trash2, Plus } from 'lucide-react';

export default function StudentProjectsSection({
  profile,
  isEditing,
  onObjectArrayChange,
  onAddItem,
  onRemoveItem,
}) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Projects</h3>
        {isEditing && (
          <button
            onClick={onAddItem}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1 transition"
          >
            <Plus className="w-4 h-4" />
            Add Project
          </button>
        )}
      </div>

      {(profile.projects || []).length === 0 ? (
        <p className="text-gray-500">No projects yet</p>
      ) : (
        <div className="space-y-4">
          {(profile.projects || []).map((project, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              {isEditing ? (
                <>
                  <div className="flex justify-end mb-3">
                    <button
                      onClick={() => onRemoveItem(index)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={project.title || ''}
                      onChange={(e) => onObjectArrayChange('projects', index, 'title', e.target.value)}
                      placeholder="Project Title"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-semibold"
                    />
                    <textarea
                      value={project.description || ''}
                      onChange={(e) => onObjectArrayChange('projects', index, 'description', e.target.value)}
                      placeholder="Project Description"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                      rows="2"
                    />
                    <input
                      type="text"
                      value={project.technologies?.join(', ') || ''}
                      onChange={(e) => onObjectArrayChange('projects', index, 'technologies', e.target.value.split(',').map(t => t.trim()))}
                      placeholder="Technologies (comma-separated)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <input
                      type="url"
                      value={project.link || ''}
                      onChange={(e) => onObjectArrayChange('projects', index, 'link', e.target.value)}
                      placeholder="Project Link"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </>
              ) : (
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">{project.title}</h4>
                  <p className="text-gray-700 mb-2">{project.description}</p>
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {project.technologies.map((tech, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:underline text-sm"
                    >
                      View Project →
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
