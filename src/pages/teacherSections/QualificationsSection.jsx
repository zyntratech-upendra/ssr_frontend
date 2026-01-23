import { Trash2 } from 'lucide-react';

export default function QualificationsSection({ profile, isEditing, onInputChange, onArrayChange }) {
  const handleAddItem = (field) => {
    const currentArray = profile[field] || [];
    onArrayChange(field, [...currentArray, '']);
  };

  const handleRemoveItem = (field, index) => {
    const currentArray = profile[field] || [];
    onArrayChange(field, currentArray.filter((_, i) => i !== index));
  };

  const handleItemChange = (field, index, value) => {
    const currentArray = profile[field] || [];
    const updated = [...currentArray];
    updated[index] = value;
    onArrayChange(field, updated);
  };

  const sections = [
    { field: 'qualifications', label: 'Qualifications', placeholder: 'Add qualification' },
    { field: 'subjects', label: 'Subjects Taught', placeholder: 'Add subject' },
    { field: 'researchInterests', label: 'Research Interests', placeholder: 'Add research interest' },
    { field: 'publications', label: 'Publications', placeholder: 'Add publication' },
    { field: 'achievements', label: 'Achievements', placeholder: 'Add achievement' },
  ];

  return (
    <div className="space-y-6">
      {sections.map(({ field, label, placeholder }) => (
        <div key={field} className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{label}</h3>
            {isEditing && (
              <button
                onClick={() => handleAddItem(field)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition"
              >
                + Add
              </button>
            )}
          </div>

          <div className="space-y-2">
            {(profile[field] || []).length === 0 ? (
              <p className="text-gray-500">No {label.toLowerCase()} yet</p>
            ) : (
              (profile[field] || []).map((item, index) => (
                <div key={index} className="flex gap-2 items-center">
                  {isEditing ? (
                    <>
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => handleItemChange(field, index, e.target.value)}
                        placeholder={placeholder}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        onClick={() => handleRemoveItem(field, index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <div className="flex-1 p-3 bg-gray-50 rounded-lg">
                      {item}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
