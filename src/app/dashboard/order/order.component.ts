import { OrderService } from '../../shared/services/order.service';
import { Component } from '@angular/core';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { catchError, EMPTY, forkJoin, of, tap } from 'rxjs';
import { CompanyService } from '../../shared/services/company.service';
import { ClientService } from '../../shared/services/client.service';
import { ProductService } from '../../shared/services/product.service';

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
  products: any[] = [];
  orderToDelete: any | null = null;
  selectedCompanyId: string = '';
  filteredClients: any = [];
  filteredProducts: any = [];
  minDateTime: string = '';

  constructor(private fb: FormBuilder, private orderService: OrderService, private companyService: CompanyService, private clientService: ClientService, private productService: ProductService) {
    this.orderForm = this.fb.group({
      _id: [],
      observation: ['', Validators.required],
      date: ['', Validators.required],
      customer: ['', Validators.required],
      company: ['', Validators.required],
      products: this.fb.array([], Validators.required)
    });
  }

  ngOnInit(): void {
    this.loadOrders();
  }

  onCompanyChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedCompanyId = selectElement.value;
    this.filteredClients = this.clients.filter(client => client.company._id === this.selectedCompanyId);
    this.filteredProducts = this.products.filter(product => product.company._id === this.selectedCompanyId);
    this.updateProductFormArray()
  }

  openModal(action: IAction, order?: any) {
    this.action = action;

    if (action === "UPDATE") {
      this.selectedCompanyId = order?.company._id
      this.filteredClients = this.clients.filter(client => client.company === order?.company._id);
      this.filteredProducts = this.products.filter(product => product.company === order?.company._id);
      this.updateProductFormArray()
      this.orderForm.patchValue(order);
      this.orderForm.patchValue({
        company: order.company._id,
        date: this.convertDateTime(order.date)
      });

    }
    this.isModalVisible = true;
  }

  convertDateTime(inputDate: string): string {
    const date = new Date(inputDate);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  convertDateTimeSimple(inputDate: string): string {
    const date = new Date(inputDate);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year} - ${hours}:${minutes}`;
  }

  closeModal() {
    this.isModalVisible = false;
    this.orderForm.reset();
    this.selectedCompanyId = ""
  }

  confirmDelete(order: any) {
    this.orderToDelete = order;
    this.isDeleteModalVisible = true;
  }

  cancelDelete() {
    this.isDeleteModalVisible = false;
    this.orderToDelete = null;
  }

  updateProductQuantities(): void {
    this.filteredProducts.forEach((product: any) => {
      const controlName = 'quantity_' + product._id;
      if (!this.orderForm.contains(controlName)) {
        this.orderForm.addControl(controlName, new FormControl(0));
      }
    });
  }

  get productsArray(): FormArray {
    return this.orderForm.get('products') as FormArray;
  }

  updateProductFormArray(): void {
    while (this.productsArray.length !== 0) {
      this.productsArray.removeAt(0);
    }

    this.filteredProducts.forEach((product: any) => {
      this.productsArray.push(this.fb.group({
        product: [product._id, Validators.required],
        quantity: [0, Validators.required]
      }));
    });
  }

  getCorporateNameForOrder(companyId: any): string {
    const company = this.companies.find(e => e._id == companyId);

    return company.corporateName;
  }

  getClientNameOrder(custemrId: any): string {
    const client = this.clients.find(e => e._id == custemrId);

    return client.name;
  }

  get modalText(): string {
    return this.action === 'CREATE' ? 'Cadastrar pedido' : 'Atualizar pedido';
  }

  get deleteModalText(): string {
    return `Excluir pedido "${this.orderToDelete?.number}"`;
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
      products: this.productService.getAllProducts().pipe(
        tap((products) => {
          console.log('Produtos carregadas:', products);
        }),
        catchError((error) => {
          console.error('Erro ao carregar produtos:', error);
          return of([]);
        })
      ),
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
      next: ({ companies, clients, products, orders }) => {
        this.companies = companies;
        this.clients = clients;
        this.orders = orders.filter(e => !e.conclude);
        this.products = products;
      },
      error: (error) => {
        console.error('Erro no forkJoin:', error);
      }
    });
  }

  updateOrder(order: any) {
    console.log(order);

    // this.orderService.updateOrder(order._id, order).pipe(
    //   tap(() => this.closeModal()),
    //   catchError((error) => {
    //     console.error('Erro ao atualizar pedido:', error);
    //     return EMPTY;
    //   })
    // ).subscribe(() => {
    //   this.loadOrders();
    // });
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