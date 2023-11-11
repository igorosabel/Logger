import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { UserService } from "src/app/services/user.service";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(public us: UserService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    request = request.clone({
      setHeaders: {
        Authorization:
          this.us.user && this.us.user.token ? this.us.user.token : "",
      },
    });
    return next.handle(request);
  }
}
