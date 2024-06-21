import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { HomeComponent } from './dashboard/home/home.component';
import { RegisterComponent } from './auth/register/register.component';

export const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent,
        title: 'Login'
    },
    {
        path: 'register',
        component: RegisterComponent,
        title: 'Register'
    },
    {
        path: '',
        component: HomeComponent,
        title: 'Home'
    }
];
