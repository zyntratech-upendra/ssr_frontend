export default function ExperienceSection({ profile, isEditing, onInputChange }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Experience</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Years of Experience
          </label>
          {isEditing ? (
            <input
              type="number"
              min="0"
              value={profile.experienceYears || ''}
              onChange={(e) => onInputChange('experienceYears', parseInt(e.target.value) || 0)}
              placeholder="Enter years of experience"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          ) : (
            <p className="text-gray-700">
              {profile.experienceYears ? `${profile.experienceYears} years` : 'Not specified'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
