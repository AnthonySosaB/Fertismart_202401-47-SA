import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from 'app/auth/service';
import { BehaviorSubject, Observable, timer } from 'rxjs';
import { delayWhen, map, retryWhen } from 'rxjs/operators';
import { concat, includes, some } from 'lodash'
import { UPermissions } from '../enums/user-permissions.enum';

@Injectable()
export class PermissionObjectService implements Resolve<any> {
  public onUserPermissionChanged: BehaviorSubject<any>;
  public userPermissions: Array<string>;

  constructor(private _authenticationService: AuthenticationService) {
    this.onUserPermissionChanged = new BehaviorSubject({});
    this.userPermissions = [];
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return new Promise<void>((resolve, reject) => {
      Promise.all([this.analizeUserPermissions()]).then(() => {
        resolve();
      }, reject);
    });
  }

  analizeUserPermissions(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._authenticationService.currentUser
      .pipe(
        map(value => {
          if(value){ return value; };
          throw value;
        }),
        retryWhen(err =>
          err.pipe(
            delayWhen(() => timer(100))
          )
        )
      )
      .subscribe(data => {
        this.userPermissions = concat(data.permissions.permission_object);
        this.onUserPermissionChanged.next(this.userPermissions);
        resolve(this.userPermissions);        
      }, reject)
    });
  }

  getMainPermission(permission) {
    return some([permission], (val) => includes(this.onUserPermissionChanged.getValue(), val));
  }
}
