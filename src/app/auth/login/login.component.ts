import { Component } from '@angular/core';
import { ContainerComponent } from '../../shared/components/container/container.component';
import { CardComponent } from '../../shared/components/card/card.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TitleComponent } from '../../shared/components/title/title.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { AuthService } from '../../shared/services/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ContainerComponent, CardComponent, FormsModule, CommonModule, RouterModule, TitleComponent, ButtonComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string;
  password: string;

  constructor(private authService: AuthService, private router: Router) {
    this.email = '';
    this.password = '';
  }

  login() {
    this.authService.login(this.email, this.password).subscribe(
      (response) => {
        this.router.navigate(['/']);
      },
      (error) => {
        console.error('Login error:', error);
      }
    );
  }
}
