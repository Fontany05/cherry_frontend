import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterService } from 'src/app/services/filter-service/filter.service';

@Component({
  selector: 'app-mobile-filter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mobileFilter.component.html',
  styleUrl: './mobileFilter.component.css',
})
export class MobileFilterComponent {

  public filterService = inject(FilterService);

}