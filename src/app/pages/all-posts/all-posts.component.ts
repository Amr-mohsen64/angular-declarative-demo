import { DeclarativePostsService } from 'src/app/services/declarative-posts.service';
import { PostsService } from './../../services/posts.service';
import { Component } from '@angular/core';
import { IPost } from 'src/app/models/IPost.model';

@Component({
  selector: 'app-all-posts',
  templateUrl: './all-posts.component.html',
  styleUrls: ['./all-posts.component.scss'],
})
export class AllPostsComponent {
  posts$ = this.postsService.postsWithCategory$;
  constructor(private postsService: DeclarativePostsService) {}

  onSelectPost(post: IPost) {
    post.id && this.postsService.selectPost(post.id);
  }
}
