import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Endpoints } from 'app/shared/enums/endpoints.enum';
import { IVariedad } from 'app/shared/interfaces/variedad.interface';
import { LoadMessageService } from 'app/shared/services/load-message.service';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class CultivoListService implements Resolve<any> {
  public onCultivoListChanged: BehaviorSubject<any>;
  public onVariedadChanged: BehaviorSubject<any>;

  constructor(
    private _httpClient: HttpClient,
    private _loadMsgService: LoadMessageService
  ) {
    this.onCultivoListChanged = new BehaviorSubject({});
    this.onVariedadChanged = new BehaviorSubject([]);
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return new Promise<void>((resolve, reject) => {
      Promise.all([this.getDataCultivoList(), this.getVariedadList()]).then(() => {
        resolve();
      }, reject);
    });
  }

  getDataCultivoList(): Promise<any[]> {
    this._loadMsgService.showLoadingMsg();

    return new Promise((resolve, reject) => {
      this._httpClient.get(`${Endpoints.FERTISMART_CULTIVO}`)
      .pipe(
        catchError(e => {
          this._loadMsgService.hideLoadingMsg();
          return throwError(e)
        })
      )
      .subscribe((response: any) => {
        this.onCultivoListChanged.next(response);
        this._loadMsgService.hideLoadingMsg();
        resolve(response);
      }, reject);
    });
  }

  addNewCultivo(body: any) {
    this._loadMsgService.showLoadingMsg('Agregando cultivo...');
    return this._httpClient.post<any>(`${Endpoints.FERTISMART_CULTIVO}`, body)
      .pipe(
        catchError(e => {
          this._loadMsgService.showToastMsgError(
            'Lo sentimos ha ocurrido un error al agregar nuevo cultivo',
            'No se pudo agregar cultivo',
          );
          this._loadMsgService.hideLoadingMsg();
          
          return throwError(e)
        })
      );
  }

  editCultivo(body: any, id:number) {
    this._loadMsgService.showLoadingMsg('Editando cultivo...');
    return this._httpClient.patch<any>(`${Endpoints.FERTISMART_CULTIVO}${id}/`, body)
      .pipe(
        catchError(e => {
          this._loadMsgService.showToastMsgError(
            'Lo sentimos ha ocurrido un error al editar cultivo',
            'No se pudo editar cultivo',
          );
          this._loadMsgService.hideLoadingMsg();
          
          return throwError(e)
        })
      );
  }

  deleteCultivo(id: number) {
    this._loadMsgService.showLoadingMsg('Eliminando cultivo...');
    return this._httpClient.delete<any>(`${Endpoints.FERTISMART_CULTIVO}${id}/`)
      .pipe(
        catchError(e => {
          this._loadMsgService.showToastMsgError(
            e,
            'No se pudo eliminar cultivo',
          );
          this._loadMsgService.hideLoadingMsg();
          
          return throwError(e)
        })
      );
  }

  getVariedadList(): Promise<IVariedad[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(Endpoints.FERTISMART_VARIEDAD).subscribe((response: any) => {
        this.onVariedadChanged.next(response);
        resolve(response);
      }, reject);
    });
  }
}
