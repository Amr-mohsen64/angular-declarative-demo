import { NotificationService } from './../../services/notification.service';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY, catchError, combineLatest, map, startWith, tap } from 'rxjs';
import { IPost } from 'src/app/models/IPost.model';
import { CategoriesDeclarativeService } from 'src/app/services/categories-declartive.service';
import { DeclarativePostsService } from 'src/app/services/declarative-posts.service';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostFormComponent {
  postForm = new FormGroup({
    title: new FormControl(''),
    description: new FormControl(''),
    categoryId: new FormControl(''),
  });
  postId!: string;

  constructor(
    private categoriesDeclarativeService: CategoriesDeclarativeService,
    private declarativePostsService: DeclarativePostsService,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  categories$ = this.categoriesDeclarativeService.categories$;

  selectedPostId$ = this.route.paramMap.pipe(
    map((paramMap) => {
      const id = paramMap.get('id') as string;
      if (!id) this.postForm.reset();

      this.postId = id;
      this.declarativePostsService.selectPost(id);
      return id;
    })
  );

  post$ = this.declarativePostsService.post$.pipe(
    tap((post) => post && this.postForm.patchValue(post)),
    catchError((error) => {
      console.log(error);

      return EMPTY;
    })
  );

  notification$ = this.declarativePostsService.postCRUDCompleteAction$.pipe(
    startWith(false),
    tap((message) => {
      if (message) this.router.navigate(['/declarative-posts']);
    })
  );

  vm$ = combineLatest([this.post$, this.selectedPostId$, this.notification$]);

  onSubmit() {
    let postDetails = this.postForm.value as IPost;
    if (this.postId) {
      postDetails = { ...postDetails, id: this.postId };
      this.declarativePostsService.updatePost(postDetails);
    } else {
      this.declarativePostsService.addPost(postDetails);
    }
  }
}
