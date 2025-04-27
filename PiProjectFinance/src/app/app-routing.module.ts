import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ClassificationFormComponent } from './classification-form/classification-form.component';
import { LoginComponent } from './login/login.component';
import { HumanDetectionComponent } from './human-detection/human-detection.component'; // Import your new component
import { HomeComponent } from './home/home.component'; // Import the HomeComponent
const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' }, // Route par défaut
  {path: 'home', component: HomeComponent}, // Route pour la page d'accueil
  { path: 'login', component: LoginComponent }, // Page de login
  { path: 'dashboard', component: DashboardComponent },
  { path: 'classification-form', component: ClassificationFormComponent },
  { path: 'human-detection', component: HumanDetectionComponent }, // Add route for the new component

  { path: 'general-pages', loadChildren: () => import('./general-pages/general-pages.module').then(m => m.GeneralPagesModule) },
  { path: 'apps', loadChildren: () => import('./apps/apps.module').then(m => m.AppsModule) },
  { path: 'error-pages', loadChildren: () => import('./error-pages/error-pages.module').then(m => m.ErrorPagesModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
