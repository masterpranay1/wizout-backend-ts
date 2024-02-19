import PostService from "../services/post.service";
import { z } from "zod";

class PostController {
  async createPost(req: any, res: any) {
    const schema = z.object({
      userId: z.string(),
      content: z.string(),
    });

    try {
      const post = schema.parse(req.body);
      const result = await PostService.create(post);

      if (result instanceof Error) {
        throw result;
      }

      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getPostsId(req: any, res: any) {
    const result = await PostService.getPostsId();

    if (result instanceof Error) {
      res.status(404).json({ error: result.message });
    } else {
      console.log(result);
      res.status(200).json(result.map((post: any) => post.id));
    }
  }

  async getPostById(req: any, res: any) {
    const { id } = req.params;
    const result = await PostService.getPostById(id);

    if (result instanceof Error) {
      res.status(404).json({ error: result.message });
    } else {
      res.status(200).json(result);
    }
  }

  async getPostsByUserId(req: any, res: any) {
    const { userId } = req.params;
    const result = await PostService.getPostsByUserId(userId);

    if (result instanceof Error) {
      res.status(404).json({ error: result.message });
    } else {
      res.status(200).json(result.map((post: any) => post.id));
    }
  }

  async likePost(req: any, res: any) {
    const { postId } = req.params;
    const { userId } = req.body;

    let post = await PostService.getPostById(postId);

    if (post instanceof Error) {
      res.status(404).json({ error: post.message });
      return;
    }

    let likes = post.likes || 0;
    let likesUserId = post.likesUserId || [];

    if (likesUserId.includes(userId)) {
      res.status(400).json({ error: "User already liked this post" });
      return;
    }

    likesUserId.push(userId);
    likes++;

    post = await PostService.updatePostLikes(postId, likes, likesUserId);

    if (post instanceof Error) {
      res.status(400).json({ error: post.message });
    } else {
      res.status(200).json(post);
    }
  }
}

export default new PostController();
