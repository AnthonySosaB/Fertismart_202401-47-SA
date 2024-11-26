import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Endpoints } from 'app/shared/enums/endpoints.enum';
import { LoadMessageService } from 'app/shared/services/load-message.service';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class UserEditService implements Resolve<any> {
  public userDetailData: any;
  public onUserEditChanged: BehaviorSubject<any>;

  constructor(
    private _httpClient: HttpClient,
    private _loadMsgService: LoadMessageService
  ) {
    this.onUserEditChanged = new BehaviorSubject({});
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    let currentId = Number(route.paramMap.get('id'));

    return new Promise<void>((resolve, reject) => {
      Promise.all([this.getDetailUser(currentId)]).then(() => {
        resolve();
      }, reject);
    });
  }

  getDetailUser(id: number): Promise<any[]> {
    this._loadMsgService.showLoadingMsg();
    const url = `${Endpoints.SEGCEN_USERS}${id}/`;

    return new Promise((resolve, reject) => {
      this._httpClient.get(url)
      .pipe(
        catchError(e => {
          this._loadMsgService.hideLoadingMsg();
          return throwError(e)
        })
      )
      .subscribe((response: any) => {
        this.userDetailData = response;
        this.onUserEditChanged.next(this.userDetailData);
        this._loadMsgService.hideLoadingMsg();
        resolve(this.userDetailData);
      }, reject);
    });
  }

  editUser(body: any, id: number) {
    this._loadMsgService.showLoadingMsg('Editando usuario...');
    return this._httpClient.put<any>(`${Endpoints.SEGCEN_USERS}${id}/`, body)
      .pipe(
        catchError(e => {
          this._loadMsgService.showToastMsgError(
            'Lo sentimos ha ocurrido un error al editar usuario',
            'No se pudo editar usuario'
          );
          this._loadMsgService.hideLoadingMsg();
          
          return throwError(e)
        })
      );
  }
}
