import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { PostsComponent } from './pages/posts/posts.component';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './components/home/home.component';
import { PostsDeclarativeComponent } from './pages/posts-declarative/posts-declarative.component';

@NgModule({
  declarations: [AppComponent, HeaderComponent, PostsComponent, HomeComponent, PostsDeclarativeComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
