import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';
import { AuthService } from './services/auth/auth.service';
import { Store } from '@ngrx/store';
import * as CartActions from './store/cart/cart.actions';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'cherry';
  private authService = inject(AuthService);
  private store = inject(Store);

  ngOnInit(): void {
    this.authService.checkAuth().subscribe((isAuth) => {
      if (isAuth) {
        this.store.dispatch(CartActions.loadCart({ userId: this.authService.userId()! }));
      }
    });
  }
}