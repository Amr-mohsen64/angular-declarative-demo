import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BehaviorSubject, EMPTY, catchError } from 'rxjs';
import { DeclarativePostsService } from 'src/app/services/declarative-posts.service';

@Component({
  selector: 'app-single-post',
  templateUrl: './single-post.component.html',
  styleUrls: ['./single-post.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SinglePostComponent {
  errorMessageSubject = new BehaviorSubject('');
  errorMessageAction$ = this.errorMessageSubject.asObservable();

  constructor(private postsService: DeclarativePostsService) {}

  post$ = this.postsService.post$.pipe(
    catchError((err: string) => {
      this.errorMessageSubject.next(err);
      return EMPTY;
    })
  );
}
