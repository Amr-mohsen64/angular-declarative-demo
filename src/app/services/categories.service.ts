import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICategory } from '../models/ICategory.model';
import { map, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  constructor(private http: HttpClient) {}

  getCategories() {
    return this.http
      .get(
        'https://declarative-angular-1d8a5-default-rtdb.firebaseio.com/categories.json'
      )
      .pipe(
        map((responseObject: any) => {
          const categoriesList: ICategory[] = [];
          for (const key in responseObject) {
            categoriesList.push({ ...responseObject[key], id: key });
          }
          return categoriesList;
        }),
        shareReplay()
      );
  }
}
