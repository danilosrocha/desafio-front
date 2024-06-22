import { ProductService } from '../../shared/services/product.service';
import { Component } from '@angular/core';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { catchError, EMPTY, tap } from 'rxjs';
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
  companies: any[] = [];
  productToDelete: any | null = null; // Empresa a ser excluída

  constructor(private fb: FormBuilder, private productService: ProductService) {
    this.productForm = this.fb.group({
      _id: ['', Validators.required],
      corporateName: ['', Validators.required],
      productName: ['', Validators.required],
      cnpj: ['', Validators.required],
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

  get modalText(): string {
    return this.action === 'CREATE' ? 'Cadastrar produto' : 'Atualizar produto';
  }

  get deleteModalText(): string {
    return `Excluir produto "${this.productToDelete?.corporateName}"`;
  }

  onSubmit() {
    if (this.productForm.valid) {
      const formData = this.productForm.value;
      formData.user = localStorage.getItem('userId');

      if (this.action === 'CREATE') {
        this.productService.createProduct(formData).subscribe(
          (response) => {
            console.log('Empresa criada com sucesso:', response);
            this.closeModal();
            this.loadProducts(); // Atualiza a lista de produtos após criar uma nova
          },
          (error) => {
            console.error('Erro ao criar produto:', error);
          }
        );
      } else if (this.action === 'UPDATE') {
        this.updateProduct(this.productForm.value)
      }
    }
  }


  loadProducts() {
    this.productService.getAllProducts()
      .pipe(
        tap((companies) => {
          console.log('Empresas carregadas:', companies);
        }),

        catchError((error) => {
          console.error('Erro ao carregar produtos:', error);
          return EMPTY;
        })
      )
      .subscribe(companies => {
        this.companies = companies;
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