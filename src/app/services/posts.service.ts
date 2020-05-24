/* Angular modules */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

/* Rxjs modules */
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

/* Models */
import { Post } from '../models/post.model';

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
                    id: post._id,
                    imagePath: post.imagePath
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

    addPost(post: Post, image: File) {
        const postData = new FormData();
        postData.append("title", post.title);
        postData.append("content", post.content);
        postData.append("image", image, post.title);
        this.http.post<{message: string, post: Post}>('http://localhost:3000/api/posts', postData)
        .subscribe(responseData => {
            console.log(responseData.message);
            const FetchedPost: Post = {
                id: responseData.post.id,
                title: post.title,
                content: post.content,
                imagePath: responseData.post.imagePath
            }
            console.log(FetchedPost);
            this.posts.push(post);
            this.postsUpdated.next([...this.posts]);
        });
    }

    getPost(id: string) {
        return {...this.posts.find(p => p.id === id)};
    }

    updatePost(post: Post, image: File) {
        const postData = new FormData();
        postData.append("title", post.title);
        postData.append("content", post.content);
        postData.append("image", image, post.title);
        this.http.put<{message: string, updatedPost: Post}>(`http://localhost:3000/api/post/${post.id}`, postData)
        .subscribe(response => {
            console.log(response);
            const updatedPosts = [...this.posts];
            const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id);
            updatedPosts[oldPostIndex] = response.updatedPost;
            this.posts = updatedPosts;
            this.postsUpdated.next([...this.posts]);
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