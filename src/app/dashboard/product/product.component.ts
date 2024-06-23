import { ProductService } from '../../shared/services/product.service';
import { Component } from '@angular/core';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { catchError, EMPTY, forkJoin, of, tap } from 'rxjs';
import { CompanyService } from '../../shared/services/company.service';
@Component({
  selector: 'app-product',
  standalone: true,
  imports: [ButtonComponent, ModalComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})


export class ProductComponent {
  isModalVisible: boolean = false;
  isDeleteModalVisible: boolean = false;
  action: IAction = 'CREATE';
  productForm: FormGroup;
  products: any[] = [];
  companies: any[] = [];
  productToDelete: any | null = null; // Empresa a ser excluída

  constructor(private fb: FormBuilder, private productService: ProductService, private companyService: CompanyService) {
    this.productForm = this.fb.group({
      _id: [],
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required],
      company: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  openModal(action: IAction, product?: any) {
    this.action = action;
    if (action === "UPDATE") {
      this.productForm.patchValue(product);
    }
    this.isModalVisible = true;
  }

  closeModal() {
    this.isModalVisible = false;
    this.productForm.reset();
  }

  confirmDelete(product: any) {
    this.productToDelete = product;
    this.isDeleteModalVisible = true;
  }

  cancelDelete() {
    this.isDeleteModalVisible = false;
    this.productToDelete = null;
  }

  getCorporateNameForProduct(companyId: any): string {
    const company = this.companies.find(e => e._id == companyId);

    return company.corporateName;
  }

  get modalText(): string {
    return this.action === 'CREATE' ? 'Cadastrar produto' : 'Atualizar produto';
  }

  get deleteModalText(): string {
    return `Excluir produto "${this.productToDelete?.name}"`;
  }

  onSubmit() {
    if (this.productForm.valid) {
      const formData = this.productForm.value;
      formData.user = localStorage.getItem('userId');

      if (this.action === 'CREATE') {
        this.productService.createProduct(formData).pipe(
          tap(() => {
            this.closeModal(),
              this.loadProducts()
          }),
          catchError((error) => {
            console.error('Erro ao atualizar produto:', error);
            return EMPTY;
          })
        ).subscribe(() => {
          this.loadProducts();
        });
      } else if (this.action === 'UPDATE') {
        this.updateProduct(this.productForm.value)
      }
    }
  }


  loadProducts() {
    forkJoin({
      companies: this.companyService.getAllCompanies().pipe(
        tap((companies) => {
          console.log('Empresas carregadas:', companies);
        }),
        catchError((error) => {
          console.error('Erro ao carregar empresas:', error);
          return of([]); // Retorna um observable vazio em caso de erro para evitar que o forkJoin falhe completamente
        })
      ),
      products: this.productService.getAllProducts().pipe(
        tap((products) => {
          console.log('Produtos carregados:', products);
        }),
        catchError((error) => {
          console.error('Erro ao carregar produtos:', error);
          return of([]); // Retorna um observable vazio em caso de erro para evitar que o forkJoin falhe completamente
        })
      )
    }).subscribe({
      next: ({ companies, products }) => {
        this.companies = companies;
        this.products = products;
      },
      error: (error) => {
        console.error('Erro no forkJoin:', error);
      }
    });
  }

  updateProduct(product: any) {

    this.productService.updateProduct(product._id, product).pipe(
      tap(() => this.closeModal()),
      catchError((error) => {
        console.error('Erro ao atualizar produto:', error);
        return EMPTY;
      })
    ).subscribe(() => {
      this.loadProducts();
    });
  }

  deleteProduct() {
    this.productService.deleteProduct(this.productToDelete._id).pipe(
      tap(() => this.cancelDelete()),
      catchError((error) => {
        console.error('Erro ao excluir produto:', error);
        return EMPTY;
      })
    ).subscribe(() => {
      this.loadProducts();
    });
  }
}

type IAction = 'CREATE' | 'UPDATE' | 'DELETE';