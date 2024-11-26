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
import { VariedadListComponent } from './variedad-list/variedad-list.component';
import { VariedadListService } from './variedad-list/variedad-list.service';
import { NewVariedadSidebarComponent } from './variedad-list/new-variedad-sidebar/new-variedad-sidebar.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { EditVariedadSidebarComponent } from './variedad-list/edit-variedad-sidebar/edit-variedad-sidebar.component';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';

// routing
const routes: Routes = [
  {
    path: 'variedad-list',
    component: VariedadListComponent,
    resolve: {
      cls: VariedadListService
    },
    data: { animation: 'VariedadListComponent' }
  }
];

@NgModule({
  declarations: [
    VariedadListComponent, 
    NewVariedadSidebarComponent, 
    EditVariedadSidebarComponent
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
    VariedadListService,
    UserEditService
  ]
})
export class VariedadModule {}
