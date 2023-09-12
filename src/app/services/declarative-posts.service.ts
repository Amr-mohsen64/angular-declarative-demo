import { CategoriesDeclarativeService } from './categories-declartive.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IPost } from '../models/IPost.model';
import { Subject, combineLatest, find, forkJoin, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DeclarativePostsService {
  constructor(
    private http: HttpClient,
    private categoriesService: CategoriesDeclarativeService
  ) {}

  posts$ = this.http
    .get<{ [id: string]: IPost }>(
      'https://declarative-angular-1d8a5-default-rtdb.firebaseio.com/posts.json'
    )
    .pipe(
      map((responseObject) => {
        const postsList: IPost[] = [];
        for (const key in responseObject) {
          postsList.push({ ...responseObject[key], id: key });
        }
        return postsList;
      })
    );

  postsWithCategory$ = combineLatest([
    this.posts$,
    this.categoriesService.categories$,
  ]).pipe(
    map(([posts, categories]) => {
      return posts.map((post) => {
        return {
          ...post,
          categoryName: categories.find(
            (category) => category.id === post.categoryId
          )?.title,
        };
      });
    })
  );

  private selectedPostSubject = new Subject<string>();
  selectedPostAction$ = this.selectedPostSubject.asObservable();

  post$ = combineLatest([
    this.postsWithCategory$,
    this.selectedPostAction$,
  ]).pipe(
    map(([posts, selectedPostId]) =>
      posts.find((post) => post.id === selectedPostId)
    )
  );

  selectPost(postId: string) {
    this.selectedPostSubject.next(postId);
  }
}
