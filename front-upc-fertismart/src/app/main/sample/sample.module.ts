import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { SampleComponent } from './sample.component';
import { HomeComponent } from './home.component';
import { AuthGuard } from 'app/auth/helpers/auth.guards';
import { NgApexchartsModule } from 'ng-apexcharts';
import { HomeService } from './home.service';

const routes = [
  {
    path: 'sample',
    component: SampleComponent,
    data: { animation: 'sample' }
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard],
    data: { animation: 'home' },
    resolve: {
      cls: HomeService
    }
  }
];

@NgModule({
  declarations: [
    SampleComponent, 
    HomeComponent
  ],
  imports: [
    RouterModule.forChild(routes), 
    ContentHeaderModule, 
    TranslateModule, 
    CoreCommonModule,
    NgApexchartsModule
  ],
  exports: [
    SampleComponent, 
    HomeComponent
  ],
  providers: [
    HomeService
  ]
})
export class SampleModule {}
