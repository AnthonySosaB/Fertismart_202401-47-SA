import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as _ from "lodash";

import { environment } from 'environments/environment';
import { AuthenticationService } from 'app/auth/service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  /**
   *
   * @param {AuthenticationService} _authenticationService
   */
  constructor(private _authenticationService: AuthenticationService) {}

  /**
   * Add auth header with jwt if user is logged in and request is to api url
   * @param request
   * @param next
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const whiteListEndpoint = ['/api/token-auth/', '/api/register-user/'];
    const currentUser = this._authenticationService.currentUserValue;
    const isLoggedIn = currentUser && currentUser.token;
    // const isApiUrl = request.url.startsWith(environment.apiUrl);
    if (isLoggedIn) {
      request = request.clone({
        setHeaders: {
          Authorization: `Token ${currentUser.token}`
        },
        url: `${environment.apiUrl}${request.url}`
      });
    } 
    
    if (whiteListEndpoint.includes(request.url)) {
      request = request.clone({
        url: `${environment.apiUrl}${request.url}`
      });
    }

    return next.handle(request);
  }
}
