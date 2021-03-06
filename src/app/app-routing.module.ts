import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { WelcomeComponent } from './welcome/welcome.component';
import { LeaderAuditioneeComponent } from './leader-auditionee/leader-auditionee.component';
import { LoginGuard } from './shared/login-guard.module';
import { SignInErrorComponent } from './error/sign-in-error.component';

const appRoutes: Routes = [
  { path: '', redirectTo: 'welcome', pathMatch: 'full'},
  { path: 'error', component: SignInErrorComponent},
  { path: 'welcome', component: WelcomeComponent },
  { path: 'dashboard', component: LeaderAuditioneeComponent, canActivate: [LoginGuard] }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}
