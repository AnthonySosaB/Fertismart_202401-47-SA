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
import { RecomendacionListComponent } from './recomendacion-list/recomendacion-list.component';
import { RecomendacionListService } from './recomendacion-list/recomendacion-list.service';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { NewRecomendacionSidebarComponent } from './recomendacion-list/new-recomendacion-sidebar/new-recomendacion-sidebar.component';
import { NgxMaskModule } from 'ngx-mask';
import { RejectedRecomendacionSidebarComponent } from './recomendacion-list/rejected-recomendacion-sideba/rejected-recomendacion-sidebar.component';
import { CompletedRecomendacionSidebarComponent } from './recomendacion-list/completed-recomendacion-sideba/completed-recomendacion-sidebar.component';

// routing
const routes: Routes = [
  {
    path: 'recomendacion-list',
    component: RecomendacionListComponent,
    resolve: {
      cls: RecomendacionListService
    },
    data: { animation: 'RecomendacionListComponent' }
  }
];

@NgModule({
  declarations: [
    RecomendacionListComponent,
    NewRecomendacionSidebarComponent,
    RejectedRecomendacionSidebarComponent,
    CompletedRecomendacionSidebarComponent
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
    ContentHeaderModule,
    NgxMaskModule.forRoot()
  ],
  providers: [
    RecomendacionListService,
    UserEditService
  ]
})
export class RecomendacionModule {}
