import { Component } from '@angular/core';
import HeroComponent from 'src/app/components/shared/hero/hero.component';
import ProductComponent from '../product/product.component';

@Component({
  selector: 'app-home',
  imports: [ HeroComponent, ProductComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
