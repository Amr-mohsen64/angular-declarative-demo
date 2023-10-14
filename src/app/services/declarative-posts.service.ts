import { CRUDAction } from './../models/IPost.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
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
    private categoriesService: CategoriesDeclarativeService
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
    catchError(this.handleError),
    shareReplay(1)
  );

  private postCRUDSubject = new Subject<CRUDAction<IPost>>();
  postCRUDAction$ = this.postCRUDSubject.asObservable();

  allPosts$ = merge(
    this.postsWithCategory$,
    this.postCRUDAction$.pipe(
      concatMap((postAction) =>
        this.savePost(postAction).pipe(
          map((post) => ({ ...postAction, data: post }))
        )
      )
    )
  ).pipe(
    scan((posts, value) => this.modifyPosts(posts, value), [] as IPost[]),
    shareReplay(1)
  );

  addPost(post: IPost) {
    this.postCRUDSubject.next({ action: 'add', data: post });
  }

  updatePost(post: IPost) {
    this.postCRUDSubject.next({ action: 'update', data: post });
  }

  deletePost(post: IPost) {
    this.postCRUDSubject.next({ action: 'delete', data: post });
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

  savePost(postAction: CRUDAction<IPost>): Observable<IPost> {
    let postDetails$!: Observable<IPost>;

    if (postAction.action === 'add') {
      postDetails$ = this.addPostToServer(postAction.data);
    }

    if (postAction.action === 'update') {
      postDetails$ = this.updatePostToServer(postAction.data);
    }

    if (postAction.action === 'delete') {
      return this.deletePostToServer(postAction.data).pipe(
        map(() => postAction.data)
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
