import React, { useRef } from 'react';
import { useVCardStore } from '../store/useVCardStore';
import { Button } from './ui/Button';
import { 
  User, 
  Building2, 
  Mail, 
  Phone, 
  Globe, 
  Linkedin, 
  Instagram, 
  MessageCircle,
  MapPin,
  Plus,
  X,
  Upload,
  Facebook,
  Twitter,
  Github,
  Youtube
} from 'lucide-react';

const ADDITIONAL_PLATFORMS = [
  { name: 'Facebook', icon: Facebook },
  { name: 'Twitter', icon: Twitter },
  { name: 'GitHub', icon: Github },
  { name: 'YouTube', icon: Youtube },
];

export const VCardForm: React.FC = () => {
  const { 
    data, 
    setData, 
    addCustomField, 
    removeCustomField,
    addSocialLink,
    removeSocialLink 
  } = useVCardStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setData({ photo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddCustomField = () => {
    addCustomField({
      label: '',
      value: '',
      icon: 'Plus',
    });
  };

  const handleAddSocialPlatform = () => {
    const platform = ADDITIONAL_PLATFORMS.find(
      p => !data.additionalSocial.some(s => s.platform === p.name)
    );
    if (platform) {
      addSocialLink({
        platform: platform.name,
        url: '',
        icon: platform.name.toLowerCase(),
      });
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 space-y-8">
      <div className="space-y-6">
        {/* Photo Upload */}
        <div className="flex justify-center">
          <div className="relative">
            <div 
              className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer overflow-hidden"
              onClick={() => fileInputRef.current?.click()}
            >
              {data.photo ? (
                <img src={data.photo} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <Upload className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoUpload}
            />
          </div>
        </div>

        {/* Basic Information */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-medium">
              <User className="w-4 h-4" />
              <span>First Name</span>
            </label>
            <input
              type="text"
              value={data.firstName}
              onChange={(e) => setData({ firstName: e.target.value })}
              className="w-full p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-medium">
              <User className="w-4 h-4" />
              <span>Last Name</span>
            </label>
            <input
              type="text"
              value={data.lastName}
              onChange={(e) => setData({ lastName: e.target.value })}
              className="w-full p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-sm font-medium">
            <Building2 className="w-4 h-4" />
            <span>Organization</span>
          </label>
          <input
            type="text"
            value={data.organization}
            onChange={(e) => setData({ organization: e.target.value })}
            className="w-full p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-sm font-medium">
            <Mail className="w-4 h-4" />
            <span>Email</span>
          </label>
          <input
            type="email"
            value={data.email}
            onChange={(e) => setData({ email: e.target.value })}
            className="w-full p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-sm font-medium">
            <Phone className="w-4 h-4" />
            <span>Phone</span>
          </label>
          <input
            type="tel"
            value={data.phone}
            onChange={(e) => setData({ phone: e.target.value })}
            className="w-full p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-sm font-medium">
            <Globe className="w-4 h-4" />
            <span>Website</span>
          </label>
          <input
            type="url"
            value={data.website}
            onChange={(e) => setData({ website: e.target.value })}
            className="w-full p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Social Media</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-medium">
                <Linkedin className="w-4 h-4" />
                <span>LinkedIn</span>
              </label>
              <input
                type="url"
                value={data.social.linkedin}
                onChange={(e) => setData({ social: { ...data.social, linkedin: e.target.value } })}
                className="w-full p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-medium">
                <Instagram className="w-4 h-4" />
                <span>Instagram</span>
              </label>
              <input
                type="url"
                value={data.social.instagram}
                onChange={(e) => setData({ social: { ...data.social, instagram: e.target.value } })}
                className="w-full p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-medium">
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </label>
              <input
                type="tel"
                value={data.social.whatsapp}
                onChange={(e) => setData({ social: { ...data.social, whatsapp: e.target.value } })}
                className="w-full p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Address</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-medium">
                <MapPin className="w-4 h-4" />
                <span>Street Address</span>
              </label>
              <input
                type="text"
                value={data.address.street}
                onChange={(e) => setData({ address: { ...data.address, street: e.target.value } })}
                className="w-full p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">City</label>
                <input
                  type="text"
                  value={data.address.city}
                  onChange={(e) => setData({ address: { ...data.address, city: e.target.value } })}
                  className="w-full p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">State</label>
                <input
                  type="text"
                  value={data.address.state}
                  onChange={(e) => setData({ address: { ...data.address, state: e.target.value } })}
                  className="w-full p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">ZIP Code</label>
                <input
                  type="text"
                  value={data.address.zip}
                  onChange={(e) => setData({ address: { ...data.address, zip: e.target.value } })}
                  className="w-full p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Country</label>
                <input
                  type="text"
                  value={data.address.country}
                  onChange={(e) => setData({ address: { ...data.address, country: e.target.value } })}
                  className="w-full p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Custom Fields */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Custom Fields</h3>
            <Button variant="secondary" size="sm" onClick={handleAddCustomField}>
              <Plus className="w-4 h-4 mr-2" />
              Add Field
            </Button>
          </div>
          {data.customFields.map((field) => (
            <div key={field.id} className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Label"
                value={field.label}
                onChange={(e) =>
                  setData({
                    customFields: data.customFields.map((f) =>
                      f.id === field.id ? { ...f, label: e.target.value } : f
                    ),
                  })
                }
                className="flex-1 p-2 rounded-md border border-gray-300"
              />
              <input
                type="text"
                placeholder="Value"
                value={field.value}
                onChange={(e) =>
                  setData({
                    customFields: data.customFields.map((f) =>
                      f.id === field.id ? { ...f, value: e.target.value } : f
                    ),
                  })
                }
                className="flex-1 p-2 rounded-md border border-gray-300"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeCustomField(field.id)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>

        {/* Additional Social Media */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Additional Social Media</h3>
            <Button variant="secondary" size="sm" onClick={handleAddSocialPlatform}>
              <Plus className="w-4 h-4 mr-2" />
              Add Platform
            </Button>
          </div>
          {data.additionalSocial.map((link) => (
            <div key={link.platform} className="flex items-center space-x-2">
              <span className="w-24">{link.platform}</span>
              <input
                type="url"
                placeholder={`${link.platform} URL`}
                value={link.url}
                onChange={(e) =>
                  setData({
                    additionalSocial: data.additionalSocial.map((l) =>
                      l.platform === link.platform
                        ? { ...l, url: e.target.value }
                        : l
                    ),
                  })
                }
                className="flex-1 p-2 rounded-md border border-gray-300"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeSocialLink(link.platform)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button variant="secondary">Preview</Button>
        <Button>Generate vCard</Button>
      </div>
    </div>
  );
};