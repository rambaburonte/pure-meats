import { BodyOutputType } from './bodyOutputType';
import { ToastType } from './toast';
export declare const DefaultTypeClasses: {
    [key in ToastType]?: string;
};
export declare const DefaultIconClasses: {
    [key in ToastType]?: string;
};
export interface IToasterConfig {
    limit?: number | null;
    tapToDismiss?: boolean;
    showCloseButton?: boolean | {
        [key in ToastType]?: boolean;
    };
    closeHtml?: string;
    newestOnTop?: boolean;
    timeout?: number | {
        [key in ToastType]?: number;
    };
    typeClasses?: {
        [key in ToastType]?: string;
    };
    iconClasses?: {
        [key in ToastType]?: string;
    };
    bodyOutputType?: BodyOutputType;
    bodyTemplate?: string;
    defaultToastType?: ToastType;
    positionClass?: string;
    titleClass?: string;
    messageClass?: string;
    animation?: string;
    preventDuplicates?: boolean;
    mouseoverTimerStop?: boolean;
    toastContainerId?: number | null;
}
export declare class ToasterConfig implements IToasterConfig {
    limit?: number | null;
    tapToDismiss: boolean;
    showCloseButton: boolean | {
        [key in ToastType]?: boolean;
    };
    closeHtml: string;
    newestOnTop: boolean;
    timeout: number | {
        [key in ToastType]?: number;
    };
    typeClasses: {
        [key in ToastType]?: string;
    };
    iconClasses: {
        [key in ToastType]?: string;
    };
    bodyOutputType: BodyOutputType;
    bodyTemplate: string;
    defaultToastType: ToastType;
    positionClass: string;
    titleClass: string;
    messageClass: string;
    animation: string;
    preventDuplicates: boolean;
    mouseoverTimerStop: boolean;
    toastContainerId?: number | null;
    constructor(configOverrides?: IToasterConfig);
}
