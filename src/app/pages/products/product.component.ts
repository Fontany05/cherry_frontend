import { Component, OnInit, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FilterService } from '../../services/filter-service/filter.service';
import { ProductListComponent } from 'src/app/components/product-list/product-list.component';
import { SidebarComponent } from 'src/app/components/sidebarFilter/sidebar.component';
import { MobileFilterComponent } from 'src/app/components/mobileFilter/mobileFilter.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    ProductListComponent,
    SidebarComponent,
    MobileFilterComponent,
  ],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css',
})
export class ProductComponent implements OnInit {
  public filterService = inject(FilterService);
  private route = inject(ActivatedRoute);

  isMobile = false;

  ngOnInit() {
    this.checkScreenSize();

    this.route.queryParams.subscribe((params) => {
      const search = params['search'] || '';
      const category = params['category'] || '';

      if (search) {
        this.filterService.setSearch(search);
      } else if (category) {
        this.filterService.onCategoryClick(category);
      } else {
        this.filterService.loadAllProducts();
      }
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    this.isMobile = window.innerWidth < 1024;
  }
}
