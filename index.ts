export interface Product {
    _id: string;
    title: string;
    description: string;
    price: number;
    images: Array<{ url: string; _id: string }>;
  }
  
  export interface AuthContextType {
    isLoggedIn: boolean;
    login: () => void;
    logout: () => void;
  }