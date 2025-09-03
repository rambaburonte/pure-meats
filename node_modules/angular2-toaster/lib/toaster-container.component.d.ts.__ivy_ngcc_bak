import { OnInit, OnDestroy } from '@angular/core';
import { ToasterConfig } from './toaster-config';
import { ToasterService } from './toaster.service';
import { Toast } from './toast';
export declare class ToasterContainerComponent implements OnInit, OnDestroy {
    private addToastSubscriber;
    private clearToastsSubscriber;
    private toasterService;
    toasterconfig: ToasterConfig;
    toasts: Toast[];
    constructor(toasterService: ToasterService);
    ngOnInit(): void;
    click(toast: Toast, isCloseButton?: boolean): void;
    childClick($event: any): void;
    removeToast(toast: Toast): void;
    private registerSubscribers;
    private addToast;
    private isLimitExceeded;
    private removeAllToasts;
    private clearToasts;
    private clearToastsAction;
    private toastIdOrDefault;
    private isNullOrUndefined;
    ngOnDestroy(): void;
}
