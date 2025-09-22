import { Routes } from '@angular/router';
import ContactComponent from './shared/contact/contact.component';
import ProductComponent from './pages/products/product.component';
import LoginComponent from './pages/login/login.component';
import RegisterComponent from './pages/register/register.component';
import HomeComponent from './pages/home/home.component';
import ProductDetailComponent from './components/ product-detail/ product-detail.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'products', component: ProductComponent },
  { path: 'products/:id', component: ProductDetailComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '**', redirectTo: '/home' },
];
