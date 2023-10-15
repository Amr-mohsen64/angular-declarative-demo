import { NotificationService } from './notification.service';
import { CRUDAction } from './../models/IPost.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  Subject,
  catchError,
  combineLatest,
  concatMap,
  delay,
  map,
  merge,
  of,
  scan,
  share,
  shareReplay,
  tap,
  throwError,
} from 'rxjs';
import { IPost } from '../models/IPost.model';
import { CategoriesDeclarativeService } from './categories-declartive.service';

const APIURL =
  'https://declarative-angular-1d8a5-default-rtdb.firebaseio.com/posts.json';
@Injectable({
  providedIn: 'root',
})
export class DeclarativePostsService {
  constructor(
    private http: HttpClient,
    private categoriesService: CategoriesDeclarativeService,
    private notificationService: NotificationService
  ) {}

  posts$ = this.http.get<{ [id: string]: IPost }>(APIURL).pipe(
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
    shareReplay(1),
    catchError(this.handleError)
  );

  private postCRUDCompleteSubject = new Subject<CRUDAction<IPost>>();
  postCRUDCompleteAction$ = this.postCRUDCompleteSubject.asObservable();

  allPosts$ = merge(
    this.postsWithCategory$,
    this.postCRUDCompleteAction$.pipe(
      concatMap((postAction) =>
        this.savePost(postAction).pipe(
          map((post) => ({ ...postAction, data: post }))
        )
      )
    )
  ).pipe(
    scan((posts, value) => this.modifyPosts(posts, value), [] as IPost[]),
    shareReplay(1),
    catchError(this.handleError)
  );

  addPost(post: IPost) {
    this.postCRUDCompleteSubject.next({ action: 'add', data: post });
  }

  updatePost(post: IPost) {
    this.postCRUDCompleteSubject.next({ action: 'update', data: post });
  }

  deletePost(post: IPost) {
    this.postCRUDCompleteSubject.next({ action: 'delete', data: post });
  }

  modifyPosts(posts: IPost[], value: IPost[] | CRUDAction<IPost>) {
    if (!(value instanceof Array)) {
      if (value.action === 'add') {
        return [...posts, value.data]; // take old posts and append new one to it
      }
      if (value.action === 'update') {
        return posts.map((post) =>
          post.id === value.data.id ? value.data : post
        );
      }

      if (value.action === 'delete') {
        return posts.filter((post) => post.id !== value.data.id);
      }
    } else {
      return [...value];
    }
    return posts;
  }

  private postCRUDCompletedSubject = new Subject<boolean>();
  postCRUDCompletedAction$ = this.postCRUDCompletedSubject.asObservable();

  savePost(postAction: CRUDAction<IPost>): Observable<IPost> {
    this.postCRUDCompletedSubject.next(false); //reset it
    let postDetails$!: Observable<IPost>;

    if (postAction.action === 'add') {
      postDetails$ = this.addPostToServer(postAction.data).pipe(
        tap(() => {
          this.notificationService.setSuccessMessage('post added successfully');
          this.postCRUDCompletedSubject.next(true);
        }),
        catchError(this.handleError)
      );
    }

    if (postAction.action === 'update') {
      postDetails$ = this.updatePostToServer(postAction.data).pipe(
        tap(() => {
          this.notificationService.setSuccessMessage(
            'post updated successfully'
          );
          this.postCRUDCompletedSubject.next(true);
        }),
        catchError(this.handleError)
      );
    }

    if (postAction.action === 'delete') {
      return this.deletePostToServer(postAction.data).pipe(
        map(() => postAction.data),
        tap(() => {
          this.notificationService.setSuccessMessage(
            'post delete successfully'
          );
          this.postCRUDCompletedSubject.next(true);
        }),
        catchError(this.handleError)
      );
    }

    return postDetails$.pipe(
      concatMap((post) =>
        this.categoriesService.categories$.pipe(
          map((categories) => {
            return {
              ...post,
              categoryName: categories.find(
                (category) => post.categoryId === category.id
              )?.title,
            };
          })
        )
      )
    );
  }

  addPostToServer(post: IPost) {
    return this.http.post<{ name: string }>(APIURL, post).pipe(
      map((id) => {
        return { ...post, id: id.name } as IPost;
      })
    );
  }

  updatePostToServer(post: IPost) {
    return this.http.patch<IPost>(
      `https://declarative-angular-1d8a5-default-rtdb.firebaseio.com/posts/${post.id}.json`,
      post
    );
  }

  deletePostToServer(post: IPost) {
    return this.http.delete<IPost>(
      `https://declarative-angular-1d8a5-default-rtdb.firebaseio.com/posts/${post.id}.json`
    );
  }

  private selectedPostSubject = new Subject<string>();
  selectedPostAction$ = this.selectedPostSubject.asObservable();

  post$ = combineLatest([this.allPosts$, this.selectedPostAction$]).pipe(
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
