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
import { ParameterDetailListComponent } from './parameter-detail-list/parameter-detail-list.component';
import { ParameterDetailListService } from './parameter-detail-list/parameter-detail-list.service';
import { NewParameterDetailSidebarComponent } from './parameter-detail-list/new-parameter-detail-sidebar/new-parameter-detail-sidebar.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { EditParameterDetailSidebarComponent } from './parameter-detail-list/edit-parameter-detail-sidebar/edit-parameter-detail-sidebar.component';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';

// routing
const routes: Routes = [
  {
    path: 'parameter-detail-list/:name/:id',
    component: ParameterDetailListComponent,
    resolve: {
      pls: ParameterDetailListService
    },
    data: { animation: 'ParameterDetailListComponent' }
  }
];

@NgModule({
  declarations: [
    ParameterDetailListComponent, 
    NewParameterDetailSidebarComponent, 
    EditParameterDetailSidebarComponent
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
    ParameterDetailListService,
    UserEditService
  ]
})
export class ParameterDetailModule {}
