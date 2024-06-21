import { Component } from '@angular/core';
import { ContainerComponent } from '../../shared/components/container/container.component';
import { CardComponent } from '../../shared/components/card/card.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TitleComponent } from '../../shared/components/title/title.component';
import { ButtonComponent } from '../../shared/components/button/button.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ContainerComponent, CardComponent, FormsModule, CommonModule, RouterModule, TitleComponent, ButtonComponent,],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username: string;
  password: string;

  constructor(private router: Router) {
    this.username = '';
    this.password = '';
  }

  login() {
    console.log(`Username: ${this.username}, Password: ${this.password}`);

    this.router.navigate(["/"])
  }
}
