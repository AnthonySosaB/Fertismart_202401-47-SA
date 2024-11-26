import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Endpoints } from 'app/shared/enums/endpoints.enum';
import { LoadMessageService } from 'app/shared/services/load-message.service';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class UserViewService implements Resolve<any> {
  public userDetailData: any;
  public onUserViewChanged: BehaviorSubject<any>;
  public id;

  constructor(
    private _httpClient: HttpClient,
    private _loadMsgService: LoadMessageService
  ) {
    this.onUserViewChanged = new BehaviorSubject({});
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
        this.onUserViewChanged.next(this.userDetailData);
        this._loadMsgService.hideLoadingMsg(); 
        resolve(this.userDetailData);
      }, reject);
    });
  }
}
