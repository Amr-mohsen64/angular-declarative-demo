import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { PostsComponent } from './pages/posts/posts.component';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './components/home/home.component';
import { PostsDeclarativeComponent } from './pages/posts-declarative/posts-declarative.component';
import { AllPostsComponent } from './pages/all-posts/all-posts.component';
import { SinglePostComponent } from './components/single-post/single-post.component';
import { LoadingComponent } from './components/loading/loading.component';
import { AddPostComponent } from './components/add-post/add-post.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UpdatePostComponent } from './components/update-post/update-post.component';
import { PostFormComponent } from './components/post-form/post-form.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    PostsComponent,
    HomeComponent,
    PostsDeclarativeComponent,
    AllPostsComponent,
    SinglePostComponent,
    LoadingComponent,
    AddPostComponent,
    UpdatePostComponent,
    PostFormComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
