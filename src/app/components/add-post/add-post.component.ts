import { DeclarativePostsService } from 'src/app/services/declarative-posts.service';
import { CategoriesDeclarativeService } from './../../services/categories-declartive.service';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { IPost } from 'src/app/models/IPost.model';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddPostComponent {
  postForm = new FormGroup({
    title: new FormControl(''),
    description: new FormControl(''),
    categoryId: new FormControl(''),
  });

  constructor(
    private categoriesDeclarativeService: CategoriesDeclarativeService,
    private declarativePostsService: DeclarativePostsService
  ) {}

  categories$ = this.categoriesDeclarativeService.categories$;

  onSubmit() {
    this.declarativePostsService.addPost(this.postForm.value as IPost);
  }
}
