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
    private postsUpdated = new Subject<{posts: Post[], postCount: number}>();

    constructor(private http: HttpClient) { }

    getPosts(postsPerPage: number, currentPage: number) {
        const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
        this.http.get<{message: string, posts: any, maxPosts: number}>('http://localhost:3000/api/posts')
        .pipe(map(postData => {
            return {
                posts: postData.posts.map(post => {
                    return {
                        title: post.title,
                        content: post.content,
                        id: post._id,
                        imagePath: post.imagePath
                    }
                }),
                maxPosts: postData.maxPosts
            }
        }))
        .subscribe((transformedPosts) => {
            this.posts = transformedPosts.posts;
            console.log(this.posts);
            this.postsUpdated.next({posts: [...this.posts], postCount: transformedPosts.maxPosts});
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
        .subscribe();
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
        .subscribe();
    }

    deletePost(postId: string) {
        return this.http.delete<{message: string}>(`http://localhost:3000/api/post/${postId}`)
    }
}