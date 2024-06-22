import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { HomeComponent } from './dashboard/home/home.component';
import { RegisterComponent } from './auth/register/register.component';
import { JwtGuard } from './_guard/jwt.guard';
import { CompanyComponent } from './dashboard/company/company.component';
import { LayoutComponent } from './dashboard/layout/layout.component';

export const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent,
        title: 'Login',
        canActivate: [JwtGuard],
        data: { isPrivate: false }
    },
    {
        path: 'register',
        component: RegisterComponent,
        title: 'Register',
        canActivate: [JwtGuard],
        data: { isPrivate: false }
    },
    {
        path: '',
        component: LayoutComponent,
        canActivate: [JwtGuard],
        children: [
            { path: '', component: HomeComponent },
            { path: 'empresa', component: CompanyComponent },
            // { path: 'produto', component: ProdutoComponent },
            // { path: 'cliente', component: ClienteComponent }
        ],
        data: { isPrivate: true }
    },
    {
        path: '**',
        redirectTo: 'login'
    }
];
