
export interface Product {
  _id: string; 
  name: string;
  description: string;
  price: number;
  brand: string; 
  image: string;
  cloudinary_id: string;
  stock: number;
  categories: string;
  subcategory?: string;  
  featured: boolean; 
  active: boolean;
}

//all products
export interface ProductData {
  error: boolean; 
  data: Product[]; 
}

//product by id
export interface ProductDetailResponse {
  error: boolean; 
  data: Product; 
}