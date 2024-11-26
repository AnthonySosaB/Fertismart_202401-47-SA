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
import { ParameterListComponent } from './parameter-list/parameter-list.component';
import { ParameterListService } from './parameter-list/parameter-list.service';
import { NewParameterSidebarComponent } from './parameter-list/new-parameter-sidebar/new-parameter-sidebar.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { EditParameterSidebarComponent } from './parameter-list/edit-parameter-sidebar/edit-parameter-sidebar.component';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';

// routing
const routes: Routes = [
  {
    path: 'parameter-list',
    component: ParameterListComponent,
    resolve: {
      pls: ParameterListService
    },
    data: { animation: 'ParameterListComponent' }
  }
];

@NgModule({
  declarations: [ParameterListComponent, NewParameterSidebarComponent, EditParameterSidebarComponent],
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
    ParameterListService,
    UserEditService
  ]
})
export class ParameterModule {}
