import { Routes } from '@angular/router';

export const routes: Routes = [

    {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard.component'),
        children: [
            {
                path: 'products-list',
                title: 'Products',
                loadComponent:() => import('./dashboard/pages/products/products.component'),
            },
            {
                path: 'contact',
                title: 'Contact',
                loadComponent: () => import('./dashboard/pages/contact/contact.component'),
            },
            {
                path: 'product/:id',
                title: 'Product-item',
                loadComponent:() => import('./dashboard/pages/product/product.component'),
            },

        ] 
    }, {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
    }


];
