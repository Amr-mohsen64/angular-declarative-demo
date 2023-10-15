import { NotificationService } from './services/notification.service';
import { LoaderService } from './services/loader.service';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { tap } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  title = 'angular-declerative';
  constructor(
    private loaderService: LoaderService,
    private notificationService: NotificationService
  ) {}

  showLoader$ = this.loaderService.loaderAction$;
  successMessage$ = this.notificationService.successMessageAction$.pipe(
    tap((message) => {
      if (message) {
        setTimeout(() => {
          this.notificationService.clearAllMessages();
        }, 2000);
      }
    })
  );

  errorMessage$ = this.notificationService.errorMessageAction$.pipe(
    tap((message) => {
      if (message) {
        setTimeout(() => {
          this.notificationService.clearAllMessages();
        }, 2000);
      }
    })
  );
}
