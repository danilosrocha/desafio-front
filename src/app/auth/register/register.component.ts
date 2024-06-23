import { Component } from '@angular/core';
import { ContainerComponent } from '../../shared/components/container/container.component';
import { CardComponent } from '../../shared/components/card/card.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TitleComponent } from '../../shared/components/title/title.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../shared/services/auth/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ContainerComponent, CardComponent, FormsModule, CommonModule, RouterModule, TitleComponent, ButtonComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  name: string;
  email: string;
  password: string;

  private apiUrl = 'https://desafio.up.railway.app/api';

  constructor(private http: HttpClient, private authService: AuthService, private router: Router) {
    this.name = '';
    this.email = '';
    this.password = '';
  }

  register() {
    this.http.post<any>(`${this.apiUrl}/users`, { name: this.name, email: this.email, password: this.password }).subscribe(
      (response) => {
        this.router.navigate(['login']);
      },
      (error) => {
        console.error('Login error:', error);
      }
    );
  }
}
