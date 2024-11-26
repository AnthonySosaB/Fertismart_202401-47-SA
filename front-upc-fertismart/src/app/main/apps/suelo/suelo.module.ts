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
import { SueloListComponent } from './suelo-list/suelo-list.component';
import { SueloListService } from './suelo-list/suelo-list.service';
import { NewSueloSidebarComponent } from './suelo-list/new-suelo-sidebar/new-suelo-sidebar.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { EditSueloSidebarComponent } from './suelo-list/edit-suelo-sidebar/edit-suelo-sidebar.component';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';

// routing
const routes: Routes = [
  {
    path: 'suelo-list',
    component: SueloListComponent,
    resolve: {
      cls: SueloListService
    },
    data: { animation: 'SueloListComponent' }
  }
];

@NgModule({
  declarations: [
    SueloListComponent, 
    NewSueloSidebarComponent, 
    EditSueloSidebarComponent
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
    SueloListService,
    UserEditService
  ]
})
export class SueloModule {}
