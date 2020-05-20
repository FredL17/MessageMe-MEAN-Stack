import { Component, OnInit} from '@angular/core';
import { Post } from '../../models/post.model';
import { NgForm } from '@angular/forms';
import { PostsService } from 'src/app/services/posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

  private mode = 'create';
  private postId: string;
  post: Post;


  constructor(public postsService: PostsService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if(paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.post = this.postsService.getPost(this.postId);

      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  savePost(form: NgForm) {
    if(form.invalid) {
      return;
    }
    if(this.mode === 'create') {
      const post: Post = {id: "#", title: form.value.title, content: form.value.content};
      console.log(post);
      this.postsService.addPost(post);
    }
    else if(this.mode === 'edit') {
      const post: Post = {id: this.postId, title: form.value.title, content: form.value.content};
      console.log(post);
      this.postsService.updatePost(post);
    }
    
    form.resetForm();
  }

}
