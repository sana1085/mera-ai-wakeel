export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface LegalTemplate {
  id: string;
  name: string;
  price: number;
  description: string;
}

export interface Advocate {
  id: string;
  name: string;
  specialty: string;
  city: string;
}
