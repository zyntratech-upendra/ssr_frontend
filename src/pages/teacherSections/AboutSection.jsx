export default function AboutSection({ profile, isEditing, onInputChange }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">About</h3>
      {isEditing ? (
        <textarea
          value={profile.about || ''}
          onChange={(e) => onInputChange('about', e.target.value)}
          placeholder="Write about yourself..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          rows="4"
        />
      ) : (
        <p className="text-gray-700 leading-relaxed">
          {profile.about || 'No information provided'}
        </p>
      )}
    </div>
  );
}
