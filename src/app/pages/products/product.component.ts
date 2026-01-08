import { Component, OnInit, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { FilterService } from '../../services/filter-service/filter.service';
import { ProductListComponent } from 'src/app/components/product-list/product-list.component';
import { SidebarComponent } from 'src/app/components/sidebarFilter/sidebar.component';
import { MobileFilterComponent } from 'src/app/components/mobileFilter/mobileFilter.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, ProductListComponent, SidebarComponent, MobileFilterComponent],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css',
})
export class ProductComponent implements OnInit {

  public filterService = inject(FilterService);

  isMobile = false;
  

  ngOnInit() {
    this.checkScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    this.isMobile = window.innerWidth < 1024;
  }
}