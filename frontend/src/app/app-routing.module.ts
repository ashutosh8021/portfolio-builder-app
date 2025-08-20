import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PortfolioFormComponent } from './components/portfolio-form/portfolio-form.component';
import { PreviewComponent } from './components/preview/preview.component';

const routes: Routes = [
  { path: '', component: PortfolioFormComponent },
  { path: 'preview', component: PreviewComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
