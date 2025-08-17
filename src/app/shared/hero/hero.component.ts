import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-hero',
  imports: [ CommonModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css'
})
export default class HeroComponent {
  currentSlide = 0;

  images = [
    {
      src: 'https://res.cloudinary.com/djgryqoma/image/upload/v1752876711/banner_img1_ikhck1.jpg',
      alt: 'Banner 1',
      title: '',
      position: 'center top'
    },
    {
      src: 'https://res.cloudinary.com/djgryqoma/image/upload/v1752876711/banner_img3_j9ccv0.jpg',
      alt: 'Banner 2',
      position: 'center top' 
    },
    {
      src: 'https://res.cloudinary.com/djgryqoma/image/upload/v1752876711/banner_img2_rh4n3k.jpg',
      alt: 'Banner 3',
      position: 'center top' 
    }
  ];

  get totalSlides() {
    return this.images.length;
  }

  nextSlide() {
    this.currentSlide = this.currentSlide === this.totalSlides - 1 ? 0 : this.currentSlide + 1;
  }

  previousSlide() {
    this.currentSlide = this.currentSlide === 0 ? this.totalSlides - 1 : this.currentSlide - 1;
  }

  goToSlide(index: number) {
    this.currentSlide = index;
  }

  isCurrentSlide(index: number): boolean {
    return this.currentSlide === index;
  }

}
