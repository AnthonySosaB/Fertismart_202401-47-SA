import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Endpoints } from 'app/shared/enums/endpoints.enum';
import { ICultivo } from 'app/shared/interfaces/cultivo.interface';
import { IVariedad } from 'app/shared/interfaces/variedad.interface';
import { LoadMessageService } from 'app/shared/services/load-message.service';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class CampoListService implements Resolve<any> {
  public onCampoListChanged: BehaviorSubject<any>;
  public onVariedadChanged: BehaviorSubject<any>;
  public onCultivoChanged: BehaviorSubject<any>;
  public onSueloChanged: BehaviorSubject<any>;

  constructor(
    private _httpClient: HttpClient,
    private _loadMsgService: LoadMessageService
  ) {
    this.onCampoListChanged = new BehaviorSubject({});
    this.onVariedadChanged = new BehaviorSubject([]);
    this.onCultivoChanged = new BehaviorSubject([]);
    this.onSueloChanged = new BehaviorSubject([]);
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return new Promise<void>((resolve, reject) => {
      Promise.all([
        this.getDataCampoList(), 
        this.getVariedadList(), 
        this.getCultivoList(),
        this.getSueloList()]).then(() => { resolve(); }, reject);
    });
  }

  getDataCampoList(): Promise<any[]> {
    this._loadMsgService.showLoadingMsg();

    return new Promise((resolve, reject) => {
      this._httpClient.get(`${Endpoints.FERTISMART_CAMPO}search`)
      .pipe(
        catchError(e => {
          this._loadMsgService.hideLoadingMsg();
          return throwError(e)
        })
      )
      .subscribe((response: any) => {
        this.onCampoListChanged.next(response);
        this._loadMsgService.hideLoadingMsg();
        resolve(response);
      }, reject);
    });
  }

  addNewCampo(body: any) {
    this._loadMsgService.showLoadingMsg('Agregando campo...');
    return this._httpClient.post<any>(`${Endpoints.FERTISMART_CAMPO}`, body)
      .pipe(
        catchError(e => {
          this._loadMsgService.showToastMsgError(
            'Lo sentimos ha ocurrido un error al agregar nuevo campo',
            'No se pudo agregar campo',
          );
          this._loadMsgService.hideLoadingMsg();
          
          return throwError(e)
        })
      );
  }

  editCampo(body: any, id:number) {
    this._loadMsgService.showLoadingMsg('Editando campo...');
    return this._httpClient.patch<any>(`${Endpoints.FERTISMART_CAMPO}${id}/`, body)
      .pipe(
        catchError(e => {
          this._loadMsgService.showToastMsgError(
            'Lo sentimos ha ocurrido un error al editar campo',
            'No se pudo editar campo',
          );
          this._loadMsgService.hideLoadingMsg();
          
          return throwError(e)
        })
      );
  }

  deleteCampo(id: number) {
    this._loadMsgService.showLoadingMsg('Eliminando campo...');
    return this._httpClient.delete<any>(`${Endpoints.FERTISMART_CAMPO}${id}/`)
      .pipe(
        catchError(e => {
          this._loadMsgService.showToastMsgError(
            e,
            'No se pudo eliminar campo',
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

  getCultivoList(): Promise<ICultivo[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(Endpoints.FERTISMART_CULTIVO).subscribe((response: any) => {
        this.onCultivoChanged.next(response);
        resolve(response);
      }, reject);
    });
  }

  getSueloList(): Promise<ICultivo[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(Endpoints.FERTISMART_SUELO).subscribe((response: any) => {
        this.onSueloChanged.next(response);
        resolve(response);
      }, reject);
    });
  }
}
