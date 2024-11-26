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
import { FertilizanteListComponent } from './fertilizante-list/fertilizante-list.component';
import { FertilizanteListService } from './fertilizante-list/fertilizante-list.service';
import { NewFertilizanteSidebarComponent } from './fertilizante-list/new-fertilizante-sidebar/new-fertilizante-sidebar.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { EditFertilizanteSidebarComponent } from './fertilizante-list/edit-fertilizante-sidebar/edit-fertilizante-sidebar.component';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';

// routing
const routes: Routes = [
  {
    path: 'fertilizante-list',
    component: FertilizanteListComponent,
    resolve: {
      cls: FertilizanteListService
    },
    data: { animation: 'FertilizanteListComponent' }
  }
];

@NgModule({
  declarations: [
    FertilizanteListComponent, 
    NewFertilizanteSidebarComponent, 
    EditFertilizanteSidebarComponent
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
    FertilizanteListService,
    UserEditService
  ]
})
export class FertilizanteModule {}
