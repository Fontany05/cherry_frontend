import { Component } from '@angular/core';
import HeroComponent from 'src/app/shared/hero/hero.component';
import StoreServicesComponent from 'src/app/shared/store-services/store-services.component';
import { CategoryGridComponent } from '../../components/category-grid/category-grid.component';
import { FeaturedProductsComponent } from 'src/app/components/featured-products/featured-products.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeroComponent,
    StoreServicesComponent,
    CategoryGridComponent,
    FeaturedProductsComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {}
