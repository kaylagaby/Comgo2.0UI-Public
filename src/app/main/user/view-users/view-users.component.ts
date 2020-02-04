import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { Subject } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Response, Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { environment } from '../../../../environments/environment';
import { Sort } from '@angular/material';
import { MatSnackBar, MatTableDataSource, MatDialog, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material';
import { DialogElementsExampleDialog } from '../../dialog/dialog.component'
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as english } from '../../../layout/i18n/en';
import { locale as spanish } from '../../../layout/i18n/tr';
import { TranslateService } from '@ngx-translate/core';
import { FuseConfigService } from '@fuse/services/config.service';
var introJS = require('intro.js')

@Component({
    selector: 'app-view-users',
    templateUrl: './view-users.component.html',
    styleUrls: ['./view-users.component.scss'],
    animations: fuseAnimations
})
export class ViewUsersComponent implements OnInit {
    urlPort = environment.urlPort;
    foundation = environment.foundation;
    dataOfUsers: Array<any> = [];
    role;
    userType;
    dataSource;
    tableData
    username;
    changeStatusResult;
    milestoneId;
    createdBy;
    routesPath;
    foundationCompany;
    userDetails;
    subRole;
    displayedColumns;
    loading1;
    @ViewChild(MatPaginator)
    paginator: MatPaginator;
    @ViewChild(MatSort)
    sort: MatSort;
    @ViewChild('filter')
    filter: ElementRef;
    private _unsubscribeAll: Subject<any>;

    /**
   * Constructor
   * @param {FormBuilder} _formBuilder
   * @param {Location} _location
   * @param {MatSnackBar} _matSnackBar
   */

    constructor(
        private _fuseConfigService: FuseConfigService,
        private router: Router,
        private http: Http,
        private httpCLient: HttpClient,
        private _matSnackBar: MatSnackBar,
        public dialog: MatDialog,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _translateService: TranslateService
    ) {
        this._fuseTranslationLoaderService.loadTranslations(english, spanish);
        // this.product = new Product();

        // Set the private defaults
        this._unsubscribeAll = new Subject();
        this._fuseConfigService.config = {
            layout: {
                footer: {
                    hidden: true
                },
                sidepanel: {
                    hidden: true
                }
            }
        };
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /** 
     * @author:sagar
     * @argument:project id
     * @description:it is method to call function at initialize phase..calling get milestones list for specific project id
    */

    /**
     * @author: Madhu
     * @argument:none
     * @description:to fix position
     */
    horizontalPosition: MatSnackBarHorizontalPosition = 'right'; verticalPosition: MatSnackBarVerticalPosition = 'top';
    ngOnInit(): void {
        this.userType = sessionStorage.getItem("userType")
        if (sessionStorage.getItem("profileSubmit") == 'done' || sessionStorage.getItem("projectUpdate") == 'done') {
            window.location.reload();
            sessionStorage.setItem("profileSubmit", 'notdone')
            sessionStorage.setItem("projectUpdate", 'notdone')
        }
        this.createdBy = sessionStorage.getItem("createdBy")
        this.foundationCompany = sessionStorage.getItem("foundationCompany")
        this.subRole = sessionStorage.getItem("subRole")
        this.role = sessionStorage.getItem("role")
        this.username = sessionStorage.getItem("username");
        this.displayedColumns = ['username', 'role', 'icons'];
        this.showPage();
    }

    startTour() {
        var intro: any = introJS.introJs();
        intro.setOption('tooltipPosition', 'auto');
        intro.setOption('positionPrecedence', ['left', 'right', 'top', 'bottom']);
        intro.setOptions({
            steps: [
                {
                    element: '#viewusersRegister',
                    intro: 'Admin,Foundation or NGO can register user from here.'
                },
                {
                    element: '#viewusersSearch',
                    intro: 'Admin,Foundation or NGO can filter the list of users from here.'
                }
            ],
            showBullets: true,
            showButtons: true,
            exitOnOverlayClick: false,
            keyboardNavigation: true,
        });
        intro.start();
    }

    showPage() {
        var token = sessionStorage.getItem('token');
        console.log("sessionStorage.getItem('token') :",sessionStorage.getItem('token'))
        this.http.get(this.urlPort + "/api/projectcommunication/GetAllReceiveEmail", { withCredentials: true, headers: new Headers({ 'Authorization': 'Bearer '+token }) })
        .map(
          (response) => response
        )
        .catch((err) => {
          var error = err["_body"]
          if (error == "session expired") {
            this.sessionSnackBar(err["_body"]);
            this.router.navigate(['/pages/auth/login-2']);
          }
          return Observable.throw(err)
        })
        .subscribe(res => {
        })

        this.routesPath = this.router.url.split("/", 4)
        if(this.routesPath[3] == 'myUsers'){
            this.httpCLient.get(this.urlPort + "/api/users/getAllUser/" + sessionStorage.getItem('userType') + "/myUsers/" + sessionStorage.getItem('orgName'), { withCredentials: true })
            .map(
                (response) => response
            )
            .catch((err) => {
                var error = err["_body"]
                if (error == "session expired") {
                    this.sessionSnackBar(err["_body"]);
                    this.router.navigate(['/pages/auth/login-2']);
                }
                return Observable.throw(err)
            })
            .subscribe((res: Response) => {
                // this.notification.Success(res['response']);
                // this.router.navigate(['/components/collections'])
                var users = [];
                this.userDetails = res;
                this.dataOfUsers = this.userDetails;
                this.dataSource = new MatTableDataSource(this.dataOfUsers);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
            })
        } else if(this.routesPath[3] == 'searchUsers'){
            this.httpCLient.get(this.urlPort + "/api/users/getAllUser/" + sessionStorage.getItem('userType') + "/searchUsers/"+sessionStorage.getItem('orgName'), { withCredentials: true })
            .map(
                (response) => response
            )
            .catch((err) => {
                var error = err["_body"]
                if (error == "session expired") {
                    this.sessionSnackBar(err["_body"]);
                    this.router.navigate(['/pages/auth/login-2']);
                }
                return Observable.throw(err)
            })
            .subscribe((res: Response) => {
                // this.notification.Success(res['response']);
                // this.router.navigate(['/components/collections'])
                var users = [];
                this.userDetails = res;
                this.dataOfUsers = this.userDetails;
                this.dataSource = new MatTableDataSource(this.dataOfUsers);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
            })
        } else {
            this.httpCLient.get(this.urlPort + "/api/users/getAllUser/" + sessionStorage.getItem('userType') + "/privateUser/noOrg", { withCredentials: true })
            .map(
                (response) => response
            )
            .catch((err) => {
                var error = err["_body"]
                if (error == "session expired") {
                    this.sessionSnackBar(err["_body"]);
                    this.router.navigate(['/pages/auth/login-2']);
                }
                return Observable.throw(err)
            })
            .subscribe((res: Response) => {
                // this.notification.Success(res['response']);
                // this.router.navigate(['/components/collections'])
                var users = [];
                this.userDetails = res;
                this.dataOfUsers = this.userDetails;
                this.dataSource = new MatTableDataSource(this.dataOfUsers);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
            })
        }
    }
    /**
         * @author: Madhu
         * @argument:none
         * @description:filter function
         */
    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
        this.dataSource.filter = filterValue;
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    /** * @author:Akshay * @description: Open success snak bar */ openSnackBar(data) {
        var endNow = this._translateService.instant('End now');
        this._matSnackBar.open(data, endNow, {

            duration: 10000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
        });
    }

    sessionSnackBar(data) {
        var endNow = this._translateService.instant('End now');
        this._matSnackBar.open(data, endNow, {
            duration: 10000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
        });
    }
    /**
    /** 
        * @author:Madhu
        * @argument:data
        * @description:sorting 
       */
    sortData(sort: Sort) {
        const data = this.userDetails.slice();
        if (!sort.active || sort.direction == '') {
            this.dataOfUsers = data;
            return;
        }
        this.dataOfUsers = data.sort((a, b) => {
            var isAsc = sort.direction == 'asc';
            switch (sort.active) {
                case 'firstName': return compare(a.firstName, b.firstName, isAsc);
                case 'lastName': return compare(+a.lastName, +b.lastName, isAsc);
                case 'Role': return compare(+a.Role, +b.Role, isAsc);
                default: return 0;
            }
        });
    }

    setCredentials(userDetails) {
        sessionStorage.setItem("rulesSetToUser", userDetails.username)
        if(this.routesPath[3] == 'myUsers'){
        this.router.navigate(["/user/user/userRules", { backTo: '/user/user/myUsers' }]);
        } else if (this.routesPath[3] == 'searchUsers'){
            this.router.navigate(["/user/user/userRules", { backTo: '/user/user/searchUsers' }]);
        } else {
            this.router.navigate(["/user/user/userRules", { backTo: '/user/user/viewUsers' }]);
        }
    }

    viewUserProfile(userData) {
        sessionStorage.setItem("backRoutes",'/user/user/viewUsers')
        this.router.navigate(["/user/user/userDetails", { username: userData.username}]);
    }

    changeUserStatus(data, stat) {
        var dialogueStatus;
        if (this.userType == 'admin') {
            dialogueStatus = stat;
            let dialogRef = this.dialog.open(DialogElementsExampleDialog, {
                width: '500px',
                height: '200px',
                data: { operation: 'changeStat', statBody: dialogueStatus }
            });
            dialogRef.afterClosed().subscribe(result => {

                this.changeStatusResult = result;
                if (this.changeStatusResult == 'yes') {
                    if (stat == 'activate') {
                        data.regUser = 1;
                        data.status = stat
                    }
                    if (stat == 'deactivate') {
                        data.regUser = 0;
                        data.status = stat
                    }

                    this.httpCLient.post(this.urlPort + "/api/users/approveUser", data, { withCredentials: true })
                        .catch((err) => {
                            var error = err["_body"]
                            if (error == "session expired") {
                                this.sessionSnackBar(err["_body"]);
                                this.router.navigate(['/pages/auth/login-2']);
                            }
                            return Observable.throw(err)
                        })
                        .subscribe((res: Response) => {
                            if (stat == 'activate') {
                                var snackBar = this._translateService.instant("User Activated");
                                this.openSnackBar(snackBar);
                            }
                            if (stat == 'deactivate') {
                                var snackBar = this._translateService.instant("User Deactivated");
                                this.openSnackBar(snackBar);
                            }
                            this.ngOnInit();
                        })
                } else {
                    var snackBar = this._translateService.instant("Operation cancelled!!!");
                    this.openSnackBar(snackBar);
                }
            })
        } else {
            var snackBar = this._translateService.instant("This User Don't have right to Activate or Deactivate User");
            this.openSnackBar(snackBar);
        }
    }

    sendInvitation() {
        var dialogueStatus;
        let dialogRef = this.dialog.open(DialogElementsExampleDialog, {
            width: '500px',
            height: '200px',
            data: { operation: 'sendInvitation' }
        });
        dialogRef.afterClosed().subscribe(result => {
            this.changeStatusResult = result.ans;
            if (this.changeStatusResult == 'yes') {
                var data = {
                    email: result.email,
                    orgName: sessionStorage.getItem('orgName'),
                    regURL: environment.regUrl,
                    userType: sessionStorage.getItem('userType')
                }
                this.loading1 = true;
                this.httpCLient.post(this.urlPort + "/api/users/sendInvitation", data, { withCredentials: true })
                    .catch((err) => {
                        this.loading1 = false;
                        var error = err["_body"]
                        if (error == "session expired") {
                            this.sessionSnackBar(err["_body"]);
                            this.router.navigate(['/pages/auth/login-2']);
                        }
                        return Observable.throw(err)
                    })
                    .subscribe((res: Response) => {
                        this.loading1 = false;
                        var snackBar = this._translateService.instant("Invitation has been send");
                        this.openSnackBar(snackBar);
                    })
            } else {
                var snackBar = this._translateService.instant("Operation cancelled!!!");
                this.openSnackBar(snackBar);
            }
        })
    }

}
function compare(a, b, isAsc) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}



