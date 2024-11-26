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
import { CultivoListComponent } from './cultivo-list/cultivo-list.component';
import { CultivoListService } from './cultivo-list/cultivo-list.service';
import { NewCultivoSidebarComponent } from './cultivo-list/new-cultivo-sidebar/new-cultivo-sidebar.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { EditCultivoSidebarComponent } from './cultivo-list/edit-cultivo-sidebar/edit-cultivo-sidebar.component';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';

// routing
const routes: Routes = [
  {
    path: 'cultivo-list',
    component: CultivoListComponent,
    resolve: {
      cls: CultivoListService
    },
    data: { animation: 'CultivoListComponent' }
  }
];

@NgModule({
  declarations: [
    CultivoListComponent, 
    NewCultivoSidebarComponent, 
    EditCultivoSidebarComponent
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
    CultivoListService,
    UserEditService
  ]
})
export class CultivoModule {}
