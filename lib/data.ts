import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data.json');

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

export interface Company {
  name: string;
  logo: string;
  slogan: string;
  description: string;
  image: string;
  backgroundImage: string;
}

export interface Contact {
  address: string;
  email: string;
  phone: string;
}

export interface Data {
  company: Company;
  contact: Contact;
  wechatQrcode: string;
  environmentImages: EnvironmentImage[];
  jobs: Job[];
}

export function getData(): Data {
  const fileContents = fs.readFileSync(dataFilePath, 'utf8');
  return JSON.parse(fileContents);
}

export function saveData(data: Data): void {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
}
