export interface EnvironmentImage {
  id: string;
  url: string;
  description: string;
}

export interface Job {
  id: string;
  name: string;
  category: string;
  department: string;
  location: string;
  education: string;
  experience?: string;
  description: string;
  applyUrl: string;
}

export interface TextFormat {
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  textIndent?: number;
  lineHeight?: string;
  letterSpacing?: string;
  fontSize?: string;
  paragraphSpacing?: number;
}

export interface Company {
  name: string;
  logo: string;
  logoSize?: number;
  slogan: string;
  description: string;
  descriptionFormat?: TextFormat;
  image: string;
  backgroundImage: string;
}

export interface Contact {
  address: string;
  email: string;
  phone: string;
}

export interface SiteData {
  company: Company;
  contact: Contact;
  wechatQrcode: string;
  environmentImages: EnvironmentImage[];
  jobs: Job[];
}
