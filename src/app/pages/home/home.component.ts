import { Component } from '@angular/core';
import HeroComponent from 'src/app/shared/hero/hero.component';
import StoreServicesComponent from 'src/app/shared/store-services/store-services.component';


@Component({
  selector: 'app-home',
  imports: [ HeroComponent, StoreServicesComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
