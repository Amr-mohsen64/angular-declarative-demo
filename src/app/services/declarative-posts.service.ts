import { CRUDAction } from './../models/IPost.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Subject,
  catchError,
  combineLatest,
  delay,
  map,
  merge,
  scan,
  share,
  shareReplay,
  throwError,
} from 'rxjs';
import { IPost } from '../models/IPost.model';
import { CategoriesDeclarativeService } from './categories-declartive.service';

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
      // delay(2000),
      map((responseObject) => {
        const postsList: IPost[] = [];
        for (const key in responseObject) {
          postsList.push({ ...responseObject[key], id: key });
        }
        return postsList;
      }),
      catchError(this.handleError),
      shareReplay(1) //FOR CACHE
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
    }),
    catchError(this.handleError),
    shareReplay(1)
  );

  private postCRUDSubject = new Subject<CRUDAction<IPost>>();
  postCRUDAction$ = this.postCRUDSubject.asObservable();

  allPosts$ = merge(
    this.postsWithCategory$,
    this.postCRUDAction$.pipe(map((data) => [data.data]))
  ).pipe(
    scan((postsWithCat, newCurdedPost) => [...postsWithCat, ...newCurdedPost])
  );

  addPost(post: IPost) {
    this.postCRUDSubject.next({ action: 'add', data: post });
  }

  private selectedPostSubject = new Subject<string>();
  selectedPostAction$ = this.selectedPostSubject.asObservable();

  post$ = combineLatest([
    this.postsWithCategory$,
    this.selectedPostAction$,
  ]).pipe(
    map(([posts, selectedPostId]) =>
      posts.find((post) => post.id === selectedPostId)
    ),
    shareReplay(1),
    catchError(this.handleError)
  );

  selectPost(postId: string) {
    this.selectedPostSubject.next(postId);
  }

  handleError(error: Error) {
    return throwError(() => 'unknown error ocurred, please try againg');
  }
}
