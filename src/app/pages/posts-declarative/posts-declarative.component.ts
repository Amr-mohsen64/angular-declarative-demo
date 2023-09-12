import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { CategoriesDeclarativeService } from './../../services/categories-declartive.service';
import { DeclarativePostsService } from './../../services/declarative-posts.service';

@Component({
  selector: 'app-posts-declarative',
  templateUrl: './posts-declarative.component.html',
  styleUrls: ['./posts-declarative.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostsDeclarativeComponent implements OnInit {
  selectedCategorySubject = new BehaviorSubject<string>('');
  selectedCategoryAction$ = this.selectedCategorySubject.asObservable();
  categories$ = this.categoriesDeclarativeService.categories$;
  posts$ = this.declarativePostsService.postsWithCategory$;
  filteredPosts$ = combineLatest([
    this.posts$,
    this.selectedCategoryAction$,
  ]).pipe(
    map(([posts, selectedCategoryId]) => {
      return posts.filter((post) =>
        selectedCategoryId ? post.categoryId === selectedCategoryId : true
      );
    })
  );

  constructor(
    private declarativePostsService: DeclarativePostsService,
    private categoriesDeclarativeService: CategoriesDeclarativeService
  ) {}

  ngOnInit(): void {}

  onFilterCategory(event: Event) {
    const selectedCategoryId = (<HTMLSelectElement>event.target).value;
    this.selectedCategorySubject.next(selectedCategoryId);
  }
}
