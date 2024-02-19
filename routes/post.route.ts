import { Router, Request, Response } from "express";
import PostController from "../controllers/post.controller";

const router: Router = Router();

router.get("/test", (req: Request, res: Response) => {
  res.send("Post Test Route!! 🤓");
});

// create a post
router.post("/create-post", PostController.createPost);

// get all post ids
router.get("/get-all-posts", PostController.getPostsId);

// get a post by id
router.get("/get-post-by-id/:id", PostController.getPostById);

// get all posts by user id
router.get("/get-post-by-user-id/:userId", PostController.getPostsByUserId);

// like a post
router.post("/like-a-post/:postId", PostController.likePost);

export default router;
