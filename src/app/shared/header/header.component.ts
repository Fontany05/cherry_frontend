import { CommonModule } from '@angular/common';
import { Component, inject, computed } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Store } from '@ngrx/store';
import { selectCartData } from 'src/app/store/cart/cart.selectors';
import * as CartActions from 'src/app/store/cart/cart.actions';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  private authService = inject(AuthService);
  private store = inject(Store);
  private router = inject(Router);

  isOpen = true;
  isMenuOpen = false;

  // Signal para verificar autenticación
  isAuthenticated = this.authService.isAuthenticated;

  // Usar el selector del Store. 
  // Esto hará que el contador reaccione a los Effects y al Reducer
  private cartData = this.store.selectSignal(selectCartData);

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  // 5. Contador inteligente basado en el Store
  cartCount = computed(() => {
    const cart = this.cartData();
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((acc, item) => acc + item.quantity, 0);
  });

  goToCart(): void {
  // Ahora permitimos que cualquiera entre a ver sus productos
  this.router.navigate(['/cart']);
}


logout(): void {
    // Borramos el token y el estado de sesión en el servicio
    this.authService.logout(); 

    // Limpiamos el carrito en el Store y LocalStorage
    // Esto es vital para que el carrito no se quede "pegado" al cerrar sesión
    this.store.dispatch(CartActions.clearCart());

    // Redirigimos al inicio
    this.router.navigate(['/home']);
    
    // Opcional: Cerrar el menú si estás en móvil
    this.isMenuOpen = false;
  }
}
