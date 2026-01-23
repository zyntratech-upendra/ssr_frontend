import { Linkedin, Github, Twitter, Globe } from 'lucide-react';

export default function SocialLinks({ links, isEditing, onChange }) {
  const socialPlatforms = [
    { key: 'linkedin', label: 'LinkedIn', icon: Linkedin, placeholder: 'LinkedIn URL' },
    { key: 'github', label: 'GitHub', icon: Github, placeholder: 'GitHub URL' },
    { key: 'twitter', label: 'Twitter', icon: Twitter, placeholder: 'Twitter URL' },
    { key: 'website', label: 'Website', icon: Globe, placeholder: 'Website URL' },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Links</h3>
      <div className="space-y-4">
        {socialPlatforms.map(({ key, label, icon: Icon, placeholder }) => (
          <div key={key} className="flex items-center gap-3">
            <Icon className="w-5 h-5 text-gray-600" />
            {isEditing ? (
              <input
                type="url"
                placeholder={placeholder}
                value={links[key] || ''}
                onChange={(e) => onChange(key, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <a
                href={links[key]}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline flex-1"
              >
                {links[key] || `No ${label} profile`}
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
