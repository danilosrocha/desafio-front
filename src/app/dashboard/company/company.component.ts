import { CompanyService } from './../../shared/services/company.service';
import { Component } from '@angular/core';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { catchError, EMPTY, tap } from 'rxjs';
@Component({
  selector: 'app-company',
  standalone: true,
  imports: [ButtonComponent, ModalComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './company.component.html',
  styleUrl: './company.component.css'
})


export class CompanyComponent {
  isModalVisible: boolean = false;
  isDeleteModalVisible: boolean = false;
  action: IAction = 'CREATE';
  companyForm: FormGroup;
  companies: any[] = [];
  companyToDelete: any | null = null; // Empresa a ser excluída

  constructor(private fb: FormBuilder, private companyService: CompanyService) {
    this.companyForm = this.fb.group({
      _id: [],
      corporateName: ['', Validators.required],
      companyName: ['', Validators.required],
      cnpj: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadCompanies();
  }

  openModal(action: IAction, company?: any) {
    this.action = action;
    if (action === "UPDATE") {
      this.companyForm.patchValue(company);
    }
    this.isModalVisible = true;
  }

  closeModal() {
    this.isModalVisible = false;
    this.companyForm.reset();
  }

  confirmDelete(company: any) {
    this.companyToDelete = company;
    this.isDeleteModalVisible = true;
  }

  cancelDelete() {
    this.isDeleteModalVisible = false;
    this.companyToDelete = null;
  }

  get modalText(): string {
    return this.action === 'CREATE' ? 'Cadastrar empresa' : 'Atualizar empresa';
  }

  get deleteModalText(): string {
    return `Excluir empresa "${this.companyToDelete?.corporateName}"`;
  }

  onSubmit() {
    if (this.companyForm.valid) {
      const formData = this.companyForm.value;
      formData.user = localStorage.getItem('userId');

      if (this.action === 'CREATE') {
        this.companyService.createCompany(formData).subscribe(
          (response) => {
            console.log('Empresa criada com sucesso:', response);
            this.closeModal();
            this.loadCompanies(); // Atualiza a lista de empresas após criar uma nova
          },
          (error) => {
            console.error('Erro ao criar empresa:', error);
          }
        );
      } else if (this.action === 'UPDATE') {
        this.updateCompany(this.companyForm.value)
      }
    }
  }


  loadCompanies() {
    this.companyService.getAllCompanies()
      .pipe(
        tap((companies) => {
          console.log('Empresas carregadas:', companies);
        }),

        catchError((error) => {
          console.error('Erro ao carregar empresas:', error);
          return EMPTY;
        })
      )
      .subscribe(companies => {
        this.companies = companies;
      });
  }

  updateCompany(company: any) {
    this.companyService.updateCompany(company._id, company).pipe(
      tap(() => this.closeModal()),
      catchError((error) => {
        console.error('Erro ao atualizar empresa:', error);
        return EMPTY;
      })
    ).subscribe(() => {
      this.loadCompanies();
    });
  }

  deleteCompany() {
    this.companyService.deleteCompany(this.companyToDelete._id).pipe(
      tap(() => this.cancelDelete()),
      catchError((error) => {
        console.error('Erro ao excluir empresa:', error);
        return EMPTY;
      })
    ).subscribe(() => {
      this.loadCompanies();
    });
  }
}

type IAction = 'CREATE' | 'UPDATE' | 'DELETE';