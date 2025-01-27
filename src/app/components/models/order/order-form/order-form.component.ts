import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { EditOrderService } from '../../../../services/order/edit-order.service';
import { GetOrderService } from '../../../../services/order/get-order.service';
import { GetAllClientService } from '../../../../services/client/get-all-client.service';
import { GetAllDishService } from '../../../../services/dish/get-all-dish.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IClient } from '../../../../interfaces/client.interface';
import { IDish } from '../../../../interfaces/dish.interface';
import { AddOrderService } from '../../../../services/order/add-order.service';
import { CommonModule } from '@angular/common';
import { DynamicInputComponent } from 'src/app/components/custom/dynamic-input/dynamuc-input.component';

@Component({
  selector: 'app-order-form',
  imports: [ReactiveFormsModule, CommonModule, DynamicInputComponent],
  templateUrl: './order-form.component.html',
  styleUrl: './order-form.component.scss',
})
export class OrderFormComponent implements OnInit {
  orderForm: FormGroup;
  clients: IClient[] = [];
  dishes: IDish[] = [];
  private editOrderService = inject(EditOrderService);
  private addOrderService = inject(AddOrderService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  protected orderId: number | null = null;
  isLoading = true;

  
    clientConfig = {
      name: 'clientId',
      label: 'Cliente',
      type: 'select',
      options: [] as { label: string; value: any }[],
      placeholder: 'Seleccione un cliente',
      errorMessage: 'Debe seleccionar un cliente.'
    };

    dishConfig = {
      name: 'dishIds',
      label: 'Platos',
      type: 'selectM',
      options: [] as { label: string; value: any }[],
      placeholder: 'Seleccione platos',
      errorMessage: 'Debe seleccionar al menos un plato.'
      
    };


  constructor(
    private fb: FormBuilder,
    private getAllClientService: GetAllClientService,
    private getAllDishService: GetAllDishService,
    private getOrderService: GetOrderService,
  ) {
    this.orderForm = this.fb.group({
      clientId: ['', Validators.required],
      dishIds: [[], Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.orderId = +id;
        this.orderData(this.orderId);
      } else {
        this.isLoading = false;
      }
    });
    this.loadClients();
    this.loadDishes();
  }

  loadClients(): void {
    this.getAllClientService.execute().subscribe({
      next: (data) => {
        this.clients = data;
        this.clientConfig.options = data.map((client) => ({
          label: client.name,
          value: client.id
        }));
      },
      error: (e) => console.error('Error al cargar los clientes:', e),
    });
  }

  loadDishes(): void {
    this.getAllDishService.execute().subscribe({
      next: (data) => {
        this.dishes = data;
        this.dishConfig.options = data.map((dish) => ({
          label: dish.name,
          value: dish.id,
      }));
    },
      error: (e) => console.error('Error al cargar los platos:', e),
      complete: () => (this.isLoading = false),
    });
  }

  orderData(id: number): void {
    this.getOrderService.execute(id).subscribe({
      next: (order) => {
        this.orderForm.patchValue({ clientId: order.clientId });
        const dishesFormArray = this.orderForm.get('dishes') as FormArray;
        order.dishes.forEach((dish: any) => {
          dishesFormArray.push(this.fb.control(dish));
        });
        this.isLoading = false;
      },
      error: (e) => {
        console.error('Error al cargar los datos de la orden:', e);
        this.isLoading = false;
      },
    });
  }

  submit(): void {
    if (this.orderForm.valid) {
      const orderData = this.orderForm.value;

      if (this.orderId) {
        this.editOrderService.updateOrder(this.orderId, orderData).subscribe({
          next: () => this.router.navigate(['/order']),
          error: (e) => console.error('Error al actualizar la orden:', e),
        });
      } else {
        this.addOrderService.execute(orderData).subscribe({
          next: () => this.router.navigate(['/order']),
          error: (e) => console.error('Error al agregar la orden:', e),
        });
      }
    }
  }
}
