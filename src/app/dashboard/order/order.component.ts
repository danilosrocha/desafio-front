import { OrderService } from '../../shared/services/order.service';
import { Component } from '@angular/core';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { catchError, EMPTY, forkJoin, of, tap } from 'rxjs';
import { CompanyService } from '../../shared/services/company.service';
import { ClientService } from '../../shared/services/client.service';
@Component({
  selector: 'app-order',
  standalone: true,
  imports: [ButtonComponent, ModalComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})


export class OrderComponent {
  isModalVisible: boolean = false;
  isDeleteModalVisible: boolean = false;
  action: IAction = 'CREATE';
  orderForm: FormGroup;
  orders: any[] = [];
  companies: any[] = [];
  clients: any[] = [];
  orderToDelete: any | null = null; // Empresa a ser excluída

  constructor(private fb: FormBuilder, private orderService: OrderService, private companyService: CompanyService, private clientService: ClientService) {
    this.orderForm = this.fb.group({
      _id: [],
      number: [0, Validators.required],
      observation: ['', Validators.required],
      date: ['', Validators.required],
      customer: ['', Validators.required],
      company: ['', Validators.required],
      products: [{
        product: ['', Validators.required],
        quantity: [0, Validators.required],
      }, Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadOrders();
  }

  openModal(action: IAction, order?: any) {
    this.action = action;
    if (action === "UPDATE") {
      this.orderForm.patchValue(order);
    }
    this.isModalVisible = true;
  }

  closeModal() {
    this.isModalVisible = false;
    this.orderForm.reset();
  }

  confirmDelete(order: any) {
    this.orderToDelete = order;
    this.isDeleteModalVisible = true;
  }

  cancelDelete() {
    this.isDeleteModalVisible = false;
    this.orderToDelete = null;
  }

  getCorporateNameForOrder(companyId: any): string {
    const company = this.companies.find(e => e._id == companyId);

    return company.corporateName;
  }

  get modalText(): string {
    return this.action === 'CREATE' ? 'Cadastrar pedido' : 'Atualizar pedido';
  }

  get deleteModalText(): string {
    return `Excluir pedido "${this.orderToDelete?.name}"`;
  }

  onSubmit() {
    if (this.orderForm.valid) {
      const formData = this.orderForm.value;
      formData.user = localStorage.getItem('userId');

      if (this.action === 'CREATE') {
        this.orderService.createOrder(formData).pipe(
          tap(() => {
            this.closeModal(),
              this.loadOrders()
          }),
          catchError((error) => {
            console.error('Erro ao atualizar pedido:', error);
            return EMPTY;
          })
        ).subscribe(() => {
          this.loadOrders();
        });
      } else if (this.action === 'UPDATE') {
        this.updateOrder(this.orderForm.value)
      }
    }
  }


  loadOrders() {
    forkJoin({
      companies: this.companyService.getAllCompanies().pipe(
        tap((companies) => {
          console.log('Empresas carregadas:', companies);
        }),
        catchError((error) => {
          console.error('Erro ao carregar empresas:', error);
          return of([]);
        })
      ),
      clients: this.clientService.getAllClients().pipe(
        tap((clients) => {
          console.log('Clientes carregadas:', clients);
        }),
        catchError((error) => {
          console.error('Erro ao carregar clientes:', error);
          return of([]);
        })
      ),
      orders: this.orderService.getAllOrders().pipe(
        tap((orders) => {
          console.log('Produtos carregados:', orders);
        }),
        catchError((error) => {
          console.error('Erro ao carregar pedidos:', error);
          return of([]);
        })
      )
    }).subscribe({
      next: ({ companies, clients, orders }) => {
        this.companies = companies;
        this.clients = clients;
        this.orders = orders;
      },
      error: (error) => {
        console.error('Erro no forkJoin:', error);
      }
    });
  }

  updateOrder(order: any) {

    this.orderService.updateOrder(order._id, order).pipe(
      tap(() => this.closeModal()),
      catchError((error) => {
        console.error('Erro ao atualizar pedido:', error);
        return EMPTY;
      })
    ).subscribe(() => {
      this.loadOrders();
    });
  }

  deleteOrder() {
    this.orderService.deleteOrder(this.orderToDelete._id).pipe(
      tap(() => this.cancelDelete()),
      catchError((error) => {
        console.error('Erro ao excluir pedido:', error);
        return EMPTY;
      })
    ).subscribe(() => {
      this.loadOrders();
    });
  }
}

type IAction = 'CREATE' | 'UPDATE' | 'DELETE';