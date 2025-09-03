import { Component, Input, Output, ViewChild, ViewContainerRef, EventEmitter, ComponentFactoryResolver, ChangeDetectorRef, HostListener, NgZone, ElementRef, Renderer2 } from '@angular/core';
import { BodyOutputType } from './bodyOutputType';
export class ToastComponent {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9hc3QuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Ii4uLy4uLy4uLy4uL3NyYy9hbmd1bGFyMi10b2FzdGVyL3NyYy8iLCJzb3VyY2VzIjpbImxpYi90b2FzdC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNILFNBQVMsRUFDVCxLQUFLLEVBQ0wsTUFBTSxFQUNOLFNBQVMsRUFDVCxnQkFBZ0IsRUFDaEIsWUFBWSxFQUNaLHdCQUF3QixFQUN4QixpQkFBaUIsRUFJakIsWUFBWSxFQUNaLE1BQU0sRUFDTixVQUFVLEVBQ1YsU0FBUyxFQUNaLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQXFCbEQsTUFBTSxPQUFPLGNBQWM7SUFzQnZCLFlBQ1Usd0JBQWtELEVBQ2xELGlCQUFvQyxFQUNwQyxNQUFjLEVBQ2QsT0FBbUIsRUFDbkIsU0FBb0I7UUFKcEIsNkJBQXdCLEdBQXhCLHdCQUF3QixDQUEwQjtRQUNsRCxzQkFBaUIsR0FBakIsaUJBQWlCLENBQW1CO1FBQ3BDLFdBQU0sR0FBTixNQUFNLENBQVE7UUFDZCxZQUFPLEdBQVAsT0FBTyxDQUFZO1FBQ25CLGNBQVMsR0FBVCxTQUFTLENBQVc7UUFwQnZCLHFCQUFnQixHQUFXLENBQUMsQ0FBQyxDQUFDO1FBQzlCLG1CQUFjLEdBQUcsY0FBYyxDQUFDO1FBR2hDLGVBQVUsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBRWhDLHFCQUFnQixHQUFHLElBQUksWUFBWSxFQUFTLENBQUM7UUFFNUMsY0FBUyxHQUFZLElBQUksQ0FBQztRQUMxQixZQUFPLEdBQVcsQ0FBQyxDQUFDO1FBQ3BCLDBCQUFxQixHQUFZLElBQUksQ0FBQztJQVczQyxDQUFDO0lBRUosUUFBUTtRQUNKLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLEVBQUU7WUFDeEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxvQkFBb0IsR0FBRyxJ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QUU7eUJBS3BFLE1BQU07K0JBRU4sTUFBTTsyQkFnRU4sWUFBWSxTQUFDLFlBQVkiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICAgIENvbXBvbmVudCwgXG4gICAgSW5wdXQsIFxuICAgIE91dHB1dCwgXG4gICAgVmlld0NoaWxkLCBcbiAgICBWaWV3Q29udGFpbmVyUmVmLCBcbiAgICBFdmVudEVtaXR0ZXIsXG4gICAgQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLCBcbiAgICBDaGFuZ2VEZXRlY3RvclJlZiwgXG4gICAgT25Jbml0LCBcbiAgICBBZnRlclZpZXdJbml0LCBcbiAgICBPbkRlc3Ryb3ksXG4gICAgSG9zdExpc3RlbmVyLFxuICAgIE5nWm9uZSwgXG4gICAgRWxlbWVudFJlZixcbiAgICBSZW5kZXJlcjJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBUb2FzdCB9IGZyb20gJy4vdG9hc3QnO1xuaW1wb3J0IHsgQm9keU91dHB1dFR5cGUgfSBmcm9tICcuL2JvZHlPdXRwdXRUeXBlJztcbmltcG9ydCB7IFRvYXN0ZXJDb25maWcgfSBmcm9tICcuL3RvYXN0ZXItY29uZmlnJztcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdbdG9hc3RDb21wXScsXG4gICAgdGVtcGxhdGU6IGBcbiAgICAgICAgPGRpdiBjbGFzcz1cInRvYXN0LWNvbnRlbnRcIj5cbiAgICAgICAgICAgIDxkaXYgW25nQ2xhc3NdPVwidGl0bGVDbGFzc1wiPnt7dG9hc3QudGl0bGV9fTwvZGl2PlxuICAgICAgICAgICAgPGRpdiBbbmdDbGFzc109XCJtZXNzYWdlQ2xhc3NcIiBbbmdTd2l0Y2hdPVwidG9hc3QuYm9keU91dHB1dFR5cGVcIj5cbiAgICAgICAgICAgICAgICA8ZGl2ICpuZ1N3aXRjaENhc2U9XCJib2R5T3V0cHV0VHlwZS5Db21wb25lbnRcIiAjY29tcG9uZW50Qm9keT48L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2ICpuZ1N3aXRjaENhc2U9XCJib2R5T3V0cHV0VHlwZS5UcnVzdGVkSHRtbFwiIFtpbm5lckhUTUxdPVwidG9hc3QuYm9keSB8IHRydXN0SHRtbFwiPjwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgKm5nU3dpdGNoQ2FzZT1cImJvZHlPdXRwdXRUeXBlLkRlZmF1bHRcIj57e3RvYXN0LmJvZHl9fTwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8YnV0dG9uIGNsYXNzPVwidG9hc3QtY2xvc2UtYnV0dG9uXCIgKm5nSWY9XCJ0b2FzdC5zaG93Q2xvc2VCdXR0b25cIiAoY2xpY2spPVwiY2xpY2soJGV2ZW50LCB0b2FzdClcIlxuICAgICAgICAgICAgW2lubmVySFRNTF09XCJ0b2FzdC5jbG9zZUh0bWwgfCB0cnVzdEh0bWxcIj5cbiAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDxkaXYgKm5nSWY9XCJ0b2FzdC5wcm9ncmVzc0JhclwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRvYXN0LXByb2dyZXNzLWJhclwiIFtzdHlsZS53aWR0aF09XCJwcm9ncmVzc0JhcldpZHRoICsgJyUnXCI+PC9kaXY+XG4gICAgICAgIDwvZGl2PmBcbn0pXG5leHBvcnQgY2xhc3MgVG9hc3RDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSB7XG4gICAgQElucHV0KCkgdG9hc3RlcmNvbmZpZzogVG9hc3RlckNvbmZpZztcbiAgICBASW5wdXQoKSB0b2FzdDogVG9hc3Q7XG4gICAgQElucHV0KCkgdGl0bGVDbGFzczogc3RyaW5nO1xuICAgIEBJbnB1dCgpIG1lc3NhZ2VDbGFzczogc3RyaW5nO1xuICAgIEBWaWV3Q2hpbGQoJ2NvbXBvbmVudEJvZHknLCB7IHJlYWQ6IFZpZXdDb250YWluZXJSZWYsIHN0YXRpYzogZmFsc2UgfSkgY29tcG9uZW50Qm9keTogVmlld0NvbnRhaW5lclJlZjtcblxuICAgIHB1YmxpYyBwcm9ncmVzc0JhcldpZHRoOiBudW1iZXIgPSAtMTtcbiAgICBwdWJsaWMgYm9keU91dHB1dFR5cGUgPSBCb2R5T3V0cHV0VHlwZTtcblxuICAgIEBPdXRwdXQoKVxuICAgIHB1YmxpYyBjbGlja0V2ZW50ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICAgIEBPdXRwdXQoKVxuICAgIHB1YmxpYyByZW1vdmVUb2FzdEV2ZW50ID0gbmV3IEV2ZW50RW1pdHRlcjxUb2FzdD4oKTtcblxuICAgIHByaXZhdGUgdGltZW91dElkPzogbnVtYmVyID0gbnVsbDtcbiAgICBwcml2YXRlIHRpbWVvdXQ6IG51bWJlciA9IDA7XG4gICAgcHJpdmF0ZSBwcm9ncmVzc0JhckludGVydmFsSWQ/OiBudW1iZXIgPSBudWxsO1xuICAgIHByaXZhdGUgcmVtb3ZlVG9hc3RUaWNrOiBudW1iZXI7XG5cbiAgICBwcml2YXRlIHJlbW92ZU1vdXNlT3Zlckxpc3RlbmVyOiAoKSA9PiB2b2lkO1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICBwcml2YXRlIGNvbXBvbmVudEZhY3RvcnlSZXNvbHZlcjogQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLFxuICAgICAgcHJpdmF0ZSBjaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgICBwcml2YXRlIG5nWm9uZTogTmdab25lLFxuICAgICAgcHJpdmF0ZSBlbGVtZW50OiBFbGVtZW50UmVmLFxuICAgICAgcHJpdmF0ZSByZW5kZXJlcjI6IFJlbmRlcmVyMlxuICAgICkge31cblxuICAgIG5nT25Jbml0KCkge1xuICAgICAgICBpZiAodGhpcy50b2FzdC5wcm9ncmVzc0Jhcikge1xuICAgICAgICAgICAgdGhpcy50b2FzdC5wcm9ncmVzc0JhckRpcmVjdGlvbiA9IHRoaXMudG9hc3QucHJvZ3Jlc3NCYXJEaXJlY3Rpb24gfHwgJ2RlY3JlYXNpbmcnO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHRpbWVvdXQgPSAodHlwZW9mIHRoaXMudG9hc3QudGltZW91dCA9PT0gJ251bWJlcicpXG4gICAgICAgICAgICA/IHRoaXMudG9hc3QudGltZW91dCA6IHRoaXMudG9hc3RlcmNvbmZpZy50aW1lb3V0O1xuXG4gICAgICAgIGlmICh0eXBlb2YgdGltZW91dCA9PT0gJ29iamVjdCcpIHsgXG4gICAgICAgICAgICB0aW1lb3V0ID0gdGltZW91dFt0aGlzLnRvYXN0LnR5cGVdOyBcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLnRpbWVvdXQgPSB0aW1lb3V0O1xuICAgIH1cblxuICAgIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICAgICAgaWYgKHRoaXMudG9hc3QuYm9keU91dHB1dFR5cGUgPT09IHRoaXMuYm9keU91dHB1dFR5cGUuQ29tcG9uZW50KSB7XG4gICAgICAgICAgICBjb25zdCBjb21wb25lbnQgPSB0aGlzLmNvbXBvbmVudEZhY3RvcnlSZXNvbHZlci5yZXNvbHZlQ29tcG9uZW50RmFjdG9yeSh0aGlzLnRvYXN0LmJvZHkpO1xuICAgICAgICAgICAgY29uc3QgY29tcG9uZW50SW5zdGFuY2U6IGFueSA9IHRoaXMuY29tcG9uZW50Qm9keS5jcmVhdGVDb21wb25lbnQoY29tcG9uZW50LCB1bmRlZmluZWQsIHRoaXMuY29tcG9uZW50Qm9keS5pbmplY3Rvcik7XG4gICAgICAgICAgICBjb21wb25lbnRJbnN0YW5jZS5pbnN0YW5jZS50b2FzdCA9IHRoaXMudG9hc3Q7XG4gICAgICAgICAgICB0aGlzLmNoYW5nZURldGVjdG9yUmVmLmRldGVjdENoYW5nZXMoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLnRvYXN0ZXJjb25maWcubW91c2VvdmVyVGltZXJTdG9wKSB7XG4gICAgICAgICAgICAvLyBvbmx5IGFwcGx5IGEgbW91c2VlbnRlciBldmVudCB3aGVuIG5lY2Vzc2FyeSB0byBhdm9pZFxuICAgICAgICAgICAgLy8gdW5uZWNlc3NhcnkgZXZlbnQgYW5kIGNoYW5nZSBkZXRlY3Rpb24gY3ljbGVzLlxuICAgICAgICAgICAgdGhpcy5yZW1vdmVNb3VzZU92ZXJMaXN0ZW5lciA9IHRoaXMucmVuZGVyZXIyLmxpc3RlbihcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudCwgXG4gICAgICAgICAgICAgICAgJ21vdXNlZW50ZXInLCBcbiAgICAgICAgICAgICAgICAoKSA9PiB0aGlzLnN0b3BUaW1lcigpXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jb25maWd1cmVUaW1lcigpO1xuICAgIH1cblxuICAgIGNsaWNrKGV2ZW50OiBNb3VzZUV2ZW50LCB0b2FzdDogVG9hc3QpIHtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIHRoaXMuY2xpY2tFdmVudC5lbWl0KHsgdmFsdWUgOiB7IHRvYXN0OiB0b2FzdCwgaXNDbG9zZUJ1dHRvbjogdHJ1ZSB9IH0pO1xuICAgIH1cblxuICAgIHN0b3BUaW1lcigpIHtcbiAgICAgICAgdGhpcy5wcm9ncmVzc0JhcldpZHRoID0gMDtcbiAgICAgICAgdGhpcy5jbGVhclRpbWVycygpO1xuICAgIH1cblxuICAgIEBIb3N0TGlzdGVuZXIoJ21vdXNlbGVhdmUnKSBcbiAgICByZXN0YXJ0VGltZXIoKSB7XG4gICAgICAgIGlmICh0aGlzLnRvYXN0ZXJjb25maWcubW91c2VvdmVyVGltZXJTdG9wKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMudGltZW91dElkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb25maWd1cmVUaW1lcigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMudGltZW91dCAmJiAhdGhpcy50aW1lb3V0SWQpIHtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlVG9hc3QoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG5nT25EZXN0cm95KCkge1xuICAgICAgICBpZiAodGhpcy5yZW1vdmVNb3VzZU92ZXJMaXN0ZW5lcikge1xuICAgICAgICAgICAgdGhpcy5yZW1vdmVNb3VzZU92ZXJMaXN0ZW5lcigpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY2xlYXJUaW1lcnMoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNvbmZpZ3VyZVRpbWVyKCkge1xuICAgICAgICBpZiAoIXRoaXMudGltZW91dCB8fCB0aGlzLnRpbWVvdXQgPCAxKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy50b2FzdC5wcm9ncmVzc0Jhcikge1xuICAgICAgICAgICAgdGhpcy5yZW1vdmVUb2FzdFRpY2sgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKSArIHRoaXMudGltZW91dDtcbiAgICAgICAgICAgIHRoaXMucHJvZ3Jlc3NCYXJXaWR0aCA9IC0xO1xuICAgICAgICB9IFxuICAgICAgICBcbiAgICAgICAgdGhpcy5uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy50aW1lb3V0SWQgPSB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5uZ1pvbmUucnVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVUb2FzdCgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSwgdGhpcy50aW1lb3V0KTtcblxuICAgICAgICAgICAgaWYgKHRoaXMudG9hc3QucHJvZ3Jlc3NCYXIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnByb2dyZXNzQmFySW50ZXJ2YWxJZCA9IHdpbmRvdy5zZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmdab25lLnJ1bigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVByb2dyZXNzQmFyKCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sIDEwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB1cGRhdGVQcm9ncmVzc0JhcigpIHtcbiAgICAgICAgaWYgKHRoaXMucHJvZ3Jlc3NCYXJXaWR0aCA9PT0gMCB8fCB0aGlzLnByb2dyZXNzQmFyV2lkdGggPT09IDEwMCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucHJvZ3Jlc3NCYXJXaWR0aCA9ICgodGhpcy5yZW1vdmVUb2FzdFRpY2sgLSBuZXcgRGF0ZSgpLmdldFRpbWUoKSkgLyB0aGlzLnRpbWVvdXQpICogMTAwO1xuICAgICAgICBcbiAgICAgICAgaWYgKHRoaXMudG9hc3QucHJvZ3Jlc3NCYXJEaXJlY3Rpb24gPT09ICdpbmNyZWFzaW5nJykge1xuICAgICAgICAgIHRoaXMucHJvZ3Jlc3NCYXJXaWR0aCA9IDEwMCAtIHRoaXMucHJvZ3Jlc3NCYXJXaWR0aDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5wcm9ncmVzc0JhcldpZHRoIDwgMCkge1xuICAgICAgICAgIHRoaXMucHJvZ3Jlc3NCYXJXaWR0aCA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMucHJvZ3Jlc3NCYXJXaWR0aCA+IDEwMCkge1xuICAgICAgICAgIHRoaXMucHJvZ3Jlc3NCYXJXaWR0aCA9IDEwMDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgY2xlYXJUaW1lcnMoKSB7XG4gICAgICAgIGlmICh0aGlzLnRpbWVvdXRJZCkge1xuICAgICAgICAgICAgd2luZG93LmNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXRJZClcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLnByb2dyZXNzQmFySW50ZXJ2YWxJZCkge1xuICAgICAgICAgICAgd2luZG93LmNsZWFySW50ZXJ2YWwodGhpcy5wcm9ncmVzc0JhckludGVydmFsSWQpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy50aW1lb3V0SWQgPSBudWxsO1xuICAgICAgICB0aGlzLnByb2dyZXNzQmFySW50ZXJ2YWxJZCA9IG51bGw7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZW1vdmVUb2FzdCgpIHtcbiAgICAgICAgdGhpcy5yZW1vdmVUb2FzdEV2ZW50LmVtaXQodGhpcy50b2FzdCk7XG4gICAgfVxufVxuIl19