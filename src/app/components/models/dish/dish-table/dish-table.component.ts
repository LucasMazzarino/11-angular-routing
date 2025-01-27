import { Component, inject, OnInit} from '@angular/core';
import { IDish } from '../../../../interfaces/dish.interface';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { DeleteDishService } from '../../../../services/dish/delete-dish.service';
import { GetAllDishService } from '../../../../services/dish/get-all-dish.service';

@Component({
  selector: 'app-dish-table',
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './dish-table.component.html',
  styleUrl: './dish-table.component.scss'
})
export class DishTableComponent implements OnInit {

  protected dishes!: Observable<IDish[]>;
  private dishesSubject = new BehaviorSubject<IDish[]>([]);
  private deleteDishService = inject(DeleteDishService);
  private getAllDishService = inject(GetAllDishService);

  
  constructor(private router: Router) {}

  ngOnInit(): void {
    this.dishes = this.dishesSubject.asObservable();
    this.loadDishes();
  }

  loadDishes() {
    this.getAllDishService.execute().subscribe((data) => {
      this.dishesSubject.next(data);
    });
  }

  goToEditDish(id: number) {
   this.router.navigate([`/edit-dish/${id}`]);
  }

  deleteDish(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este plato?')) {
      this.deleteDishService.deleteDish(id).subscribe({
        next: () => {
          const updatedDishes = this.dishesSubject.getValue().filter(dish => dish.id !== id);
          this.dishesSubject.next(updatedDishes);
        },
        error: (e) => {
          console.error('Error al eliminar el plato:', e);
        }
      });
    }
  }

}
