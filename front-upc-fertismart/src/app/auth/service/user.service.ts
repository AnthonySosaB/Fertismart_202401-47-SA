import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { User } from 'app/auth/models';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private _http: HttpClient) {}

  getAll() {
    return this._http.get<User[]>(`${environment.apiUrl}/users`);
  }

  getById(id: number) {
    return this._http.get<User>(`${environment.apiUrl}/users/${id}`);
  }
}
