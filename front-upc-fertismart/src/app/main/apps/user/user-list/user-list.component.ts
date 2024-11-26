import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CoreConfigService } from '@core/services/config.service';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';

import { UserListService } from 'app/main/apps/user/user-list/user-list.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { UserSharedService } from '../user-shared.service';
import { LoadMessageService } from 'app/shared/services/load-message.service';
import { User } from 'app/auth/models';
import { AuthenticationService } from 'app/auth/service';
import { PermissionObjectService } from 'app/shared/services/permissions-object.service';
import { UPermissions } from 'app/shared/enums/user-permissions.enum';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UserListComponent implements OnInit {
  public contentHeader: object;
  public sidebarToggleRef = false;
  public rows;
  public selectedOption = 10;
  public ColumnMode = ColumnMode;
  public temp = [];
  public previousRoleFilter = '';
  public previousPlanFilter = '';
  public previousStatusFilter = '';
  public userSession: User;

  //Permissions object
  public claimMainCreateUser: boolean;

  public selectedRole = [];
  public selectedStatus = [];
  public searchValue = '';

  @ViewChild(DatatableComponent) table: DatatableComponent;

  private tempData = [];
  private _unsubscribeAll: Subject<any>;

  constructor(
    private _userListService: UserListService,
    private _coreSidebarService: CoreSidebarService,
    private _userSharedService: UserSharedService,
    private _loadMsgService: LoadMessageService,
    private _authenticationService: AuthenticationService,
    private _permissionObjectService: PermissionObjectService
  ) {
    this._unsubscribeAll = new Subject();
    this._authenticationService.currentUser.subscribe(x => (this.userSession = x));
    this.claimMainCreateUser = _permissionObjectService.getMainPermission(UPermissions.MAIN_USER_CREATE);
  }

  ngOnInit(): void {
    this.assignTitleBreadcrumbs();
    this._userListService.onUserListChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(response => {
        this.rows = response;
        this.tempData = this.rows;
      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  assignTitleBreadcrumbs() {
    this.contentHeader = {
      headerTitle: 'Usuarios',
      actionButton: false,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Inicio',
            isLink: true,
            link: '/'
          },
          {
            name: 'Usuarios',
            isLink: false
          }
        ]
      }
    };
  }

  filterUpdate(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.tempData.filter(function (d) {
      return d.first_name.toLowerCase().indexOf(val) !== -1 ||
        d.last_name.toLowerCase().indexOf(val) !== -1 ||
        d.email.toLowerCase().indexOf(val) !== -1 ||
        d.profile.num_document.toLowerCase().indexOf(val) !== -1 || !val;
    });

    this.rows = temp;
    this.table.offset = 0;
  }

  toggleSidebar(name): void {
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }

  filterByRole(event) {
    const filter = event ? event.value : '';
    this.previousRoleFilter = filter;
    this.temp = this.filterRows(filter, this.previousPlanFilter, this.previousStatusFilter);
    this.rows = this.temp;
  }

  filterByPlan(event) {
    const filter = event ? event.value : '';
    this.previousPlanFilter = filter;
    this.temp = this.filterRows(this.previousRoleFilter, filter, this.previousStatusFilter);
    this.rows = this.temp;
  }

  filterByStatus(event) {
    const filter = event ? event.value : '';
    this.previousStatusFilter = filter;
    this.temp = this.filterRows(this.previousRoleFilter, this.previousPlanFilter, filter);
    this.rows = this.temp;
  }

  filterRows(roleFilter, planFilter, statusFilter): any[] {
    this.searchValue = '';

    roleFilter = roleFilter.toLowerCase();
    planFilter = planFilter.toLowerCase();
    statusFilter = statusFilter.toLowerCase();

    return this.tempData.filter(row => {
      const isPartialNameMatch = row.groups.toLowerCase().indexOf(roleFilter) !== -1 || !roleFilter;
      const isPartialGenderMatch = row.first_name.toLowerCase().indexOf(planFilter) !== -1 || !planFilter;
      const isPartialStatusMatch = row.status.toLowerCase().indexOf(statusFilter) !== -1 || !statusFilter;
      return isPartialNameMatch && isPartialGenderMatch && isPartialStatusMatch;
    });
  }

  onActivateUser(userId) {
    this._userSharedService.activateUser({user: userId})
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(resp => {
        this._loadMsgService.showToastMsgSuccess(
          'Se activó el usuario correctamente',
          'Buen trabajo!',
        );
        this._userListService.getDataUserList();
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
        this._userListService.getDataUserList();
        this._loadMsgService.hideLoadingMsg();
      });
  }
}
