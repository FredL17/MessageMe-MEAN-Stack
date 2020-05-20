import { Component, OnInit, OnDestroy} from '@angular/core';
import { Subscription} from 'rxjs';

import { Post } from '../../models/post.model';
import { PostsService } from 'src/app/services/posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  
  posts: Post[] = [];
  postSub: Subscription;

  constructor(public postService: PostsService) { }

  ngOnInit(): void {
    this.postService.getPosts();
    this.postSub = this.postService.getPostUpdateListener().subscribe((posts: Post[]) => {
      this.posts = posts;
    });
  }

  ngOnDestroy() {
    this.postSub.unsubscribe();
  }

  deletePost(postId: string) {
    this.postService.deletePost(postId);
  }

}
