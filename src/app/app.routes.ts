import { Routes } from '@angular/router';
import ContactComponent from './pages/contact/contact.component';
import ProductsComponent from './pages/products/products.component';
import LoginComponent from './pages/login/login.component'
import RegisterComponent  from './pages/register/register.component';
import { HomeComponent } from './pages/home/home.component';


export const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'products',
    component: ProductsComponent
   },
  {
    path: 'contact',
    component: ContactComponent
  },
  { path: 'login', 
    component: LoginComponent },

  { path: 'register', 
    component: RegisterComponent },

  {
    path: '**',
    redirectTo: ''
  }
];
