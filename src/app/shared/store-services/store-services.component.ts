import { Component } from '@angular/core';

export interface Icons {
  imgIcon: string;
  title: string;
}

@Component({
  selector: 'app-store-services',
  imports: [],
  templateUrl: './store-services.component.html',
  styleUrl: './store-services.component.css',
})
export default class StoreServicesComponent {
  icons: Icons[] = [
    {
      imgIcon: 'fa-solid fa-truck',
      title: 'Delivery Services',
    },
    {
      imgIcon: 'fa-solid fa-arrow-right-arrow-left',
      title: 'Shipping & Return',
    },
    {
      imgIcon: 'fa-solid fa-percent',
      title: 'Promotion',
    },
    {
      imgIcon: 'fa-solid fa-headset',
      title: '24 Hours Service',
    },
  ];
}
