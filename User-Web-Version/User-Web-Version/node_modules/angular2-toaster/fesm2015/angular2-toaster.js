import { Injectable, ɵɵdefineInjectable, Component, Input, EventEmitter, ComponentFactoryResolver, ChangeDetectorRef, NgZone, ElementRef, Renderer2, ViewChild, ViewContainerRef, Output, HostListener, Pipe, NgModule } from '@angular/core';
import { trigger, state, style, transition, animate, group } from '@angular/animations';
import { Observable, Subject } from 'rxjs';
import { share } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';

const Transitions = [
    trigger('toastState', [
        state('flyRight, flyLeft, slideDown, slideDown, slideUp, slideUp, fade', style({ opacity: 1, transform: 'translate(0,0)' })),
        transition('void => flyRight', [
            style({
                opacity: 0,
                transform: 'translateX(100%)',
                height: 0
            }),
            animate('0.15s ease-in', style({
                opacity: 1,
                height: '*'
            })),
            animate('0.25s 15ms ease-in')
        ]),
        transition('flyRight => void', [
            animate('0.25s ease-out', style({
                opacity: 0,
                transform: 'translateX(100%)'
            })),
            animate('0.15s ease-out', style({
                height: 0
            }))
        ]),
        transition('void => flyLeft', [
            style({
                opacity: 0,
                transform: 'translateX(-100%)',
                height: 0
            }),
            animate('0.15s ease-in', style({
                opacity: 1,
                height: '*'
            })),
            animate('0.25s 15ms ease-in')
        ]),
        transition('flyLeft => void', [
            animate('0.25s 10ms ease-out', style({
                opacity: 0,
                transform: 'translateX(-100%)'
            })),
            animate('0.15s ease-out', style({
                height: 0
            }))
        ]),
        transition('void => slideDown', [
            style({
                opacity: 0,
                transform: 'translateY(-500%)',
                height: 0
            }),
            group([
                animate('0.2s ease-in', style({
                    height: '*'
                })),
                animate('0.4s ease-in', style({
                    transform: 'translate(0,0)'
                })),
                animate('0.3s 0.1s ease-in', style({
                    opacity: 1
                }))
            ])
        ]),
        transition('slideDown => void', group([
            animate('0.3s ease-out', style({
                opacity: 0
            })),
            animate('0.4s ease-out', style({
                transform: 'translateY(-500%)'
            })),
            animate('0.2s 0.2s ease-out', style({
                height: 0
            }))
        ])),
        transition('void => slideUp', [
            style({
                opacity: 0,
                transform: 'translateY(1000%)',
                height: 0
            }),
            group([
                animate('0.2s ease-in', style({
                    height: '*'
                })),
                animate('0.5s ease-in', style({
                    transform: 'translate(0,0)'
                })),
                animate('0.3s 0.1s ease-in', style({
                    opacity: 1
                }))
            ])
        ]),
        transition('slideUp => void', group([
            animate('0.3s ease-out', style({
                opacity: 0
            })),
            animate('0.5s ease-out', style({
                transform: 'translateY(1000%)'
            })),
            animate('0.3s 0.15s ease-out', style({
                height: 0
            }))
        ])),
        transition('void => fade', [
            style({
                opacity: 0,
                height: 0
            }),
            animate('0.20s ease-in', style({
                height: '*'
            })),
            animate('0.15s ease-in', style({
                opacity: 1
            }))
        ]),
        transition('fade => void', [
            group([
                animate('0.0s ease-out', style({
                    // reposition the background to prevent
                    // a ghost image during transition
                    'background-position': '-99999px'
                })),
                animate('0.15s ease-out', style({
                    opacity: 0,
                    'background-image': ''
                })),
                animate('0.3s 20ms ease-out', style({
                    height: 0
                }))
            ])
        ])
    ]),
];

var BodyOutputType;
(function (BodyOutputType) {
    BodyOutputType[BodyOutputType["Default"] = 0] = "Default";
    BodyOutputType[BodyOutputType["TrustedHtml"] = 1] = "TrustedHtml";
    BodyOutputType[BodyOutputType["Component"] = 2] = "Component";
})(BodyOutputType || (BodyOutputType = {}));

const DefaultTypeClasses = {
    error: 'toast-error',
    info: 'toast-info',
    wait: 'toast-wait',
    success: 'toast-success',
    warning: 'toast-warning'
};
const DefaultIconClasses = {
    error: 'icon-error',
    info: 'icon-info',
    wait: 'icon-wait',
    success: 'icon-success',
    warning: 'icon-warning'
};
class ToasterConfig {
    constructor(configOverrides) {
        configOverrides = configOverrides || {};
        this.limit = configOverrides.limit || null;
        this.tapToDismiss = configOverrides.tapToDismiss != null ? configOverrides.tapToDismiss : true;
        this.showCloseButton = configOverrides.showCloseButton != null ? configOverrides.showCloseButton : false;
        this.closeHtml = configOverrides.closeHtml || '<span>&times;</span>';
        this.newestOnTop = configOverrides.newestOnTop != null ? configOverrides.newestOnTop : true;
        this.timeout = configOverrides.timeout != null ? configOverrides.timeout : 5000;
        this.typeClasses = configOverrides.typeClasses || DefaultTypeClasses;
        this.iconClasses = configOverrides.iconClasses || DefaultIconClasses;
        this.bodyOutputType = configOverrides.bodyOutputType || BodyOutputType.Default;
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
}
ToasterConfig.decorators = [
    { type: Injectable }
];
ToasterConfig.ctorParameters = () => [
    { type: undefined }
];

// http://stackoverflow.com/questions/26501688/a-typescript-guid-class
class Guid {
    static newGuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}
class ToasterService {
    /**
     * Creates an instance of ToasterService.
     */
    constructor() {
        this.addToast = new Observable((observer) => this._addToast = observer).pipe(share());
        this.clearToasts = new Observable((observer) => this._clearToasts = observer).pipe(share());
        this._removeToastSubject = new Subject();
        this.removeToast = this._removeToastSubject.pipe(share());
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
    pop(type, title, body) {
        const toast = typeof type === 'string' ? { type: type, title: title, body: body } : type;
        if (!toast.toastId) {
            toast.toastId = Guid.newGuid();
        }
        if (!this._addToast) {
            throw new Error('No Toaster Containers have been initialized to receive toasts.');
        }
        this._addToast.next(toast);
        return toast;
    }
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
    popAsync(type, title, body) {
        setTimeout(() => {
            this.pop(type, title, body);
        }, 0);
        return this.addToast;
    }
    /**
     * Clears a toast by toastId and/or toastContainerId.
     *
     * @param {string} toastId The toastId to clear.
     * @param {number=} toastContainerId
     *        The toastContainerId of the container to remove toasts from.
     */
    clear(toastId, toastContainerId) {
        const clearWrapper = {
            toastId: toastId, toastContainerId: toastContainerId
        };
        this._clearToasts.next(clearWrapper);
    }
}
ToasterService.ɵprov = ɵɵdefineInjectable({ factory: function ToasterService_Factory() { return new ToasterService(); }, token: ToasterService, providedIn: "root" });
ToasterService.decorators = [
    { type: Injectable, args: [{ providedIn: 'root' },] }
];
ToasterService.ctorParameters = () => [];

class ToasterContainerComponent {
    constructor(toasterService) {
        this.toasts = [];
        this.toasterService = toasterService;
    }
    ngOnInit() {
        this.registerSubscribers();
        if (this.isNullOrUndefined(this.toasterconfig)) {
            this.toasterconfig = new ToasterConfig();
        }
    }
    // event handlers
    click(toast, isCloseButton) {
        if (toast.onClickCallback) {
            toast.onClickCallback(toast);
        }
        const tapToDismiss = !this.isNullOrUndefined(toast.tapToDismiss)
            ? toast.tapToDismiss
            : this.toasterconfig.tapToDismiss;
        if (tapToDismiss || (toast.showCloseButton && isCloseButton)) {
            this.removeToast(toast);
        }
    }
    childClick($event) {
        this.click($event.value.toast, $event.value.isCloseButton);
    }
    removeToast(toast) {
        const index = this.toasts.indexOf(toast);
        if (index < 0) {
            return;
        }
        ;
        const toastId = this.toastIdOrDefault(toast);
        this.toasts.splice(index, 1);
        if (toast.onHideCallback) {
            toast.onHideCallback(toast);
        }
        this.toasterService._removeToastSubject.next({ toastId: toastId, toastContainerId: toast.toastContainerId });
    }
    // private functions
    registerSubscribers() {
        this.addToastSubscriber = this.toasterService.addToast.subscribe((toast) => {
            this.addToast(toast);
        });
        this.clearToastsSubscriber = this.toasterService.clearToasts.subscribe((clearWrapper) => {
            this.clearToasts(clearWrapper);
        });
    }
    addToast(toast) {
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
            if (toast.toastId && this.toasts.some(t => t.toastId === toast.toastId)) {
                return;
            }
            else if (this.toasts.some(t => t.body === toast.body)) {
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
    }
    isLimitExceeded() {
        return this.toasterconfig.limit && this.toasts.length > this.toasterconfig.limit;
    }
    removeAllToasts() {
        for (let i = this.toasts.length - 1; i >= 0; i--) {
            this.removeToast(this.toasts[i]);
        }
    }
    clearToasts(clearWrapper) {
        const toastId = clearWrapper.toastId;
        const toastContainerId = clearWrapper.toastContainerId;
        if (this.isNullOrUndefined(toastContainerId) || (toastContainerId === this.toasterconfig.toastContainerId)) {
            this.clearToastsAction(toastId);
        }
    }
    clearToastsAction(toastId) {
        if (toastId) {
            this.removeToast(this.toasts.filter(t => t.toastId === toastId)[0]);
        }
        else {
            this.removeAllToasts();
        }
    }
    toastIdOrDefault(toast) {
        return toast.toastId || '';
    }
    isNullOrUndefined(value) {
        return value === null || typeof value === 'undefined';
    }
    ngOnDestroy() {
        if (this.addToastSubscriber) {
            this.addToastSubscriber.unsubscribe();
        }
        if (this.clearToastsSubscriber) {
            this.clearToastsSubscriber.unsubscribe();
        }
    }
}
ToasterContainerComponent.decorators = [
    { type: Component, args: [{
                selector: 'toaster-container',
                template: `
        <div class="toast-container" [ngClass]="[toasterconfig.positionClass]">
            <div toastComp *ngFor="let toast of toasts" class="toast" [toast]="toast"
                [toasterconfig]="toasterconfig"
                [@toastState]="toasterconfig.animation"
                [titleClass]="toasterconfig.titleClass"
                [messageClass]="toasterconfig.messageClass"
                [ngClass]="[
                    toasterconfig.iconClasses[toast.type],
                    toasterconfig.typeClasses[toast.type]
                ]"
                (click)="click(toast)" (clickEvent)="childClick($event)"
                (removeToastEvent)="removeToast($event)"
            >
            </div>
        </div>
        `,
                animations: Transitions
            },] }
];
ToasterContainerComponent.ctorParameters = () => [
    { type: ToasterService }
];
ToasterContainerComponent.propDecorators = {
    toasterconfig: [{ type: Input }]
};

class ToastComponent {
    constructor(componentFactoryResolver, changeDetectorRef, ngZone, element, renderer2) {
        this.componentFactoryResolver = componentFactoryResolver;
        this.changeDetectorRef = changeDetectorRef;
        this.ngZone = ngZone;
        this.element = element;
        this.renderer2 = renderer2;
        this.progressBarWidth = -1;
        this.bodyOutputType = BodyOutputType;
        this.clickEvent = new EventEmitter();
        this.removeToastEvent = new EventEmitter();
        this.timeoutId = null;
        this.timeout = 0;
        this.progressBarIntervalId = null;
    }
    ngOnInit() {
        if (this.toast.progressBar) {
            this.toast.progressBarDirection = this.toast.progressBarDirection || 'decreasing';
        }
        let timeout = (typeof this.toast.timeout === 'number')
            ? this.toast.timeout : this.toasterconfig.timeout;
        if (typeof timeout === 'object') {
            timeout = timeout[this.toast.type];
        }
        ;
        this.timeout = timeout;
    }
    ngAfterViewInit() {
        if (this.toast.bodyOutputType === this.bodyOutputType.Component) {
            const component = this.componentFactoryResolver.resolveComponentFactory(this.toast.body);
            const componentInstance = this.componentBody.createComponent(component, undefined, this.componentBody.injector);
            componentInstance.instance.toast = this.toast;
            this.changeDetectorRef.detectChanges();
        }
        if (this.toasterconfig.mouseoverTimerStop) {
            // only apply a mouseenter event when necessary to avoid
            // unnecessary event and change detection cycles.
            this.removeMouseOverListener = this.renderer2.listen(this.element.nativeElement, 'mouseenter', () => this.stopTimer());
        }
        this.configureTimer();
    }
    click(event, toast) {
        event.stopPropagation();
        this.clickEvent.emit({ value: { toast: toast, isCloseButton: true } });
    }
    stopTimer() {
        this.progressBarWidth = 0;
        this.clearTimers();
    }
    restartTimer() {
        if (this.toasterconfig.mouseoverTimerStop) {
            if (!this.timeoutId) {
                this.configureTimer();
            }
        }
        else if (this.timeout && !this.timeoutId) {
            this.removeToast();
        }
    }
    ngOnDestroy() {
        if (this.removeMouseOverListener) {
            this.removeMouseOverListener();
        }
        this.clearTimers();
    }
    configureTimer() {
        if (!this.timeout || this.timeout < 1) {
            return;
        }
        if (this.toast.progressBar) {
            this.removeToastTick = new Date().getTime() + this.timeout;
            this.progressBarWidth = -1;
        }
        this.ngZone.runOutsideAngular(() => {
            this.timeoutId = window.setTimeout(() => {
                this.ngZone.run(() => {
                    this.changeDetectorRef.markForCheck();
                    this.removeToast();
                });
            }, this.timeout);
            if (this.toast.progressBar) {
                this.progressBarIntervalId = window.setInterval(() => {
                    this.ngZone.run(() => {
                        this.updateProgressBar();
                    });
                }, 10);
            }
        });
    }
    updateProgressBar() {
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
    }
    clearTimers() {
        if (this.timeoutId) {
            window.clearTimeout(this.timeoutId);
        }
        if (this.progressBarIntervalId) {
            window.clearInterval(this.progressBarIntervalId);
        }
        this.timeoutId = null;
        this.progressBarIntervalId = null;
    }
    removeToast() {
        this.removeToastEvent.emit(this.toast);
    }
}
ToastComponent.decorators = [
    { type: Component, args: [{
                selector: '[toastComp]',
                template: `
        <div class="toast-content">
            <div [ngClass]="titleClass">{{toast.title}}</div>
            <div [ngClass]="messageClass" [ngSwitch]="toast.bodyOutputType">
                <div *ngSwitchCase="bodyOutputType.Component" #componentBody></div>
                <div *ngSwitchCase="bodyOutputType.TrustedHtml" [innerHTML]="toast.body | trustHtml"></div>
                <div *ngSwitchCase="bodyOutputType.Default">{{toast.body}}</div>
            </div>
        </div>
        <button class="toast-close-button" *ngIf="toast.showCloseButton" (click)="click($event, toast)"
            [innerHTML]="toast.closeHtml | trustHtml">
        </button>
        <div *ngIf="toast.progressBar">
            <div class="toast-progress-bar" [style.width]="progressBarWidth + '%'"></div>
        </div>`
            },] }
];
ToastComponent.ctorParameters = () => [
    { type: ComponentFactoryResolver },
    { type: ChangeDetectorRef },
    { type: NgZone },
    { type: ElementRef },
    { type: Renderer2 }
];
ToastComponent.propDecorators = {
    toasterconfig: [{ type: Input }],
    toast: [{ type: Input }],
    titleClass: [{ type: Input }],
    messageClass: [{ type: Input }],
    componentBody: [{ type: ViewChild, args: ['componentBody', { read: ViewContainerRef, static: false },] }],
    clickEvent: [{ type: Output }],
    removeToastEvent: [{ type: Output }],
    restartTimer: [{ type: HostListener, args: ['mouseleave',] }]
};

class TrustHtmlPipe {
    constructor(sanitizer) {
        this.sanitizer = sanitizer;
    }
    transform(content) {
        return this.sanitizer.bypassSecurityTrustHtml(content);
    }
}
TrustHtmlPipe.decorators = [
    { type: Pipe, args: [{
                name: 'trustHtml',
                pure: true
            },] }
];
TrustHtmlPipe.ctorParameters = () => [
    { type: DomSanitizer }
];

class ToasterModule {
    static forRoot() {
        return {
            ngModule: ToasterModule,
            providers: [ToasterService, ToasterContainerComponent]
        };
    }
    static forChild() {
        return {
            ngModule: ToasterModule,
            providers: [ToasterContainerComponent]
        };
    }
}
ToasterModule.decorators = [
    { type: NgModule, args: [{
                imports: [CommonModule],
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

export { BodyOutputType, DefaultIconClasses, DefaultTypeClasses, ToasterConfig, ToasterContainerComponent, ToasterModule, ToasterService, Transitions as ɵa, ToastComponent as ɵb, TrustHtmlPipe as ɵc };
//# sourceMappingURL=angular2-toaster.js.map
