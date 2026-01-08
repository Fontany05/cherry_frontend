import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';

import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects'; // <--- IMPORTAR
import { cartReducer } from './store/cart/cart.reducer';
import { CartEffects } from './store/cart/cart.effects'; // <--- IMPORTAR

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(withFetch()),

    provideStore({
      cart: cartReducer
    }),

    // Registrar los effects aquí para que escuchen las acciones del componente
    provideEffects(CartEffects), 
  ],
};