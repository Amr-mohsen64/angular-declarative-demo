import { Component, OnInit } from '@angular/core';
import { combineLatest, map, tap } from 'rxjs';
import { IPost } from 'src/app/models/IPost.model';
import { DeclarativePostsService } from 'src/app/services/declarative-posts.service';
import { LoaderService } from './../../services/loader.service';

@Component({
  selector: 'app-all-posts',
  templateUrl: './all-posts.component.html',
  styleUrls: ['./all-posts.component.scss'],
})
export class AllPostsComponent implements OnInit {
  posts$ = this.postsService.postsWithCategory$.pipe(
    tap((posts) => posts[0].id && this.postsService.selectPost(posts[0].id))
  );
  selectedPost$ = this.postsService.post$.pipe(tap(() => console.log('fired'))); // performance issue called at number of items to solve this use view model

  vm$ = combineLatest([this.posts$, this.selectedPost$])
    .pipe(
      map(([posts, selectedPost]) => ({
        posts,
        selectedPost,
      }))
    )
    .pipe(tap(() => this.loaderService.hideLoader()));

  constructor(
    private postsService: DeclarativePostsService,
    private loaderService: LoaderService
  ) {}

  ngOnInit(): void {
    this.loaderService.showLoader();
  }

  onSelectPost(post: IPost) {
    post.id && this.postsService.selectPost(post.id);
  }
}
