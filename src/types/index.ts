export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

export interface CustomField {
  id: string;
  label: string;
  value: string;
  icon?: string;
}

export interface VCardData {
  firstName: string;
  lastName: string;
  organization: string;
  title: string;
  email: string;
  phone: string;
  website: string;
  photo?: string;
  social: {
    linkedin: string;
    instagram: string;
    whatsapp: string;
  };
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  theme: 'light' | 'dark';
  template: 'modern' | 'classic' | 'minimal';
  brandColor: string;
  logo?: string;
  customFields: CustomField[];
  additionalSocial: SocialLink[];
  images: string[];
  shareableLink?: string;
}