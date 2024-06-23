import { ClientService } from '../../shared/services/client.service';
import { Component } from '@angular/core';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { catchError, EMPTY, forkJoin, of, tap } from 'rxjs';
import { CompanyService } from '../../shared/services/company.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-client',
  standalone: true,
  imports: [ButtonComponent, ModalComponent, CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './client.component.html',
  styleUrl: './client.component.css'
})


export class ClientComponent {
  isModalVisible: boolean = false;
  isDeleteModalVisible: boolean = false;
  action: IAction = 'CREATE';
  clientForm: FormGroup;
  clients: any[] = [];
  companies: any[] = [];
  clientToDelete: any | null = null; // Empresa a ser excluída

  constructor(private fb: FormBuilder, private clientService: ClientService, private CompanyService: CompanyService, private _snackBar: MatSnackBar) {
    this.clientForm = this.fb.group({
      _id: [],
      name: ['', Validators.required],
      email: ['', Validators.required],
      telephone: ['', Validators.required],
      company: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadClients();
  }

  openModal(action: IAction, client?: any) {
    this.action = action;
    if (action === "UPDATE") {
      this.clientForm.patchValue(client);
    }
    this.isModalVisible = true;
  }

  closeModal() {
    this.isModalVisible = false;
    this.clientForm.reset();
  }

  confirmDelete(client: any) {
    this.clientToDelete = client;
    this.isDeleteModalVisible = true;
  }

  cancelDelete() {
    this.isDeleteModalVisible = false;
    this.clientToDelete = null;
  }

  getCorporateNameForClient(companyId: any): string {
    const company = this.companies.find(e => e._id == companyId);

    return company.corporateName;
  }

  get modalText(): string {
    return this.action === 'CREATE' ? 'Cadastrar cliente' : 'Atualizar cliente';
  }

  get deleteModalText(): string {
    return `Excluir cliente "${this.clientToDelete?.name}"`;
  }

  onSubmit() {
    if (this.clientForm.valid) {
      const formData = this.clientForm.value;
      formData.user = localStorage.getItem('userId');

      if (this.action === 'CREATE') {
        this.clientService.createClient(formData).pipe(
          tap(() => {

            this.closeModal(),
              this.loadClients()
          }),
          catchError((error) => {
            console.error('Erro ao atualizar produto:', error);
            return EMPTY;
          })
        ).subscribe(() => {
          this.loadClients();
        });
      } else if (this.action === 'UPDATE') {
        this.updateClient(this.clientForm.value)
      }
    }
  }


  loadClients() {
    forkJoin({
      clients: this.clientService.getAllClients().pipe(
        tap((clients) => {
          console.log('Empresas carregadas:', clients);
        }),
        catchError((error) => {
          console.error('Erro ao carregar empresas:', error);
          return of([]);
        })
      ),
      companies: this.CompanyService.getAllCompanies().pipe(
        tap((clients) => {
          console.log('Produtos carregados:', clients);
        }),
        catchError((error) => {
          console.error('Erro ao carregar produtos:', error);
          return of([]);
        })
      )
    }).subscribe({
      next: ({ clients, companies }) => {
        this.clients = clients;
        this.companies = companies;
      },
      error: (error) => {
        console.error('Erro no forkJoin:', error);
      }
    });
  }

  updateClient(client: any) {
    this.clientService.updateClient(client._id, client).pipe(
      tap(() => this.closeModal()),
      catchError((error) => {
        console.error('Erro ao atualizar produto:', error);
        return EMPTY;
      })
    ).subscribe(() => {
      this.loadClients();
    });
  }

  deleteClient() {
    this.clientService.deleteClient(this.clientToDelete._id).pipe(
      tap(() => this.cancelDelete()),
      catchError((error) => {
        console.error('Erro ao excluir produto:', error);
        return EMPTY;
      })
    ).subscribe(() => {
      this.loadClients();
    });
  }
}

type IAction = 'CREATE' | 'UPDATE' | 'DELETE';