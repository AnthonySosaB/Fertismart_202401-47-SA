import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User, Role } from 'app/auth/models';
import { ToastrService } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  public currentUser: Observable<User>;

  private currentUserSubject: BehaviorSubject<User>;

  constructor(private _http: HttpClient, private _toastrService: ToastrService) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  get isAdmin() {
    return this.currentUser && this.currentUserSubject.value.role === Role.Admin;
  }

  get isClient() {
    return this.currentUser && this.currentUserSubject.value.role === Role.Client;
  }

  get permissionsModule() {
    return this.currentUserSubject.value.permissions.permission_module;
  }

  get permissionsObjects() {
    return this.currentUserSubject.value.permissions.permission_object;
  }

  login(username: string, password: string) {
    let app = 1;
    return this._http
      .post<any>(`/api/token-auth/`, { username, password, app})
      .pipe(
        map(user => {
          // login successful if there's a jwt token in the response
          if (user && user.token) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('currentUser', JSON.stringify(user));

            // Display welcome toast!
            setTimeout(() => {
              this._toastrService.success(
                'Ha iniciado sesión con éxito como un ' +
                  user.rol_group[0] +
                  '. Ahora puedes empezar a explorar! 🎉',
                '👋 Bienvenido, ' + user.short_name + '!',
                { toastClass: 'toast ngx-toastr', closeButton: true }
              );
            }, 500);

            // notify
            this.currentUserSubject.next(user);
          }

          return user;
        })
      )
  }

  registerNewFarmer(body: any) {
    return this._http
      .post<any>(`/api/register-user/`, body)
      .pipe(
        catchError(e => {
          return throwError(e)
        })
      );
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
}
