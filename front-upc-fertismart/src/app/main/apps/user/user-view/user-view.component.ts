import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserViewService } from 'app/main/apps/user/user-view/user-view.service';
import { UserSharedService } from '../user-shared.service';
import { LoadMessageService } from 'app/shared/services/load-message.service';
import { User } from 'app/auth/models';
import { AuthenticationService } from 'app/auth/service';

@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UserViewComponent implements OnInit, OnDestroy {
  public url = this.router.url;
  public lastValue;
  public data;
  public userSession: User;
  public validateUserSession: boolean;

  private _unsubscribeAll: Subject<any>;

  constructor(
    private router: Router,
    private _userViewService: UserViewService,
    private _userSharedService: UserSharedService,
    private _loadMsgService: LoadMessageService,
    private _authenticationService: AuthenticationService
  ) {
    this._authenticationService.currentUser.subscribe(x => (this.userSession = x));
    this._unsubscribeAll = new Subject();
    this.lastValue = this.url.substr(this.url.lastIndexOf('/') + 1);
  }

  ngOnInit(): void {
    this._userViewService.onUserViewChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(response => {
        this.data = response;
        this.validateUserSession = (this.userSession.id === this.data.id)
      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  onActivateUser(userId) {
    this._userSharedService.activateUser({user: userId})
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(resp => {
        this._loadMsgService.showToastMsgSuccess(
          'Se activó el usuario correctamente',
          'Buen trabajo!',
        );
        this._userViewService.getDetailUser(userId);
        this._loadMsgService.hideLoadingMsg();
      });;
  }

  onDeactivateUser(userId) {
    this._userSharedService.deactivateUser({user: userId})
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(resp => {
        this._loadMsgService.showToastMsgSuccess(
          'Se desactivó el usuario correctamente',
          'Buen trabajo!',
        );
        this._userViewService.getDetailUser(userId);
        this._loadMsgService.hideLoadingMsg();
      });
  }
}
