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
import { AplicacionListComponent } from './aplicacion-list/aplicacion-list.component';
import { AplicacionListService } from './aplicacion-list/aplicacion-list.service';
import { NewAplicacionSidebarComponent } from './aplicacion-list/new-aplicacion-sidebar/new-aplicacion-sidebar.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { EditAplicacionSidebarComponent } from './aplicacion-list/edit-aplicacion-sidebar/edit-aplicacion-sidebar.component';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';

// routing
const routes: Routes = [
  {
    path: 'aplicacion-list',
    component: AplicacionListComponent,
    resolve: {
      cls: AplicacionListService
    },
    data: { animation: 'AplicacionListComponent' }
  }
];

@NgModule({
  declarations: [
    AplicacionListComponent, 
    NewAplicacionSidebarComponent, 
    EditAplicacionSidebarComponent
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
    AplicacionListService,
    UserEditService
  ]
})
export class AplicacionModule {}
