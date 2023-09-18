import { LoaderService } from './services/loader.service';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  title = 'angular-declerative';
  constructor(private loaderService: LoaderService) {}

  showLoader$ = this.loaderService.loaderAction$;
}
