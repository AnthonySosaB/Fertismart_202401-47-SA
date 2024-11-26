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
import { GastoListComponent } from './gasto-list/gasto-list.component';
import { GastoListService } from './gasto-list/gasto-list.service';
import { NewGastoSidebarComponent } from './gasto-list/new-gasto-sidebar/new-gasto-sidebar.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { EditGastoSidebarComponent } from './gasto-list/edit-gasto-sidebar/edit-gasto-sidebar.component';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { NgApexchartsModule } from 'ng-apexcharts';

// routing
const routes: Routes = [
  {
    path: 'costo-list',
    component: GastoListComponent,
    resolve: {
      cls: GastoListService
    },
    data: { animation: 'GastoListComponent' }
  }
];

@NgModule({
  declarations: [
    GastoListComponent, 
    NewGastoSidebarComponent, 
    EditGastoSidebarComponent
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
    NgApexchartsModule,
  ],
  providers: [
    GastoListService,
    UserEditService
  ]
})
export class GastoModule {}
