import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Endpoints } from 'app/shared/enums/endpoints.enum';
import { IUserGroup } from 'app/shared/interfaces/user-group.interface';
import { LoadMessageService } from 'app/shared/services/load-message.service';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class UserSharedService implements Resolve<any> {
  public onUserGroupsChanged: BehaviorSubject<any>;

  constructor(
    private _httpClient: HttpClient,
    private _loadMsgService: LoadMessageService
  ) {
    this.onUserGroupsChanged = new BehaviorSubject({});
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return new Promise<void>((resolve, reject) => {
      Promise.all([this.getUserGroupsList()]).then(() => {
        resolve();
      }, reject);
    });
  }

  getUserGroupsList(): Promise<IUserGroup[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(Endpoints.SEGCEN_GROUPS).subscribe((response: any) => {
        this.onUserGroupsChanged.next(response);
        resolve(response);
      }, reject);
    });
  }

  deactivateUser(body: any) {
    this._loadMsgService.showLoadingMsg();
    return this._httpClient.post<any>(`${Endpoints.SEGCEN_USER_DEACTIVATE}`, body)
      .pipe(
        catchError(e => {
          this._loadMsgService.showToastMsgError(
            'Lo sentimos ha ocurrido un error al desactivar el usuario',
            'No se pudo desactivar el usuario',
          );
          this._loadMsgService.hideLoadingMsg();
          
          return throwError(e)
        })
      );
  }

  activateUser(body: any) {
    this._loadMsgService.showLoadingMsg();
    return this._httpClient.post<any>(`${Endpoints.SEGCEN_USER_ACTIVATE}`, body)
      .pipe(
        catchError(e => {
          this._loadMsgService.showToastMsgError(
            'Lo sentimos ha ocurrido un error al activar el usuario',
            'No se pudo activar el usuario',
          );
          this._loadMsgService.hideLoadingMsg();
          
          return throwError(e)
        })
      );
  }

  resetPasswordUser(body: any) {
    this._loadMsgService.showLoadingMsg();
    return this._httpClient.post<any>(`${Endpoints.SEGCEN_USER_REST_PASS}`, body)
      .pipe(
        catchError(e => {
          this._loadMsgService.showToastMsgError(
            'Lo sentimos ha ocurrido un error al resetear password',
            'No se pudo resetaer el password',
          );
          this._loadMsgService.hideLoadingMsg();
          
          return throwError(e)
        })
      );
  }
}
