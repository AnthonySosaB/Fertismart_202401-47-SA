import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { Ng2FlatpickrModule } from 'ng2-flatpickr';
import { CoreCommonModule } from '@core/common.module';
import { CoreDirectivesModule } from '@core/directives/directives';
import { CorePipesModule } from '@core/pipes/pipes.module';
import { CoreSidebarModule } from '@core/components';
import { UserEditService } from 'app/main/apps/user/user-edit/user-edit.service';
import { CampoListComponent } from './campo-list/campo-list.component';
import { CampoListService } from './campo-list/campo-list.service';
import { NewCampoSidebarComponent } from './campo-list/new-campo-sidebar/new-campo-sidebar.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { EditCampoSidebarComponent } from './campo-list/edit-campo-sidebar/edit-campo-sidebar.component';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';

// routing
const routes: Routes = [
  {
    path: 'campo-list',
    component: CampoListComponent,
    resolve: {
      cls: CampoListService
    },
    data: { animation: 'CampoListComponent' }
  }
];

@NgModule({
  declarations: [
    CampoListComponent, 
    NewCampoSidebarComponent, 
    EditCampoSidebarComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CoreCommonModule,
    FormsModule,
    NgbModule,
    NgSelectModule,
    Ng2FlatpickrModule,
    NgxDatatableModule,
    CorePipesModule,
    CoreDirectivesModule,
    CoreSidebarModule,
    SweetAlert2Module.forRoot(),
    ContentHeaderModule
  ],
  providers: [
    CampoListService,
    UserEditService
  ]
})
export class CampoModule {}
