import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastComponent } from './toast.component';
import { ToasterContainerComponent } from './toaster-container.component';
import { ToasterService } from './toaster.service';
import { TrustHtmlPipe } from './trust-html.pipe';
export class ToasterModule {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9hc3Rlci5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiLi4vLi4vLi4vLi4vc3JjL2FuZ3VsYXIyLXRvYXN0ZXIvc3JjLyIsInNvdXJjZXMiOlsibGliL3RvYXN0ZXIubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQXVCLE1BQU0sZUFBZSxDQUFDO0FBQzlELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDbkQsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFDMUUsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQ25ELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQWNsRCxNQUFNLE9BQU8sYUFBYTtJQUN0QixNQUFNLENBQUMsT0FBTztRQUNWLE9BQU87WUFDSCxRQUFRLEVBQUUsYUFBYTtZQUN2QixTQUFTLEVBQUUsQ0FBQyxjQUFjLEVBQUUseUJBQXlCLENBQUM7U0FDekQsQ0FBQTtJQUNMLENBQUM7SUFFRCxNQUFNLENBQUMsUUFBUTtRQUNYLE9BQU87WUFDSCxRQUFRLEVBQUUsYUFBYTtZQUN2QixTQUFTLEVBQUUsQ0FBQyx5QkFBeUIsQ0FBQztTQUN6QyxDQUFBO0lBQ0wsQ0FBQzs7O1lBekJKLFFBQVEsU0FBQztnQkFDTixPQUFPLEVBQUUsQ0FBQyxZQUFZLENBQUM7Z0JBQ3ZCLFlBQVksRUFBRTtvQkFDVixjQUFjO29CQUNkLHlCQUF5QjtvQkFDekIsYUFBYTtpQkFDaEI7Z0JBQ0QsT0FBTyxFQUFFO29CQUNMLHlCQUF5QjtvQkFDekIsY0FBYztpQkFDakI7YUFDSiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlLCBNb2R1bGVXaXRoUHJvdmlkZXJzIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgVG9hc3RDb21wb25lbnQgfSBmcm9tICcuL3RvYXN0LmNvbXBvbmVudCc7XG5pbXBvcnQgeyBUb2FzdGVyQ29udGFpbmVyQ29tcG9uZW50IH0gZnJvbSAnLi90b2FzdGVyLWNvbnRhaW5lci5jb21wb25lbnQnO1xuaW1wb3J0IHsgVG9hc3RlclNlcnZpY2UgfSBmcm9tICcuL3RvYXN0ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBUcnVzdEh0bWxQaXBlIH0gZnJvbSAnLi90cnVzdC1odG1sLnBpcGUnO1xuXG5ATmdNb2R1bGUoe1xuICAgIGltcG9ydHM6IFtDb21tb25Nb2R1bGVdLFxuICAgIGRlY2xhcmF0aW9uczogW1xuICAgICAgICBUb2FzdENvbXBvbmVudCxcbiAgICAgICAgVG9hc3RlckNvbnRhaW5lckNvbXBvbmVudCxcbiAgICAgICAgVHJ1c3RIdG1sUGlwZVxuICAgIF0sXG4gICAgZXhwb3J0czogW1xuICAgICAgICBUb2FzdGVyQ29udGFpbmVyQ29tcG9uZW50LFxuICAgICAgICBUb2FzdENvbXBvbmVudFxuICAgIF1cbn0pXG5leHBvcnQgY2xhc3MgVG9hc3Rlck1vZHVsZSB7XG4gICAgc3RhdGljIGZvclJvb3QoKTogTW9kdWxlV2l0aFByb3ZpZGVyczxUb2FzdGVyTW9kdWxlPiB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBuZ01vZHVsZTogVG9hc3Rlck1vZHVsZSxcbiAgICAgICAgICAgIHByb3ZpZGVyczogW1RvYXN0ZXJTZXJ2aWNlLCBUb2FzdGVyQ29udGFpbmVyQ29tcG9uZW50XVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgc3RhdGljIGZvckNoaWxkKCk6IE1vZHVsZVdpdGhQcm92aWRlcnM8VG9hc3Rlck1vZHVsZT4ge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbmdNb2R1bGU6IFRvYXN0ZXJNb2R1bGUsXG4gICAgICAgICAgICBwcm92aWRlcnM6IFtUb2FzdGVyQ29udGFpbmVyQ29tcG9uZW50XVxuICAgICAgICB9XG4gICAgfVxuIH1cbiJdfQ==