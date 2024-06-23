import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../shared/services/auth/auth.service';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { catchError, EMPTY, forkJoin, of, tap } from 'rxjs';
import { OrderService } from '../../shared/services/order.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, ModalComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  orders: any[] = [];
  isModalVisible: boolean = false
  orderId: string = ""

  constructor(private authService: AuthService, private router: Router, private orderService: OrderService) {
  }

  ngOnInit(): void {
    this.loadOrders();
  }

  logout() {
    this.authService.logout();
  }

  openModal(orderId: string) {
    this.isModalVisible = true;
    this.orderId = orderId;
  }

  closeModal() {
    this.isModalVisible = false;
  }

  finalize() {
    this.orderService.concludeOrder(this.orderId).pipe(
      tap(() => {
        this.closeModal()
      }),
      catchError((error) => {
        console.error('Erro ao finalizr o pedido:', error);
        return EMPTY;
      })
    ).subscribe(() => {
      this.loadOrders();
    });
  }

  loadOrders() {
    forkJoin({
      orders: this.orderService.getAllOrders().pipe(
        tap((orders) => {
          console.log('Pedidos carregados:', orders);
        }),
        catchError((error) => {
          console.error('Erro ao carregar pedidos:', error);
          return of([]);
        })
      )
    }).subscribe({
      next: ({ orders }) => {
        this.orders = orders.filter(e => !e.conclude);
      },
      error: (error) => {
        console.error('Erro no forkJoin:', error);
      }
    });
  }
}
