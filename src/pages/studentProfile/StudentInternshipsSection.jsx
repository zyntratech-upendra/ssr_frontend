import { Trash2, Plus } from 'lucide-react';

export default function StudentInternshipsSection({
  profile,
  isEditing,
  onObjectArrayChange,
  onAddItem,
  onRemoveItem,
}) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Internships</h3>
        {isEditing && (
          <button
            onClick={onAddItem}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1 transition"
          >
            <Plus className="w-4 h-4" />
            Add Internship
          </button>
        )}
      </div>

      {(profile.internships || []).length === 0 ? (
        <p className="text-gray-500">No internships yet</p>
      ) : (
        <div className="space-y-4">
          {(profile.internships || []).map((internship, index) => (
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
                      value={internship.company || ''}
                      onChange={(e) => onObjectArrayChange('internships', index, 'company', e.target.value)}
                      placeholder="Company Name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-semibold"
                    />
                    <input
                      type="text"
                      value={internship.position || ''}
                      onChange={(e) => onObjectArrayChange('internships', index, 'position', e.target.value)}
                      placeholder="Position"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      value={internship.duration || ''}
                      onChange={(e) => onObjectArrayChange('internships', index, 'duration', e.target.value)}
                      placeholder="Duration (e.g., Jan 2023 - Mar 2023)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <textarea
                      value={internship.description || ''}
                      onChange={(e) => onObjectArrayChange('internships', index, 'description', e.target.value)}
                      placeholder="Description of work"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                      rows="2"
                    />
                  </div>
                </>
              ) : (
                <div>
                  <h4 className="font-bold text-gray-900">{internship.company}</h4>
                  <p className="text-green-600 font-medium text-sm mb-1">{internship.position}</p>
                  <p className="text-gray-600 text-sm mb-2">{internship.duration}</p>
                  <p className="text-gray-700">{internship.description}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
