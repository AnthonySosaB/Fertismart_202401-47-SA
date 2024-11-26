import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CoreCommonModule } from '@core/common.module';
import { AuthLoginComponent } from './auth-login/auth-login.component';
import { AuthGuard } from 'app/shared/guards/auth.guard';
import { AuthRegisterComponent } from './auth-register/auth-register.component';
import { AuthRegisterConfirmComponent } from './auth-register-confirm/auth-register-confirm.component';

const routes: Routes = [
  {
    path: 'authentication/login',
    component: AuthLoginComponent,
    canActivate: [AuthGuard],
    data: { animation: 'auth' }
  },
  {
    path: 'authentication/register',
    component: AuthRegisterComponent
  },
  {
    path: 'authentication/confirm',
    component: AuthRegisterConfirmComponent
  }
];

@NgModule({
  declarations: [
    AuthLoginComponent, 
    AuthRegisterComponent,
    AuthRegisterConfirmComponent
  ],
  imports: [
    CommonModule, 
    RouterModule.forChild(routes), 
    NgbModule, 
    FormsModule, 
    ReactiveFormsModule, 
    CoreCommonModule
  ]
})
export class AuthenticationModule {}
