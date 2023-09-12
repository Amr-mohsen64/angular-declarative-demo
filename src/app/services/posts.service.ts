import { CategoriesService } from './categories.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IPost } from '../models/IPost.model';
import { exhaustMap, map, mergeMap } from 'rxjs';
import { ICategory } from '../models/ICategory.model';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  constructor(
    private http: HttpClient,
    private categoriesService: CategoriesService
  ) {}

  getPosts() {
    return this.http
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
  }

  getPostsWithCategory() {
    return this.getPosts().pipe(
      mergeMap((posts) => {
        return this.categoriesService.getCategories().pipe(
          map((categories) => {
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
      })
    );
  }
}
