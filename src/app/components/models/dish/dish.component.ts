import { Component} from '@angular/core';
import { IDish } from '../../../interfaces/dish.interface';
import { DishTableComponent } from './dish-table/dish-table.component';
import { BehaviorSubject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dish',
  imports: [CommonModule,DishTableComponent,RouterLink],
  templateUrl: './dish.component.html',
  styleUrl: './dish.component.scss'
})
export class DishComponent {

  dishes = new BehaviorSubject<IDish[]>([]);
  
  constructor() {}

}
