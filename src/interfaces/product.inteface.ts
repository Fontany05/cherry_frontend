export interface Product {
  _id: string; 
  name: string;
  description: string;
  price: number;
  image?: string; 
  brand?: string; 
  cloudinary_id?: string; 
  stock: number;
  categories?: string; 
  featured: boolean; 
  active: boolean;
}

export interface ProductData {
  error: boolean; 
  data: Product[]; 
}