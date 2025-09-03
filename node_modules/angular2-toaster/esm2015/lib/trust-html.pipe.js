import { Pipe } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
export class TrustHtmlPipe {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJ1c3QtaHRtbC5waXBlLmpzIiwic291cmNlUm9vdCI6Ii4uLy4uLy4uLy4uL3NyYy9hbmd1bGFyMi10b2FzdGVyL3NyYy8iLCJzb3VyY2VzIjpbImxpYi90cnVzdC1odG1sLnBpcGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLElBQUksRUFBaUIsTUFBTSxlQUFlLENBQUM7QUFDcEQsT0FBTyxFQUFFLFlBQVksRUFBWSxNQUFNLDJCQUEyQixDQUFDO0FBTW5FLE1BQU0sT0FBTyxhQUFhO0lBQ3RCLFlBQW9CLFNBQXVCO1FBQXZCLGNBQVMsR0FBVCxTQUFTLENBQWM7SUFDM0MsQ0FBQztJQUVELFNBQVMsQ0FBQyxPQUFZO1FBQ2xCLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyx1QkFBdUIsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUMzRCxDQUFDOzs7WUFWSixJQUFJLFNBQUM7Z0JBQ0YsSUFBSSxFQUFFLFdBQVc7Z0JBQ2pCLElBQUksRUFBRSxJQUFJO2FBQ2I7OztZQUxRLFlBQVkiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQaXBlLCBQaXBlVHJhbnNmb3JtIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBEb21TYW5pdGl6ZXIsIFNhZmVIdG1sIH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlcic7XG5cbkBQaXBlKHtcbiAgICBuYW1lOiAndHJ1c3RIdG1sJyxcbiAgICBwdXJlOiB0cnVlXG59KVxuZXhwb3J0IGNsYXNzIFRydXN0SHRtbFBpcGUgaW1wbGVtZW50cyBQaXBlVHJhbnNmb3JtIHtcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHNhbml0aXplcjogRG9tU2FuaXRpemVyKSB7XG4gICAgfVxuXG4gICAgdHJhbnNmb3JtKGNvbnRlbnQ6IGFueSk6IFNhZmVIdG1sIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2FuaXRpemVyLmJ5cGFzc1NlY3VyaXR5VHJ1c3RIdG1sKGNvbnRlbnQpO1xuICAgIH1cbn1cbiJdfQ==