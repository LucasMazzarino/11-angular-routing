import { Component, inject, OnInit } from '@angular/core';
import { IOrder } from '../../../../interfaces/order.interface';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { DeleteOrderService } from '../../../../services/order/delete-order.service';
import { GetAllOrderService } from '../../../../services/order/get-all-order.service';

@Component({
  selector: 'app-order-table',
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './order-table.component.html',
  styleUrl: './order-table.component.scss'
})
export class OrderTableComponent implements OnInit {
  protected orders!: Observable<IOrder[]>;
  private orderSubject = new BehaviorSubject<IOrder[]>([]);
  private deleteOrderService = inject(DeleteOrderService);
  private getAllOrderService = inject(GetAllOrderService);
  
  constructor(private router: Router) {}

  ngOnInit(): void {
    this.orders = this.orderSubject.asObservable();
    this.loadOrders();
  }

  goToEditOrder(id: number) {
    this.router.navigate([`/edit-order/${id}`]);
  }

  deleteOrder(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar esta orden?')) {
      this.deleteOrderService.execute(id).subscribe({
        next: () => {
          const updatedOrder = this.orderSubject.getValue().filter(order => order.id !== id);
          this.orderSubject.next(updatedOrder);
          
        },
        error: (e) => {
          console.error('Error al eliminar la Orden:', e);
        }
      });
    }
  }

  
  loadOrders() {
    this.getAllOrderService.execute().subscribe((data) => {
      this.orderSubject.next(data);   
    });
  }
}
