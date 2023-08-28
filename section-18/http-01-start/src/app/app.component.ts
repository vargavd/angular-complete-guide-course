import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Post } from './post.model';
import { PostsService } from './posts.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  loadedPosts: Post[] = [];
  isFetching = false;
  error = null;
  private subscription: Subscription;

  constructor(
    private http: HttpClient,
    private postsService: PostsService
  ) {}

  ngOnInit() {
    this.onFetchPosts();

    this.subscription = this.postsService.error.subscribe(errorMessage => {
      this.error = errorMessage;
      this.isFetching = false;
    });
  }

  onCreatePost(postData: { title: string; content: string }) {
    this.postsService.createAndStorePost(postData.title, postData.content);
  }

  onFetchPosts() {
    this.isFetching = true;
    
    this.postsService.fetchPosts().subscribe(posts => {
      this.loadedPosts = posts;

      this.isFetching = false;
    }, error => {
      this.isFetching = false;
      this.error = error.message;
      console.log(error);
    });
  }

  onClearPosts() {
    this.postsService.deletePosts().subscribe(() => {
      this.loadedPosts = [];
    }, error => {
      this.error = error.message;
      this.isFetching = false;
    });
  }

  onHandleError() {
    this.error = null;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
