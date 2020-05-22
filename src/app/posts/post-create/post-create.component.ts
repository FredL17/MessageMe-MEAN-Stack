import { Component, OnInit} from '@angular/core';
import { Post } from '../../models/post.model';
import { FormGroup, FormControl, Validator, Validators } from '@angular/forms';
import { PostsService } from 'src/app/services/posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

  private mode = 'create';
  private postId: string;
  imagePreview: string;
  post: Post = {id: "#", title: "", content: ""};
  form: FormGroup;


  constructor(public postsService: PostsService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
      content: new FormControl(null, {validators: [Validators.required]}),
      image: new FormControl(null,  {validators: [Validators.required], asyncValidators: [mimeType]})
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if(paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.post = this.postsService.getPost(this.postId);
        this.form.setValue({
          title: this.post.title,
          content: this.post.content
        })

      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }
  
  savePost() {
    if(this.form.invalid) {
      return;
    }
    if(this.mode === 'create') {
      const post: Post = {id: "#", title: this.form.value.title, content: this.form.value.content};
      console.log(post);
      this.postsService.addPost(post, this.form.value.image);
    }
    else if(this.mode === 'edit') {
      const post: Post = {id: this.postId, title: this.form.value.title, content: this.form.value.content};
      console.log(post);
      this.postsService.updatePost(post);
    }
    
    this.form.reset();
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    }
    reader.readAsDataURL(file);
  }

}
