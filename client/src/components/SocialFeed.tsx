import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useForm } from "react-hook-form";
import { useUser } from "@/hooks/use-user";
import { format } from "date-fns";
import { Loader2, MessageSquare, TrendingUp, Users, List, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

type PostForm = {
  content: string;
  ticker?: string;
};

export function SocialFeed() {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [chatBoardOpen, setChatBoardOpen] = useState(false);
  const { data: posts, isLoading } = useQuery({
    queryKey: ["/api/posts"],
  });

  const form = useForm<PostForm>({
    defaultValues: {
      content: "",
      ticker: "",
    },
  });

  const createPost = useMutation({
    mutationFn: async (data: PostForm) => {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      form.reset();
    },
  });

  const addReaction = useMutation({
    mutationFn: async ({ postId, type }: { postId: string; type: string }) => {
      const response = await fetch(`/api/posts/${postId}/reactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ type }),
      });
      if (!response.ok) throw new Error("Failed to add reaction");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
    },
  });

  const addComment = useMutation({
    mutationFn: async ({ postId, content }: { postId: string; content: string }) => {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ content }),
      });
      if (!response.ok) throw new Error("Failed to add comment");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Social Feed</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Social Feed</CardTitle>
          <Button variant="outline" size="sm" onClick={() => setChatBoardOpen(true)}>
            <MessageSquare className="h-4 w-4 mr-2" />
            More
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <form
            onSubmit={form.handleSubmit((data) => createPost.mutate(data))}
            className="space-y-4"
          >
            <Textarea
              placeholder="Share your market analysis..."
              {...form.register("content")}
            />
            <Button type="submit" disabled={createPost.isPending}>
              {createPost.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Post
            </Button>
          </form>

          <div className="space-y-4">
            {posts?.map((post: any) => (
              <div
                key={post.id}
                className="border border-border rounded-lg p-4 space-y-2"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{post.user.username}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(post.createdAt), "PPp")}
                    </p>
                  </div>
                  {post.ticker && (
                    <span className="text-sm font-medium text-primary">
                      ${post.ticker}
                    </span>
                  )}
                </div>
                <p className="text-sm">{post.content}</p>
                <div className="flex items-center gap-2 pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => addReaction.mutate({ postId: post.id, type: 'like' })}
                  >
                    <ThumbsUp className={`h-4 w-4 mr-1 ${post.reactions?.some(r => r.type === 'like' && r.userId === user?.id) ? 'fill-primary' : ''}`} />
                    {post.reactions?.filter(r => r.type === 'like').length || 0}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => addReaction.mutate({ postId: post.id, type: 'bullish' })}
                  >
                    <TrendingUp className={`h-4 w-4 mr-1 ${post.reactions?.some(r => r.type === 'bullish' && r.userId === user?.id) ? 'fill-green-500' : ''}`} />
                    {post.reactions?.filter(r => r.type === 'bullish').length || 0}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => addReaction.mutate({ postId: post.id, type: 'bearish' })}
                  >
                    <TrendingDown className={`h-4 w-4 mr-1 ${post.reactions?.some(r => r.type === 'bearish' && r.userId === user?.id) ? 'fill-red-500' : ''}`} />
                    {post.reactions?.filter(r => r.type === 'bearish').length || 0}
                  </Button>
                </div>
                {post.comments && post.comments.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {post.comments.map((comment: any) => (
                      <div key={comment.id} className="bg-muted rounded p-2">
                        <p className="text-sm font-medium">{comment.user.username}</p>
                        <p className="text-sm">{comment.content}</p>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <Input
                    placeholder="Add a comment..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const content = (e.target as HTMLInputElement).value;
                        if (content.trim()) {
                          addComment.mutate({ postId: post.id, content });
                          (e.target as HTMLInputElement).value = '';
                        }
                      }
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={chatBoardOpen} onOpenChange={setChatBoardOpen}>
        <DialogContent className="max-w-4xl h-[80vh]">
          <DialogHeader>
            <DialogTitle>Social Board</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="following" className="h-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="following">
                <Users className="h-4 w-4 mr-2" />
                Following
              </TabsTrigger>
              <TabsTrigger value="trending">
                <TrendingUp className="h-4 w-4 mr-2" />
                Trending
              </TabsTrigger>
              <TabsTrigger value="all">
                <List className="h-4 w-4 mr-2" />
                All Posts
              </TabsTrigger>
            </TabsList>

            <TabsContent value="following" className="h-full">
              <ScrollArea className="h-[calc(80vh-8rem)]">
                <div className="space-y-4 p-4">
                  {posts?.filter((post: any) => true).map((post: any) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border border-border rounded-lg p-4 space-y-2"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{post.user.username}</p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(post.createdAt), "PPp")}
                          </p>
                        </div>
                        {post.ticker && (
                          <span className="text-sm font-medium text-primary">
                            ${post.ticker}
                          </span>
                        )}
                      </div>
                      <p className="text-sm">{post.content}</p>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="trending" className="h-full">
              <ScrollArea className="h-[calc(80vh-8rem)]">
                <div className="space-y-4 p-4">
                  {posts?.filter((post: any) => post.trending).map((post: any) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border border-border rounded-lg p-4 space-y-2"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{post.user.username}</p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(post.createdAt), "PPp")}
                          </p>
                        </div>
                        {post.ticker && (
                          <span className="text-sm font-medium text-primary">
                            ${post.ticker}
                          </span>
                        )}
                      </div>
                      <p className="text-sm">{post.content}</p>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="all" className="h-full">
              <ScrollArea className="h-[calc(80vh-8rem)]">
                <div className="space-y-4 p-4">
                  {posts?.map((post: any) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border border-border rounded-lg p-4 space-y-2"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{post.user.username}</p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(post.createdAt), "PPp")}
                          </p>
                        </div>
                        {post.ticker && (
                          <span className="text-sm font-medium text-primary">
                            ${post.ticker}
                          </span>
                        )}
                      </div>
                      <p className="text-sm">{post.content}</p>
                      <div className="flex items-center gap-2 pt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => addReaction.mutate({ postId: post.id, type: 'like' })}
                        >
                          <ThumbsUp className={`h-4 w-4 mr-1 ${post.reactions?.some(r => r.type === 'like' && r.userId === user?.id) ? 'text-primary' : ''}`} />
                          {post.reactions?.filter(r => r.type === 'like').length || 0}
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
}