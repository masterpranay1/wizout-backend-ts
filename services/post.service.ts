class PostService {
  private url: string;

  constructor() {
    this.url = `https://whizout.pockethost.io/api/collections/posts`;
  }

  async create(post: any) {
    const result = await fetch(`${this.url}/records`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: post.content,
        likes: 0,
        userId: post.userId,
      }),
    }).then((res) => res.json());

    if (result?.id) {
      return result;
    } else {
      return new Error("Error creating post");
    }
  }

  async getPostsId() {
    const result = await fetch(`${this.url}/records?fields=id`).then((res) =>
      res.json()
    );

    if (result?.items) {
      return result.items;
    } else {
      return new Error("Posts not found");
    }
  }

  async getPostById(id: string) {
    const result = await fetch(`${this.url}/records/${id}`).then((res) =>
      res.json()
    );

    if (result?.id) {
      return result;
    } else {
      return new Error("Post not found");
    }
  }

  async getPostsByUserId(userId: string) {
    const result = await fetch(
      `${this.url}/records?filter=(userId='${userId}')&&fields=id`
    ).then((res) => res.json());

    if (result?.items) {
      return result.items;
    } else {
      return new Error("Posts not found");
    }
  }

  async updatePostLikes(id: string, likes: number, likesUserId: string[]) {
    const result = await fetch(`${this.url}/records/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        likes: likes,
        likesUserId: likesUserId,
      }),
    }).then((res) => res.json());

    if (result?.id) {
      return result;
    } else {
      return new Error("Error updating post");
    }
  }
}

export default new PostService();
