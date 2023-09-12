import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DeclarativePostsService } from 'src/app/services/declarative-posts.service';

@Component({
  selector: 'app-single-post',
  templateUrl: './single-post.component.html',
  styleUrls: ['./single-post.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SinglePostComponent {
  constructor(private postsService: DeclarativePostsService) {}
  post$ = this.postsService.post$;
}
