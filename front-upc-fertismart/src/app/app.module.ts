import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import 'hammerjs';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrModule } from 'ngx-toastr'; // For auth after login toast

import { CoreModule } from '@core/core.module';
import { CoreCommonModule } from '@core/common.module';
import { CoreSidebarModule, CoreThemeCustomizerModule } from '@core/components';

import { coreConfig } from 'app/app-config';

import { AppComponent } from 'app/app.component';
import { LayoutModule } from 'app/layout/layout.module';
import { SampleModule } from 'app/main/sample/sample.module';
import { AuthGuard } from './auth/helpers/auth.guards';
import { FakeDbService } from '@fake-db/fake-db.service';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { CookieService } from 'ngx-cookie-service';
import { JwtInterceptor } from './auth/helpers/jwt.interceptor';
import { BlockUIModule } from 'ng-block-ui';
import { ErrorInterceptor } from './auth/helpers/error.interceptor';
import { fakeBackendProvider } from './auth/helpers/fake-backend';
import { SharedService } from './shared/services/shared-data.service';
import { LoadMessageService } from './shared/services/load-message.service';
import { PermissionObjectService } from './shared/services/permissions-object.service';
import { FindRemoteDataService } from './shared/services/find-remote-data.service';
import { SharedModalModule } from './shared/components/shared-modal/shared-modal.module';

const appRoutes: Routes = [
  {
    path: 'apps',
    loadChildren: () => import('./main/apps/apps.module').then(m => m.AppsModule),
    canActivate: [AuthGuard],
    resolve: {
      pos: PermissionObjectService
    },
  },
  {
    path: 'pages',
    loadChildren: () => import('./main/pages/pages.module').then(m => m.PagesModule)
  },
  {
    path: '',
    redirectTo: '/pages/authentication/login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/pages/miscellaneous/error' //Error 404 - Page not found
  }
];

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    HttpClientInMemoryWebApiModule.forRoot(FakeDbService, {
      delay: 0,
      passThruUnknownUrl: true
    }),
    RouterModule.forRoot(appRoutes, {
      scrollPositionRestoration: 'enabled', // Add options right here
      relativeLinkResolution: 'legacy'
    }),
    TranslateModule.forRoot(),
    BlockUIModule.forRoot(),

    //NgBootstrap
    NgbModule,
    ToastrModule.forRoot(),

    // Core modules
    CoreModule.forRoot(coreConfig),
    CoreCommonModule,
    CoreSidebarModule,
    CoreThemeCustomizerModule,

    // App modules
    LayoutModule,
    SampleModule,
    SharedModalModule
  ],
  providers: [
    CookieService,
    SharedService,
    LoadMessageService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    fakeBackendProvider,
    PermissionObjectService,
    FindRemoteDataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
