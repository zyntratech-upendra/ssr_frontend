import { Camera, Mail, Phone, BookOpen, TrendingUp } from 'lucide-react';

export default function StudentProfileHeader({ profile, isEditing, onImageChange, onInputChange }) {
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      onImageChange(file);
    }
  };

  return (
    <div className="bg-gradient-to-r from-green-600 to-green-800 text-white rounded-lg shadow-lg p-8">
      <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
        <div className="relative">
          <div className="w-32 h-32 bg-gray-300 rounded-lg overflow-hidden flex items-center justify-center">
            {profile.profileImage ? (
              <img
                src={profile.profileImage}
                alt={profile.fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-4xl font-bold text-gray-600">
                {profile.fullName?.charAt(0) || 'S'}
              </div>
            )}
          </div>
          {isEditing && (
            <label className="absolute bottom-0 right-0 bg-white text-green-600 p-2 rounded-full cursor-pointer hover:bg-gray-100 transition">
              <Camera className="w-5 h-5" />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          )}
        </div>

        <div className="flex-1 w-full">
          {isEditing ? (
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Full Name"
                value={profile.fullName || ''}
                onChange={(e) => onInputChange('fullName', e.target.value)}
                className="w-full text-3xl font-bold bg-green-700 text-white placeholder-green-200 border-b-2 border-green-400 focus:outline-none pb-2"
              />
              <input
                type="text"
                placeholder="Student ID"
                value={profile.studentId || ''}
                onChange={(e) => onInputChange('studentId', e.target.value)}
                className="w-full text-lg bg-green-700 text-white placeholder-green-200 border-b-2 border-green-400 focus:outline-none pb-2"
              />
            </div>
          ) : (
            <>
              <h1 className="text-3xl  text-white font-bold mb-1">{profile.fullName}</h1>
              <p className="text-lg text-green-100 mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                ID: {profile.studentId || 'Not specified'}
              </p>
            </>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              {isEditing ? (
                <input
                  type="email"
                  value={profile.email || ''}
                  onChange={(e) => onInputChange('email', e.target.value)}
                  className="bg-green-700 text-white placeholder-green-200 border-b border-green-400 focus:outline-none flex-1"
                  placeholder="Email"
                />
              ) : (
                <span>{profile.email}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              {isEditing ? (
                <input
                  type="tel"
                  value={profile.phone || ''}
                  onChange={(e) => onInputChange('phone', e.target.value)}
                  className="bg-green-700 text-white placeholder-green-200 border-b border-green-400 focus:outline-none flex-1"
                  placeholder="Phone"
                />
              ) : (
                <span>{profile.phone || 'N/A'}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              {isEditing ? (
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  value={profile.cgpa || ''}
                  onChange={(e) => onInputChange('cgpa', parseFloat(e.target.value) || 0)}
                  className="bg-green-700 text-white placeholder-green-200 border-b border-green-400 focus:outline-none flex-1"
                  placeholder="CGPA"
                />
              ) : (
                <span className="font-semibold">CGPA: {profile.cgpa || 'N/A'}</span>
              )}
            </div>
          </div>

          <div className="mt-4">
            {isEditing ? (
              <input
                type="number"
                min="1"
                max="8"
                value={profile.semester || ''}
                onChange={(e) => onInputChange('semester', parseInt(e.target.value) || 0)}
                placeholder="Semester"
                className="bg-green-700 text-white placeholder-green-200 border-b border-green-400 focus:outline-none"
              />
            ) : (
              <p className="text-green-100">
                Semester: <span className="font-semibold">{profile.semester || 'N/A'}</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
