import { Camera, Mail, Phone, Briefcase } from 'lucide-react';

export default function ProfileHeader({ profile, isEditing, onImageChange, onInputChange }) {
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      onImageChange(file);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg shadow-lg p-8">
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
                {profile.fullName?.charAt(0) || 'T'}
              </div>
            )}
          </div>
          {isEditing && (
            <label className="absolute bottom-0 right-0 bg-white text-blue-600 p-2 rounded-full cursor-pointer hover:bg-gray-100 transition">
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
                className="w-full text-3xl font-bold bg-blue-700 text-white placeholder-blue-200 border-b-2 border-blue-400 focus:outline-none pb-2"
              />
              <input
                type="text"
                placeholder="Designation"
                value={profile.designation || ''}
                onChange={(e) => onInputChange('designation', e.target.value)}
                className="w-full text-lg bg-blue-700 text-white placeholder-blue-200 border-b-2 border-blue-400 focus:outline-none pb-2"
              />
            </div>
          ) : (
            <>
              <h1 className="text-4xl font-bold mb-1">{profile.fullName}</h1>
              <p className="text-xl text-blue-100 mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                {profile.designation || 'Designation'}
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
                  className="bg-blue-700 text-white placeholder-blue-200 border-b border-blue-400 focus:outline-none flex-1"
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
                  className="bg-blue-700 text-white placeholder-blue-200 border-b border-blue-400 focus:outline-none flex-1"
                  placeholder="Phone"
                />
              ) : (
                <span>{profile.phone || 'N/A'}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-100">Employee ID:</span>
              {isEditing ? (
                <input
                  type="text"
                  value={profile.employeeId || ''}
                  onChange={(e) => onInputChange('employeeId', e.target.value)}
                  className="bg-blue-700 text-white placeholder-blue-200 border-b border-blue-400 focus:outline-none flex-1"
                  placeholder="ID"
                />
              ) : (
                <span className="font-semibold">{profile.employeeId || 'N/A'}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
