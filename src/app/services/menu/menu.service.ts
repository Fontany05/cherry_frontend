import { Injectable } from '@angular/core';
import { MenuItem, SocialLink } from 'src/interfaces/menu-item.interface';

@Injectable({ providedIn: 'root' })
export class MenuService {
  
  getSocialLinks(): SocialLink[] {
    return [
      {
        id: 'facebook',
        url: 'https://es-la.facebook.com/',
        icon: 'fab fa-facebook-f',
        label: 'Facebook'
      },
      {
        id: 'instagram',
        url: 'https://www.instagram.com/',
        icon: 'fab fa-instagram',
        label: 'Instagram'
      },
      {
        id: 'twitter',
        url: 'https://twitter.com/',
        icon: 'fa-brands fa-x-twitter',
        label: 'Twitter'
      },
      {
        id: 'whatsapp',
        url: '#',
        icon: 'fa-brands fa-whatsapp',
        label: 'WhatsApp'
      }
    ];
  }

  getMainMenuItems(): MenuItem[] {
    return [
      {
        id: 'home',
        label: 'Home',
        route: '/home',
        className: 'hover:text-red-300'
      },
      {
        id: 'products',
        label: 'Products',
        route: '/products',
        className: 'hover:text-red-300'
      },
      {
        id: 'contact',
        label: 'Contact',
        route: '/contact',
        className: 'hover:text-red-300'
      }
    ];
  }

  getAuthMenuItems(): MenuItem[] {
    return [
      {
        id: 'signup',
        label: 'Sign Up',
        route: '/register',
        className: 'text-white text-decoration-none me-2 text-sm'
      },
      {
        id: 'login',
        label: 'Log In',
        route: '/login',
        className: 'text-white text-decoration-none me-2 text-sm'
      }
    ];
  }

  getActionItems(): MenuItem[] {
    return [
      {
        id: 'cart',
        label: 'Cart',
        icon: 'fa-solid fa-cart-plus',
        route: '/cart',
        className: 'text-red-300'
      },
      {
        id: 'logout',
        label: 'Logout',
        icon: 'fa-solid fa-arrow-right-from-bracket',
        className: 'text-red-300'
      }
    ];
  }
}


