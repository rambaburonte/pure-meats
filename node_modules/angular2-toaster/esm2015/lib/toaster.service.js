import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { share } from 'rxjs/operators';
import * as i0 from "@angular/core";
// http://stackoverflow.com/questions/26501688/a-typescript-guid-class
class Guid {
    static newGuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}
export class ToasterService {
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
ToasterService.ɵprov = i0.ɵɵdefineInjectable({ factory: function ToasterService_Factory() { return new ToasterService(); }, token: ToasterService, providedIn: "root" });
ToasterService.decorators = [
    { type: Injectable, args: [{ providedIn: 'root' },] }
];
ToasterService.ctorParameters = () => [];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9hc3Rlci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Ii4uLy4uLy4uLy4uL3NyYy9hbmd1bGFyMi10b2FzdGVyL3NyYy8iLCJzb3VyY2VzIjpbImxpYi90b2FzdGVyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUczQyxPQUFPLEVBQUUsVUFBVSxFQUFFLE9BQU8sRUFBWSxNQUFNLE1BQU0sQ0FBQztBQUNyRCxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sZ0JBQWdCLENBQUE7O0FBRXRDLHNFQUFzRTtBQUN0RSxNQUFNLElBQUk7SUFDTixNQUFNLENBQUMsT0FBTztRQUNWLE9BQU8sc0NBQXNDLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxVQUFTLENBQUM7WUFDckUsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBRSxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBRSxDQUFDO1lBQ3hFLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUMxQixDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7Q0FDSjtBQUdELE1BQU0sT0FBTyxjQUFjO0lBV3ZCOztPQUVHO0lBQ0g7UUFDSSxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksVUFBVSxDQUFRLENBQUMsUUFBYSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBQ2xHLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxVQUFVLENBQWdCLENBQUMsUUFBYSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsWUFBWSxHQUFHLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBQ2hILElBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLE9BQU8sRUFBaUIsQ0FBQTtRQUN2RCxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztJQUM5RCxDQUFDO0lBRUQ7Ozs7Ozs7O09BUUc7SUFDSCxHQUFHLENBQUMsSUFBdUIsRUFBRSxLQUFjLEVBQUUsSUFBYTtRQUN0RCxNQUFNLEtBQUssR0FBRyxPQUFPLElBQUksS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO1FBRXpGLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFO1lBQ2hCLEtBQUssQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1NBQ2xDO1FBRUQsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDakIsTUFBTSxJQUFJLEtBQUssQ0FBQyxnRUFBZ0UsQ0FBQyxDQUFDO1NBQ3JGO1FBRUQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDM0IsT0FBTyxLQUFLLENBQUM7SUFDakIsQ0FBQztJQUVEOzs7Ozs7Ozs7T0FTRztJQUNILFFBQVEsQ0FBQyxJQUF1QixFQUFFLEtBQWMsRUFBRSxJQUFhO1FBQzNELFVBQVUsQ0FBQyxHQUFHLEVBQUU7WUFDWixJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDaEMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBRU4sT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ3pCLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSCxLQUFLLENBQUMsT0FBZ0IsRUFBRSxnQkFBeUI7UUFDN0MsTUFBTSxZQUFZLEdBQWtCO1lBQ2hDLE9BQU8sRUFBRSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsZ0JBQWdCO1NBQ3ZELENBQUM7UUFFRixJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQTtJQUN4QyxDQUFDOzs7O1lBN0VKLFVBQVUsU0FBQyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBUb2FzdCwgVG9hc3RUeXBlIH0gZnJvbSAnLi90b2FzdCc7XG5pbXBvcnQgeyBJQ2xlYXJXcmFwcGVyIH0gZnJvbSAnLi9jbGVhcldyYXBwZXInO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgU3ViamVjdCwgT2JzZXJ2ZXIgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IHNoYXJlIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnXG5cbi8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMjY1MDE2ODgvYS10eXBlc2NyaXB0LWd1aWQtY2xhc3NcbmNsYXNzIEd1aWQge1xuICAgIHN0YXRpYyBuZXdHdWlkKCkge1xuICAgICAgICByZXR1cm4gJ3h4eHh4eHh4LXh4eHgtNHh4eC15eHh4LXh4eHh4eHh4eHh4eCcucmVwbGFjZSgvW3h5XS9nLCBmdW5jdGlvbihjKSB7XG4gICAgICAgICAgICBjb25zdCByID0gTWF0aC5yYW5kb20oKSAqIDE2IHwgMCwgdiA9IGMgPT09ICd4JyA/IHIgOiAoIHIgJiAweDMgfCAweDggKTtcbiAgICAgICAgICAgIHJldHVybiB2LnRvU3RyaW5nKDE2KTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG5ASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW46ICdyb290JyB9KVxuZXhwb3J0IGNsYXNzIFRvYXN0ZXJTZXJ2aWNlIHtcbiAgICBhZGRUb2FzdDogT2JzZXJ2YWJsZTxUb2FzdD47XG4gICAgcHJpdmF0ZSBfYWRkVG9hc3Q6IE9ic2VydmVyPFRvYXN0PjtcblxuICAgIGNsZWFyVG9hc3RzOiBPYnNlcnZhYmxlPElDbGVhcldyYXBwZXI+O1xuICAgIHByaXZhdGUgX2NsZWFyVG9hc3RzOiBPYnNlcnZlcjxJQ2xlYXJXcmFwcGVyPjtcblxuICAgIHJlbW92ZVRvYXN0OiBPYnNlcnZhYmxlPElDbGVhcldyYXBwZXI+O1xuICAgIC8qKiBAaW50ZXJuYWwgKi9cbiAgICBfcmVtb3ZlVG9hc3RTdWJqZWN0OiBTdWJqZWN0PElDbGVhcldyYXBwZXI+O1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhbiBpbnN0YW5jZSBvZiBUb2FzdGVyU2VydmljZS5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5hZGRUb2FzdCA9IG5ldyBPYnNlcnZhYmxlPFRvYXN0Pigob2JzZXJ2ZXI6IGFueSkgPT4gdGhpcy5fYWRkVG9hc3QgPSBvYnNlcnZlcikucGlwZShzaGFyZSgpKTtcbiAgICAgICAgdGhpcy5jbGVhclRvYXN0cyA9IG5ldyBPYnNlcnZhYmxlPElDbGVhcldyYXBwZXI+KChvYnNlcnZlcjogYW55KSA9PiB0aGlzLl9jbGVhclRvYXN0cyA9IG9ic2VydmVyKS5waXBlKHNoYXJlKCkpO1xuICAgICAgICB0aGlzLl9yZW1vdmVUb2FzdFN1YmplY3QgPSBuZXcgU3ViamVjdDxJQ2xlYXJXcmFwcGVyPigpXG4gICAgICAgIHRoaXMucmVtb3ZlVG9hc3QgPSB0aGlzLl9yZW1vdmVUb2FzdFN1YmplY3QucGlwZShzaGFyZSgpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTeW5jaHJvbm91c2x5IGNyZWF0ZSBhbmQgc2hvdyBhIG5ldyB0b2FzdCBpbnN0YW5jZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7KHN0cmluZyB8IFRvYXN0KX0gdHlwZSBUaGUgdHlwZSBvZiB0aGUgdG9hc3QsIG9yIGEgVG9hc3Qgb2JqZWN0LlxuICAgICAqIEBwYXJhbSB7c3RyaW5nPX0gdGl0bGUgVGhlIHRvYXN0IHRpdGxlLlxuICAgICAqIEBwYXJhbSB7c3RyaW5nPX0gYm9keSBUaGUgdG9hc3QgYm9keS5cbiAgICAgKiBAcmV0dXJucyB7VG9hc3R9XG4gICAgICogICAgICAgICAgVGhlIG5ld2x5IGNyZWF0ZWQgVG9hc3QgaW5zdGFuY2Ugd2l0aCBhIHJhbmRvbWx5IGdlbmVyYXRlZCBHVUlEIElkLlxuICAgICAqL1xuICAgIHBvcCh0eXBlOiBUb2FzdFR5cGUgfCBUb2FzdCwgdGl0bGU/OiBzdHJpbmcsIGJvZHk/OiBzdHJpbmcpOiBUb2FzdCB7XG4gICAgICAgIGNvbnN0IHRvYXN0ID0gdHlwZW9mIHR5cGUgPT09ICdzdHJpbmcnID8geyB0eXBlOiB0eXBlLCB0aXRsZTogdGl0bGUsIGJvZHk6IGJvZHkgfSA6IHR5cGU7XG5cbiAgICAgICAgaWYgKCF0b2FzdC50b2FzdElkKSB7XG4gICAgICAgICAgICB0b2FzdC50b2FzdElkID0gR3VpZC5uZXdHdWlkKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRoaXMuX2FkZFRvYXN0KSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIFRvYXN0ZXIgQ29udGFpbmVycyBoYXZlIGJlZW4gaW5pdGlhbGl6ZWQgdG8gcmVjZWl2ZSB0b2FzdHMuJyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9hZGRUb2FzdC5uZXh0KHRvYXN0KTtcbiAgICAgICAgcmV0dXJuIHRvYXN0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFzeW5jaHJvbm91c2x5IGNyZWF0ZSBhbmQgc2hvdyBhIG5ldyB0b2FzdCBpbnN0YW5jZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7KHN0cmluZyB8IFRvYXN0KX0gdHlwZSBUaGUgdHlwZSBvZiB0aGUgdG9hc3QsIG9yIGEgVG9hc3Qgb2JqZWN0LlxuICAgICAqIEBwYXJhbSB7c3RyaW5nPX0gdGl0bGUgVGhlIHRvYXN0IHRpdGxlLlxuICAgICAqIEBwYXJhbSB7c3RyaW5nPX0gYm9keSBUaGUgdG9hc3QgYm9keS5cbiAgICAgKiBAcmV0dXJucyB7T2JzZXJ2YWJsZTxUb2FzdD59XG4gICAgICogICAgICAgICAgQSBob3QgT2JzZXJ2YWJsZSB0aGF0IGNhbiBiZSBzdWJzY3JpYmVkIHRvIGluIG9yZGVyIHRvIHJlY2VpdmUgdGhlIFRvYXN0IGluc3RhbmNlXG4gICAgICogICAgICAgICAgd2l0aCBhIHJhbmRvbWx5IGdlbmVyYXRlZCBHVUlEIElkLlxuICAgICAqL1xuICAgIHBvcEFzeW5jKHR5cGU6IFRvYXN0VHlwZSB8IFRvYXN0LCB0aXRsZT86IHN0cmluZywgYm9keT86IHN0cmluZyk6IE9ic2VydmFibGU8VG9hc3Q+IHtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnBvcCh0eXBlLCB0aXRsZSwgYm9keSk7XG4gICAgICAgIH0sIDApO1xuXG4gICAgICAgIHJldHVybiB0aGlzLmFkZFRvYXN0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENsZWFycyBhIHRvYXN0IGJ5IHRvYXN0SWQgYW5kL29yIHRvYXN0Q29udGFpbmVySWQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdG9hc3RJZCBUaGUgdG9hc3RJZCB0byBjbGVhci5cbiAgICAgKiBAcGFyYW0ge251bWJlcj19IHRvYXN0Q29udGFpbmVySWRcbiAgICAgKiAgICAgICAgVGhlIHRvYXN0Q29udGFpbmVySWQgb2YgdGhlIGNvbnRhaW5lciB0byByZW1vdmUgdG9hc3RzIGZyb20uXG4gICAgICovXG4gICAgY2xlYXIodG9hc3RJZD86IHN0cmluZywgdG9hc3RDb250YWluZXJJZD86IG51bWJlcikge1xuICAgICAgICBjb25zdCBjbGVhcldyYXBwZXI6IElDbGVhcldyYXBwZXIgPSB7XG4gICAgICAgICAgICB0b2FzdElkOiB0b2FzdElkLCB0b2FzdENvbnRhaW5lcklkOiB0b2FzdENvbnRhaW5lcklkXG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5fY2xlYXJUb2FzdHMubmV4dChjbGVhcldyYXBwZXIpXG4gICAgfVxufVxuIl19