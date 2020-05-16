import { Component, OnInit} from '@angular/core';
import { Post } from '../../models/post.model';
import { NgForm } from '@angular/forms';
import { PostsService } from 'src/app/services/posts.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {


  constructor(public postsService: PostsService) {}

  ngOnInit(): void {
  }

  savePost(form: NgForm) {
    if(form.invalid) {
      return;
    }
    const post: Post = {title: form.value.title, text: form.value.text};
    this.postsService.addPost(post);
    form.resetForm();
  }

}
