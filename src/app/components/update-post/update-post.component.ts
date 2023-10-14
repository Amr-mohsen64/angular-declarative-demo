import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DeclarativePostsService } from 'src/app/services/declarative-posts.service';
import { CategoriesDeclarativeService } from './../../services/categories-declartive.service';
import { tap } from 'rxjs';
import { IPost } from 'src/app/models/IPost.model';

@Component({
  selector: 'app-update-post',
  templateUrl: './update-post.component.html',
  styleUrls: ['./update-post.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdatePostComponent {
  postId: string = '';
  categories$ = this.categoriesDeclarativeService.categories$;
  post$ = this.postsService.post$.pipe(
    tap((post) => {
      this.postId = post?.id as string;
      this.postForm.patchValue({ ...post });
    })
  );

  constructor(
    private categoriesDeclarativeService: CategoriesDeclarativeService,
    private postsService: DeclarativePostsService
  ) {}

  postForm = new FormGroup({
    title: new FormControl(''),
    description: new FormControl(''),
    categoryId: new FormControl(''),
  });

  onUpdatePost() {
    const postDetails = {
      ...this.postForm.value,
      id: this.postId,
    };

    this.postsService.updatePost(postDetails as IPost);
  }
}
