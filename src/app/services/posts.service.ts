import { Post } from '../models/post.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class PostsService {
    private posts: Post[] = [];
    private postsUpdated = new Subject<Post[]>();

    constructor(private http: HttpClient) { }

    getPosts() {
        this.http.get<{posts: any}>('http://localhost:3000/api/posts')
        .pipe(map(postData => {
            return postData.posts.map(post => {
                return {
                    title: post.title,
                    content: post.content,
                    id: post._id
                }
            })
        }))
        .subscribe((transformedPosts) => {
            this.posts = transformedPosts;
            console.log(this.posts);
            this.postsUpdated.next([...this.posts]);
        });
    }

    getPostUpdateListener() {
        return this.postsUpdated.asObservable();
    }

    addPost(post: Post) {
        this.http.post<{message: string, postId: string}>('http://localhost:3000/api/posts', post)
        .subscribe(responseData => {
            console.log(responseData.message);
            const postId = responseData.postId;
            console.log(postId);
            post.id = postId;
            this.posts.push(post);
            this.postsUpdated.next([...this.posts]);
        });
    }

    getPost(id: string) {
        return {...this.posts.find(p => p.id === id)};
    }

    updatePost(post: Post) {
        const postToUpdate: Post = {id: post.id, title: post.title, content: post.content};
        this.http.put<{message: string}>(`http://localhost:3000/api/post/${post.id}`, postToUpdate)
        .subscribe(response => {
            console.log(response);
        });
    }

    deletePost(postId: string) {
        this.http.delete<{message: string}>(`http://localhost:3000/api/post/${postId}`)
        .subscribe(response => {
            console.log(response);
            const updatedPosts = this.posts.filter(post => post.id !== postId);
            this.posts = updatedPosts;
            this.postsUpdated.next([...this.posts]);
        })
    }
}