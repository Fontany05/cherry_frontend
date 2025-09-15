import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterService } from '../../services/filter-service/filter.service'; 

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
  
})
export class SidebarComponent {

  public filterService = inject(FilterService);

}