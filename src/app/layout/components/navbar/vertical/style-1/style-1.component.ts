import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';
import { FuseConfigService } from '@fuse/services/config.service';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { FusePerfectScrollbarDirective } from '@fuse/directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
// import { config } from '../../../../../../config';
import { environment } from 'environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as english } from '../../../../../layout/i18n/en';
import { locale as spanish } from '../../../../../layout/i18n/tr';
import { Http,Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material';

@Component({
    selector: 'navbar-vertical-style-1',
    templateUrl: './style-1.component.html',
    styleUrls: ['./style-1.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class NavbarVerticalStyle1Component implements OnInit, OnDestroy {
    fuseConfig: any;
    fusePerfectScrollbarUpdateTimeout: any;
    navigation: any;
    role;
    orgName;
    blank = undefined;
    username;
    userType;
    profileImageUrl = environment.profileImageUrl;
    urlPort = environment.urlPort;
    // profileImageUrl=config.profileImageUrl;


    logoPath;

    // Private
    private _fusePerfectScrollbar: FusePerfectScrollbarDirective;
    private _unsubscribeAll: Subject<any>;
    loading1= false;

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FuseNavigationService} _fuseNavigationService
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {Router} _router
     */
    horizontalPosition: MatSnackBarHorizontalPosition = 'right'; verticalPosition: MatSnackBarVerticalPosition = 'top';
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _matSnackBar: MatSnackBar,
        private http: Http,
        private router: Router,
        private _fuseNavigationService: FuseNavigationService,
        private _fuseSidebarService: FuseSidebarService,
        private _router: Router,
        private _translateService: TranslateService,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService
    ) {
        // Set the private defaults
        this._fuseTranslationLoaderService.loadTranslations(english, spanish);
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    // Directive
    @ViewChild(FusePerfectScrollbarDirective)
    set directive(theDirective: FusePerfectScrollbarDirective) {
        if (!theDirective) {
            return;
        }

        this._fusePerfectScrollbar = theDirective;

        // Update the scrollbar on collapsable item toggle
        this._fuseNavigationService.onItemCollapseToggled
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.fusePerfectScrollbarUpdateTimeout = setTimeout(() => {
                    this._fusePerfectScrollbar.update();
                }, 310);
            });

        // Scroll to the active item position
        this._router.events
            .pipe(
                filter((event) => event instanceof NavigationEnd),
                take(1)
            )
            .subscribe(() => {
                setTimeout(() => {
                    const activeNavItem: any = document.querySelector('navbar .nav-link.active');

                    if (activeNavItem) {
                        const activeItemOffsetTop = activeNavItem.offsetTop,
                            activeItemOffsetParentTop = activeNavItem.offsetParent.offsetTop,
                            scrollDistance = activeItemOffsetTop - activeItemOffsetParentTop - (48 * 3) - 168;

                        this._fusePerfectScrollbar.scrollToTop(scrollDistance);
                    }
                });
            }
            );
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.userType = sessionStorage.getItem('userType')
        this.orgName = sessionStorage.getItem("orgName")
        this.username = sessionStorage.getItem("username");
        this.role = sessionStorage.getItem("role");
        this.logoPath = sessionStorage.getItem("logoPath");
        this._router.events
            .pipe(
                filter((event) => event instanceof NavigationEnd),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe(() => {
                if (this._fuseSidebarService.getSidebar('navbar')) {
                    this._fuseSidebarService.getSidebar('navbar').close();
                }
            }
            );

        // Subscribe to the config changes
        this._fuseConfigService.config
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((config) => {
                this.fuseConfig = config;
            });

        // Get current navigation
        this._fuseNavigationService.onNavigationChanged
            .pipe(
                filter(value => value !== null),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe(() => {
                this.navigation = this._fuseNavigationService.getCurrentNavigation();
            });
    }


    savePhoto(event) {
        if (event.target.files[0].type.startsWith("image")) {
        var file = event.target.files[0];
        var fd = new FormData();
        fd.append('file', file);
        var path = './profileImages/'
        var purpose = 'uploadUserProfileImage'
        if(this.userType == 'Organization'){
        var filename = sessionStorage.getItem('orgName')
        console.log("Inside if filename: ",filename)
        } else {
            var filename = sessionStorage.getItem('username')
            console.log("Inside else filename: ",filename)
        }
        
        // this.http.post(this.urlPort + "/api/uploadProfileImage/" + this.username, fd, { withCredentials: true, headers: new Headers({ 'Authorization': 'Bearer ' + sessionStorage.getItem('token') }) })
        this.http.post(this.urlPort + "/api/filesUpload/saveFile" + "?path=" + path + "&username=" + filename + "&purpose=" + purpose, fd, { withCredentials: true, headers: new Headers({ 'Authorization': 'Bearer ' + sessionStorage.getItem('token') }) })
          .map((response) => response.json())
          .catch((err) => {
            this.loading1 = false;
            var error = err["_body"]
            if (error == "session expired") {
              this.sessionSnackBar(err["_body"]);
              this.router.navigate(['/pages/auth/login-2']);
            } else {
              var snackBar = this._translateService.instant("Failed to upload profile image");
              this.openSnackBar(snackBar);
            }
            return Observable.throw(err)
          })
          .subscribe(res => {
            console.log("savePhoto: ",res)
            var snackBar = this._translateService.instant("Profile Image Saved");
            this.openSnackBar(snackBar);
            window.location.reload();
          })
        } else {
            var snackBar = this._translateService.instant("File type must be Image");
            this.openSnackBar(snackBar);
        }
      }

      sessionSnackBar(data) {
        var snackBar = this._translateService.instant("End Now");
        this._matSnackBar.open(data, snackBar, {
          duration: 10000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      }

      /** * @author:Akshay * @description: Open success snak bar */
  openSnackBar(data) {
    var endNow = this._translateService.instant('End now');
    this._matSnackBar.open(data, endNow, {
      duration: 10000, horizontalPosition: this.horizontalPosition, verticalPosition: this.verticalPosition,
    });
  }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        if (this.fusePerfectScrollbarUpdateTimeout) {
            clearTimeout(this.fusePerfectScrollbarUpdateTimeout);
        }

        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle sidebar opened status
     */
    toggleSidebarOpened(): void {
        this._fuseSidebarService.getSidebar('navbar').toggleOpen();
    }

    /**
     * Toggle sidebar folded status
     */
    toggleSidebarFolded(): void {
        this._fuseSidebarService.getSidebar('navbar').toggleFold();
    }
}
