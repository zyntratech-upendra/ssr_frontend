import { Trash2 } from 'lucide-react';

export default function StudentSkillsSection({ profile, isEditing, onArrayChange }) {
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
    { field: 'skills', label: 'Skills', placeholder: 'Add a skill' },
    { field: 'languages', label: 'Languages', placeholder: 'Add a language' },
    { field: 'certifications', label: 'Certifications', placeholder: 'Add certification' },
    { field: 'achievements', label: 'Achievements', placeholder: 'Add achievement' },
    { field: 'interests', label: 'Interests', placeholder: 'Add interest' },
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
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition"
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
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                      <button
                        onClick={() => handleRemoveItem(field, index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <div className="flex-1 p-3 bg-green-50 rounded-lg text-gray-700 font-medium">
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
