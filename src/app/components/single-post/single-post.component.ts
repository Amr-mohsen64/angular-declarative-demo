import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BehaviorSubject, EMPTY, catchError, tap } from 'rxjs';
import { IPost } from 'src/app/models/IPost.model';
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
  showUpdatePost = false;

  constructor(private postsService: DeclarativePostsService) {}

  post$ = this.postsService.post$.pipe(
    tap(() => (this.showUpdatePost = false)),
    catchError((err: string) => {
      this.errorMessageSubject.next(err);
      return EMPTY;
    })
  );

  updatePost() {
    this.showUpdatePost = true;
  }
  deletePost(post: IPost) {
    if (confirm('do u want to delete post ? ')) {
      this.postsService.deletePost(post);
    }
  }
}
