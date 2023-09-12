import {} from '@angular/compiler';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentRef,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Subscription, interval, retryWhen } from 'rxjs';
import { IPost } from 'src/app/models/IPost.model';
import { CategoriesService } from './../../services/categories.service';
import { PostsService } from './../../services/posts.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostsComponent implements OnInit, OnDestroy {
  posts: IPost[] = [];
  subscriptions: Subscription = new Subscription();

  constructor(
    private postsService: PostsService,
    private ref: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(interval(1000).subscribe((sec) => console.log(sec)));

    this.subscriptions.add(
      this.postsService.getPostsWithCategory().subscribe((data: IPost[]) => {
        this.posts = data;
        this.ref.detectChanges();
      })
    );

    console.log(this.subscriptions);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
