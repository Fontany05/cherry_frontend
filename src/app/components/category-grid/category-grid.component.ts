import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FilterService } from 'src/app/services/filter-service/filter.service';
import type { CategoryForHome } from 'src/interfaces/filterSidebar.interface';

@Component({
  selector: 'app-category-grid',
  imports: [],
  templateUrl: './category-grid.component.html',
  styleUrl: './category-grid.component.css',
})
export class CategoryGridComponent implements OnInit {
  categories: CategoryForHome[] = [];
  isLoading = true;

  constructor(
    private filterService: FilterService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categories = this.filterService.getCategoriesForHome();
    this.isLoading = false;
  }

  onCategoryClick(category: CategoryForHome): void {
    this.router.navigate(['/products'], {
      queryParams: { category: category.id },
    });
  }
}
