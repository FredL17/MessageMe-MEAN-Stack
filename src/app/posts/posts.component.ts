import { Component, OnInit } from '@angular/core';
import { Post } from '../models/post.model';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {


  constructor() { }

  ngOnInit(): void {
  }

}
