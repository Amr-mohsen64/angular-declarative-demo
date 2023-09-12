import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICategory } from '../models/ICategory.model';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoriesDeclarativeService {
  constructor(private http: HttpClient) {}

  categories$ = this.http
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
      })
    );
}
