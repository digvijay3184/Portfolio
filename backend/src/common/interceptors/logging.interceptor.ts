import { CallHandler, ExecutionContext, Injectable, NestInterceptor, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('RequestTracker');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const className = context.getClass().name;
    const handlerName = context.getHandler().name;
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;

    const isUpdateOrInsert = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);

    if (isUpdateOrInsert) {
      this.logger.log(`[${className}.${handlerName}] Initiated - ${method} ${url}`);
    }

    const now = Date.now();
    return next
      .handle()
      .pipe(
        tap(() => {
          if (isUpdateOrInsert) {
            this.logger.log(`[${className}.${handlerName}] Completed - ${method} ${url} - ${Date.now() - now}ms`);
          }
        }),
      );
  }
}
