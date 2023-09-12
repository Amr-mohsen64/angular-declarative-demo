import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostsComponent } from './pages/posts/posts.component';
import { HomeComponent } from './components/home/home.component';
import { PostsDeclarativeComponent } from './pages/posts-declarative/posts-declarative.component';
import { AllPostsComponent } from './pages/all-posts/all-posts.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'posts', component: PostsComponent },
  { path: 'declarative-posts', component: PostsDeclarativeComponent },
  { path: 'all-posts', component: AllPostsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
