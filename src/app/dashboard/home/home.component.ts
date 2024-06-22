import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../shared/services/auth/auth.service';
import { ModalComponent } from '../../shared/components/modal/modal.component';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, ModalComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor(private authService: AuthService, private router: Router) {
  }

  isModalVisible: boolean = false;

  openModal() {
    this.isModalVisible = true;
  }

  closeModal() {
    this.isModalVisible = false;
  }

  logout() {
    this.authService.logout();
  }
}
