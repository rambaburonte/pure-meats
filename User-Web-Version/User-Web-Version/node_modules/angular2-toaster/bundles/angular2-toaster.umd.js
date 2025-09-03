(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/animations'), require('rxjs'), require('rxjs/operators'), require('@angular/common'), require('@angular/platform-browser')) :
    typeof define === 'function' && define.amd ? define('angular2-toaster', ['exports', '@angular/core', '@angular/animations', 'rxjs', 'rxjs/operators', '@angular/common', '@angular/platform-browser'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global['angular2-toaster'] = {}, global.ng.core, global.ng.animations, global.rxjs, global.rxjs.operators, global.ng.common, global.ng.platformBrowser));
}(this, (function (exports, i0, animations, rxjs, operators, common, platformBrowser) { 'use strict';

    var Transitions = [
        animations.trigger('toastState', [
            animations.state('flyRight, flyLeft, slideDown, slideDown, slideUp, slideUp, fade', animations.style({ opacity: 1, transform: 'translate(0,0)' })),
            animations.transition('void => flyRight', [
                animations.style({
                    opacity: 0,
                    transform: 'translateX(100%)',
                    height: 0
                }),
                animations.animate('0.15s ease-in', animations.style({
                    opacity: 1,
                    height: '*'
                })),
                animations.animate('0.25s 15ms ease-in')
            ]),
            animations.transition('flyRight => void', [
                animations.animate('0.25s ease-out', animations.style({
                    opacity: 0,
                    transform: 'translateX(100%)'
                })),
                animations.animate('0.15s ease-out', animations.style({
                    height: 0
                }))
            ]),
            animations.transition('void => flyLeft', [
                animations.style({
                    opacity: 0,
                    transform: 'translateX(-100%)',
                    height: 0
                }),
                animations.animate('0.15s ease-in', animations.style({
                    opacity: 1,
                    height: '*'
                })),
                animations.animate('0.25s 15ms ease-in')
            ]),
            animations.transition('flyLeft => void', [
                animations.animate('0.25s 10ms ease-out', animations.style({
                    opacity: 0,
                    transform: 'translateX(-100%)'
                })),
                animations.animate('0.15s ease-out', animations.style({
                    height: 0
                }))
            ]),
            animations.transition('void => slideDown', [
                animations.style({
                    opacity: 0,
                    transform: 'translateY(-500%)',
                    height: 0
                }),
                animations.group([
                    animations.animate('0.2s ease-in', animations.style({
                        height: '*'
                    })),
                    animations.animate('0.4s ease-in', animations.style({
                        transform: 'translate(0,0)'
                    })),
                    animations.animate('0.3s 0.1s ease-in', animations.style({
                        opacity: 1
                    }))
                ])
            ]),
            animations.transition('slideDown => void', animations.group([
                animations.animate('0.3s ease-out', animations.style({
                    opacity: 0
                })),
                animations.animate('0.4s ease-out', animations.style({
                    transform: 'translateY(-500%)'
                })),
                animations.animate('0.2s 0.2s ease-out', animations.style({
                    height: 0
                }))
            ])),
            animations.transition('void => slideUp', [
                animations.style({
                    opacity: 0,
                    transform: 'translateY(1000%)',
                    height: 0
                }),
                animations.group([
                    animations.animate('0.2s ease-in', animations.style({
                        height: '*'
                    })),
                    animations.animate('0.5s ease-in', animations.style({
                        transform: 'translate(0,0)'
                    })),
                    animations.animate('0.3s 0.1s ease-in', animations.style({
                        opacity: 1
                    }))
                ])
            ]),
            animations.transition('slideUp => void', animations.group([
                animations.animate('0.3s ease-out', animations.style({
                    opacity: 0
                })),
                animations.animate('0.5s ease-out', animations.style({
                    transform: 'translateY(1000%)'
                })),
                animations.animate('0.3s 0.15s ease-out', animations.style({
                    height: 0
                }))
            ])),
            animations.transition('void => fade', [
                animations.style({
                    opacity: 0,
                    height: 0
                }),
                animations.animate('0.20s ease-in', animations.style({
                    height: '*'
                })),
                animations.animate('0.15s ease-in', animations.style({
                    opacity: 1
                }))
            ]),
            animations.transition('fade => void', [
                animations.group([
                    animations.animate('0.0s ease-out', animations.style({
                        // reposition the background to prevent
                        // a ghost image during transition
                        'background-position': '-99999px'
                    })),
                    animations.animate('0.15s ease-out', animations.style({
                        opacity: 0,
                        'background-image': ''
                    })),
                    animations.animate('0.3s 20ms ease-out', animations.style({
                        height: 0
                    }))
                ])
            ])
        ]),
    ];

    (function (BodyOutputType) {
        BodyOutputType[BodyOutputType["Default"] = 0] = "Default";
        BodyOutputType[BodyOutputType["TrustedHtml"] = 1] = "TrustedHtml";
        BodyOutputType[BodyOutputType["Component"] = 2] = "Component";
    })(exports.BodyOutputType || (exports.BodyOutputType = {}));

    var DefaultTypeClasses = {
        error: 'toast-error',
        info: 'toast-info',
        wait: 'toast-wait',
        success: 'toast-success',
        warning: 'toast-warning'
    };
    var DefaultIconClasses = {
        error: 'icon-error',
        info: 'icon-info',
        wait: 'icon-wait',
        success: 'icon-success',
        warning: 'icon-warning'
    };
    var ToasterConfig = /** @class */ (function () {
        function ToasterConfig(configOverrides) {
            configOverrides = configOverrides || {};
            this.limit = configOverrides.limit || null;
            this.tapToDismiss = configOverrides.tapToDismiss != null ? configOverrides.tapToDismiss : true;
            this.showCloseButton = configOverrides.showCloseButton != null ? configOverrides.showCloseButton : false;
            this.closeHtml = configOverrides.closeHtml || '<span>&times;</span>';
            this.newestOnTop = configOverrides.newestOnTop != null ? configOverrides.newestOnTop : true;
            this.timeout = configOverrides.timeout != null ? configOverrides.timeout : 5000;
            this.typeClasses = configOverrides.typeClasses || DefaultTypeClasses;
            this.iconClasses = configOverrides.iconClasses || DefaultIconClasses;
            this.bodyOutputType = configOverrides.bodyOutputType || exports.BodyOutputType.Default;
            this.bodyTemplate = configOverrides.bodyTemplate || 'toasterBodyTmpl.html';
            this.defaultToastType = configOverrides.defaultToastType || 'info';
            this.positionClass = configOverrides.positionClass || 'toast-top-right';
            this.titleClass = configOverrides.titleClass || 'toast-title';
            this.messageClass = configOverrides.messageClass || 'toast-message';
            this.animation = configOverrides.animation || '';
            this.preventDuplicates = configOverrides.preventDuplicates != null ? configOverrides.preventDuplicates : false;
            this.mouseoverTimerStop = configOverrides.mouseoverTimerStop != null ? configOverrides.mouseoverTimerStop : false;
            this.toastContainerId = configOverrides.toastContainerId != null ? configOverrides.toastContainerId : null;
        }
        return ToasterConfig;
    }());
    ToasterConfig.decorators = [
        { type: i0.Injectable }
    ];
    ToasterConfig.ctorParameters = function () { return [
        { type: undefined }
    ]; };

    // http://stackoverflow.com/questions/26501688/a-typescript-guid-class
    var Guid = /** @class */ (function () {
        function Guid() {
        }
        Guid.newGuid = function () {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        };
        return Guid;
    }());
    var ToasterService = /** @class */ (function () {
        /**
         * Creates an instance of ToasterService.
         */
        function ToasterService() {
            var _this = this;
            this.addToast = new rxjs.Observable(function (observer) { return _this._addToast = observer; }).pipe(operators.share());
            this.clearToasts = new rxjs.Observable(function (observer) { return _this._clearToasts = observer; }).pipe(operators.share());
            this._removeToastSubject = new rxjs.Subject();
            this.removeToast = this._removeToastSubject.pipe(operators.share());
        }
        /**
         * Synchronously create and show a new toast instance.
         *
         * @param {(string | Toast)} type The type of the toast, or a Toast object.
         * @param {string=} title The toast title.
         * @param {string=} body The toast body.
         * @returns {Toast}
         *          The newly created Toast instance with a randomly generated GUID Id.
         */
        ToasterService.prototype.pop = function (type, title, body) {
            var toast = typeof type === 'string' ? { type: type, title: title, body: body } : type;
            if (!toast.toastId) {
                toast.toastId = Guid.newGuid();
            }
            if (!this._addToast) {
                throw new Error('No Toaster Containers have been initialized to receive toasts.');
            }
            this._addToast.next(toast);
            return toast;
        };
        /**
         * Asynchronously create and show a new toast instance.
         *
         * @param {(string | Toast)} type The type of the toast, or a Toast object.
         * @param {string=} title The toast title.
         * @param {string=} body The toast body.
         * @returns {Observable<Toast>}
         *          A hot Observable that can be subscribed to in order to receive the Toast instance
         *          with a randomly generated GUID Id.
         */
        ToasterService.prototype.popAsync = function (type, title, body) {
            var _this = this;
            setTimeout(function () {
                _this.pop(type, title, body);
            }, 0);
            return this.addToast;
        };
        /**
         * Clears a toast by toastId and/or toastContainerId.
         *
         * @param {string} toastId The toastId to clear.
         * @param {number=} toastContainerId
         *        The toastContainerId of the container to remove toasts from.
         */
        ToasterService.prototype.clear = function (toastId, toastContainerId) {
            var clearWrapper = {
                toastId: toastId, toastContainerId: toastContainerId
            };
            this._clearToasts.next(clearWrapper);
        };
        return ToasterService;
    }());
    ToasterService.ɵprov = i0.ɵɵdefineInjectable({ factory: function ToasterService_Factory() { return new ToasterService(); }, token: ToasterService, providedIn: "root" });
    ToasterService.decorators = [
        { type: i0.Injectable, args: [{ providedIn: 'root' },] }
    ];
    ToasterService.ctorParameters = function () { return []; };

    var ToasterContainerComponent = /** @class */ (function () {
        function ToasterContainerComponent(toasterService) {
            this.toasts = [];
            this.toasterService = toasterService;
        }
        ToasterContainerComponent.prototype.ngOnInit = function () {
            this.registerSubscribers();
            if (this.isNullOrUndefined(this.toasterconfig)) {
                this.toasterconfig = new ToasterConfig();
            }
        };
        // event handlers
        ToasterContainerComponent.prototype.click = function (toast, isCloseButton) {
            if (toast.onClickCallback) {
                toast.onClickCallback(toast);
            }
            var tapToDismiss = !this.isNullOrUndefined(toast.tapToDismiss)
                ? toast.tapToDismiss
                : this.toasterconfig.tapToDismiss;
            if (tapToDismiss || (toast.showCloseButton && isCloseButton)) {
                this.removeToast(toast);
            }
        };
        ToasterContainerComponent.prototype.childClick = function ($event) {
            this.click($event.value.toast, $event.value.isCloseButton);
        };
        ToasterContainerComponent.prototype.removeToast = function (toast) {
            var index = this.toasts.indexOf(toast);
            if (index < 0) {
                return;
            }
            ;
            var toastId = this.toastIdOrDefault(toast);
            this.toasts.splice(index, 1);
            if (toast.onHideCallback) {
                toast.onHideCallback(toast);
            }
            this.toasterService._removeToastSubject.next({ toastId: toastId, toastContainerId: toast.toastContainerId });
        };
        // private functions
        ToasterContainerComponent.prototype.registerSubscribers = function () {
            var _this = this;
            this.addToastSubscriber = this.toasterService.addToast.subscribe(function (toast) {
                _this.addToast(toast);
            });
            this.clearToastsSubscriber = this.toasterService.clearToasts.subscribe(function (clearWrapper) {
                _this.clearToasts(clearWrapper);
            });
        };
        ToasterContainerComponent.prototype.addToast = function (toast) {
            if (toast.toastContainerId && this.toasterconfig.toastContainerId
                && toast.toastContainerId !== this.toasterconfig.toastContainerId) {
                return;
            }
            ;
            if (!toast.type
                || !this.toasterconfig.typeClasses[toast.type]
                || !this.toasterconfig.iconClasses[toast.type]) {
                toast.type = this.toasterconfig.defaultToastType;
            }
            if (this.toasterconfig.preventDuplicates && this.toasts.length > 0) {
                if (toast.toastId && this.toasts.some(function (t) { return t.toastId === toast.toastId; })) {
                    return;
                }
                else if (this.toasts.some(function (t) { return t.body === toast.body; })) {
                    return;
                }
            }
            if (this.isNullOrUndefined(toast.showCloseButton)) {
                if (typeof this.toasterconfig.showCloseButton === 'object') {
                    toast.showCloseButton = this.toasterconfig.showCloseButton[toast.type];
                }
                else if (typeof this.toasterconfig.showCloseButton === 'boolean') {
                    toast.showCloseButton = this.toasterconfig.showCloseButton;
                }
            }
            if (toast.showCloseButton) {
                toast.closeHtml = toast.closeHtml || this.toasterconfig.closeHtml;
            }
            toast.bodyOutputType = toast.bodyOutputType || this.toasterconfig.bodyOutputType;
            if (this.toasterconfig.newestOnTop) {
                this.toasts.unshift(toast);
                if (this.isLimitExceeded()) {
                    this.toasts.pop();
                }
            }
            else {
                this.toasts.push(toast);
                if (this.isLimitExceeded()) {
                    this.toasts.shift();
                }
            }
            if (toast.onShowCallback) {
                toast.onShowCallback(toast);
            }
        };
        ToasterContainerComponent.prototype.isLimitExceeded = function () {
            return this.toasterconfig.limit && this.toasts.length > this.toasterconfig.limit;
        };
        ToasterContainerComponent.prototype.removeAllToasts = function () {
            for (var i = this.toasts.length - 1; i >= 0; i--) {
                this.removeToast(this.toasts[i]);
            }
        };
        ToasterContainerComponent.prototype.clearToasts = function (clearWrapper) {
            var toastId = clearWrapper.toastId;
            var toastContainerId = clearWrapper.toastContainerId;
            if (this.isNullOrUndefined(toastContainerId) || (toastContainerId === this.toasterconfig.toastContainerId)) {
                this.clearToastsAction(toastId);
            }
        };
        ToasterContainerComponent.prototype.clearToastsAction = function (toastId) {
            if (toastId) {
                this.removeToast(this.toasts.filter(function (t) { return t.toastId === toastId; })[0]);
            }
            else {
                this.removeAllToasts();
            }
        };
        ToasterContainerComponent.prototype.toastIdOrDefault = function (toast) {
            return toast.toastId || '';
        };
        ToasterContainerComponent.prototype.isNullOrUndefined = function (value) {
            return value === null || typeof value === 'undefined';
        };
        ToasterContainerComponent.prototype.ngOnDestroy = function () {
            if (this.addToastSubscriber) {
                this.addToastSubscriber.unsubscribe();
            }
            if (this.clearToastsSubscriber) {
                this.clearToastsSubscriber.unsubscribe();
            }
        };
        return ToasterContainerComponent;
    }());
    ToasterContainerComponent.decorators = [
        { type: i0.Component, args: [{
                    selector: 'toaster-container',
                    template: "\n        <div class=\"toast-container\" [ngClass]=\"[toasterconfig.positionClass]\">\n            <div toastComp *ngFor=\"let toast of toasts\" class=\"toast\" [toast]=\"toast\"\n                [toasterconfig]=\"toasterconfig\"\n                [@toastState]=\"toasterconfig.animation\"\n                [titleClass]=\"toasterconfig.titleClass\"\n                [messageClass]=\"toasterconfig.messageClass\"\n                [ngClass]=\"[\n                    toasterconfig.iconClasses[toast.type],\n                    toasterconfig.typeClasses[toast.type]\n                ]\"\n                (click)=\"click(toast)\" (clickEvent)=\"childClick($event)\"\n                (removeToastEvent)=\"removeToast($event)\"\n            >\n            </div>\n        </div>\n        ",
                    animations: Transitions
                },] }
    ];
    ToasterContainerComponent.ctorParameters = function () { return [
        { type: ToasterService }
    ]; };
    ToasterContainerComponent.propDecorators = {
        toasterconfig: [{ type: i0.Input }]
    };

    var ToastComponent = /** @class */ (function () {
        function ToastComponent(componentFactoryResolver, changeDetectorRef, ngZone, element, renderer2) {
            this.componentFactoryResolver = componentFactoryResolver;
            this.changeDetectorRef = changeDetectorRef;
            this.ngZone = ngZone;
            this.element = element;
            this.renderer2 = renderer2;
            this.progressBarWidth = -1;
            this.bodyOutputType = exports.BodyOutputType;
            this.clickEvent = new i0.EventEmitter();
            this.removeToastEvent = new i0.EventEmitter();
            this.timeoutId = null;
            this.timeout = 0;
            this.progressBarIntervalId = null;
        }
        ToastComponent.prototype.ngOnInit = function () {
            if (this.toast.progressBar) {
                this.toast.progressBarDirection = this.toast.progressBarDirection || 'decreasing';
            }
            var timeout = (typeof this.toast.timeout === 'number')
                ? this.toast.timeout : this.toasterconfig.timeout;
            if (typeof timeout === 'object') {
                timeout = timeout[this.toast.type];
            }
            ;
            this.timeout = timeout;
        };
        ToastComponent.prototype.ngAfterViewInit = function () {
            var _this = this;
            if (this.toast.bodyOutputType === this.bodyOutputType.Component) {
                var component = this.componentFactoryResolver.resolveComponentFactory(this.toast.body);
                var componentInstance = this.componentBody.createComponent(component, undefined, this.componentBody.injector);
                componentInstance.instance.toast = this.toast;
                this.changeDetectorRef.detectChanges();
            }
            if (this.toasterconfig.mouseoverTimerStop) {
                // only apply a mouseenter event when necessary to avoid
                // unnecessary event and change detection cycles.
                this.removeMouseOverListener = this.renderer2.listen(this.element.nativeElement, 'mouseenter', function () { return _this.stopTimer(); });
            }
            this.configureTimer();
        };
        ToastComponent.prototype.click = function (event, toast) {
            event.stopPropagation();
            this.clickEvent.emit({ value: { toast: toast, isCloseButton: true } });
        };
        ToastComponent.prototype.stopTimer = function () {
            this.progressBarWidth = 0;
            this.clearTimers();
        };
        ToastComponent.prototype.restartTimer = function () {
            if (this.toasterconfig.mouseoverTimerStop) {
                if (!this.timeoutId) {
                    this.configureTimer();
                }
            }
            else if (this.timeout && !this.timeoutId) {
                this.removeToast();
            }
        };
        ToastComponent.prototype.ngOnDestroy = function () {
            if (this.removeMouseOverListener) {
                this.removeMouseOverListener();
            }
            this.clearTimers();
        };
        ToastComponent.prototype.configureTimer = function () {
            var _this = this;
            if (!this.timeout || this.timeout < 1) {
                return;
            }
            if (this.toast.progressBar) {
                this.removeToastTick = new Date().getTime() + this.timeout;
                this.progressBarWidth = -1;
            }
            this.ngZone.runOutsideAngular(function () {
                _this.timeoutId = window.setTimeout(function () {
                    _this.ngZone.run(function () {
                        _this.changeDetectorRef.markForCheck();
                        _this.removeToast();
                    });
                }, _this.timeout);
                if (_this.toast.progressBar) {
                    _this.progressBarIntervalId = window.setInterval(function () {
                        _this.ngZone.run(function () {
                            _this.updateProgressBar();
                        });
                    }, 10);
                }
            });
        };
        ToastComponent.prototype.updateProgressBar = function () {
            if (this.progressBarWidth === 0 || this.progressBarWidth === 100) {
                return;
            }
            this.progressBarWidth = ((this.removeToastTick - new Date().getTime()) / this.timeout) * 100;
            if (this.toast.progressBarDirection === 'increasing') {
                this.progressBarWidth = 100 - this.progressBarWidth;
            }
            if (this.progressBarWidth < 0) {
                this.progressBarWidth = 0;
            }
            if (this.progressBarWidth > 100) {
                this.progressBarWidth = 100;
            }
        };
        ToastComponent.prototype.clearTimers = function () {
            if (this.timeoutId) {
                window.clearTimeout(this.timeoutId);
            }
            if (this.progressBarIntervalId) {
                window.clearInterval(this.progressBarIntervalId);
            }
            this.timeoutId = null;
            this.progressBarIntervalId = null;
        };
        ToastComponent.prototype.removeToast = function () {
            this.removeToastEvent.emit(this.toast);
        };
        return ToastComponent;
    }());
    ToastComponent.decorators = [
        { type: i0.Component, args: [{
                    selector: '[toastComp]',
                    template: "\n        <div class=\"toast-content\">\n            <div [ngClass]=\"titleClass\">{{toast.title}}</div>\n            <div [ngClass]=\"messageClass\" [ngSwitch]=\"toast.bodyOutputType\">\n                <div *ngSwitchCase=\"bodyOutputType.Component\" #componentBody></div>\n                <div *ngSwitchCase=\"bodyOutputType.TrustedHtml\" [innerHTML]=\"toast.body | trustHtml\"></div>\n                <div *ngSwitchCase=\"bodyOutputType.Default\">{{toast.body}}</div>\n            </div>\n        </div>\n        <button class=\"toast-close-button\" *ngIf=\"toast.showCloseButton\" (click)=\"click($event, toast)\"\n            [innerHTML]=\"toast.closeHtml | trustHtml\">\n        </button>\n        <div *ngIf=\"toast.progressBar\">\n            <div class=\"toast-progress-bar\" [style.width]=\"progressBarWidth + '%'\"></div>\n        </div>"
                },] }
    ];
    ToastComponent.ctorParameters = function () { return [
        { type: i0.ComponentFactoryResolver },
        { type: i0.ChangeDetectorRef },
        { type: i0.NgZone },
        { type: i0.ElementRef },
        { type: i0.Renderer2 }
    ]; };
    ToastComponent.propDecorators = {
        toasterconfig: [{ type: i0.Input }],
        toast: [{ type: i0.Input }],
        titleClass: [{ type: i0.Input }],
        messageClass: [{ type: i0.Input }],
        componentBody: [{ type: i0.ViewChild, args: ['componentBody', { read: i0.ViewContainerRef, static: false },] }],
        clickEvent: [{ type: i0.Output }],
        removeToastEvent: [{ type: i0.Output }],
        restartTimer: [{ type: i0.HostListener, args: ['mouseleave',] }]
    };

    var TrustHtmlPipe = /** @class */ (function () {
        function TrustHtmlPipe(sanitizer) {
            this.sanitizer = sanitizer;
        }
        TrustHtmlPipe.prototype.transform = function (content) {
            return this.sanitizer.bypassSecurityTrustHtml(content);
        };
        return TrustHtmlPipe;
    }());
    TrustHtmlPipe.decorators = [
        { type: i0.Pipe, args: [{
                    name: 'trustHtml',
                    pure: true
                },] }
    ];
    TrustHtmlPipe.ctorParameters = function () { return [
        { type: platformBrowser.DomSanitizer }
    ]; };

    var ToasterModule = /** @class */ (function () {
        function ToasterModule() {
        }
        ToasterModule.forRoot = function () {
            return {
                ngModule: ToasterModule,
                providers: [ToasterService, ToasterContainerComponent]
            };
        };
        ToasterModule.forChild = function () {
            return {
                ngModule: ToasterModule,
                providers: [ToasterContainerComponent]
            };
        };
        return ToasterModule;
    }());
    ToasterModule.decorators = [
        { type: i0.NgModule, args: [{
                    imports: [common.CommonModule],
                    declarations: [
                        ToastComponent,
                        ToasterContainerComponent,
                        TrustHtmlPipe
                    ],
                    exports: [
                        ToasterContainerComponent,
                        ToastComponent
                    ]
                },] }
    ];

    /*
     * Public API Surface of angular2-toaster
     */

    /**
     * Generated bundle index. Do not edit.
     */

    exports.DefaultIconClasses = DefaultIconClasses;
    exports.DefaultTypeClasses = DefaultTypeClasses;
    exports.ToasterConfig = ToasterConfig;
    exports.ToasterContainerComponent = ToasterContainerComponent;
    exports.ToasterModule = ToasterModule;
    exports.ToasterService = ToasterService;
    exports.ɵa = Transitions;
    exports.ɵb = ToastComponent;
    exports.ɵc = TrustHtmlPipe;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=angular2-toaster.umd.js.map
