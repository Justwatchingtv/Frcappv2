
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
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
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { useUser } from "@/hooks/use-user";
import { format } from "date-fns";
import { 
  MessageSquare, 
  TrendingUp, 
  Users, 
  List, 
  Sparkles,
  Image,
  LineChart,
  MapPin,
  Smile,
  Bold,
  Italic,
  ThumbsUp,
  MessageCircle,
  Repeat2,
  Bookmark
} from "lucide-react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

  const { toast } = useToast();
  
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
      toast({
        title: "Success",
        description: "Your post was published successfully!",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
      console.error("Failed to create post:", error);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const content = form.getValues("content");
    if (content.trim()) {
      createPost.mutate({ content });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Social Feed</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <MessageSquare className="h-8 w-8 animate-spin" />
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
          <div className="border rounded-lg p-4">
            <div className="flex gap-3 mb-2">
              <Avatar>
                <AvatarImage src={user?.image} />
                <AvatarFallback>{user?.username?.[0]}</AvatarFallback>
              </Avatar>
              <Textarea
                placeholder="What's happening in the markets?"
                className="resize-none"
                {...form.register("content")}
              />
            </div>
            <div className="flex justify-between items-center mt-2">
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => document.getElementById('imageUpload')?.click()}
                >
                  <Image className="h-4 w-4" />
                </Button>
                <input 
                  type="file" 
                  id="imageUpload" 
                  className="hidden" 
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      // Handle image upload
                      console.log('Image selected:', file);
                    }
                  }}
                />
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => {
                    const text = form.getValues('content');
                    form.setValue('content', `${text} $`);
                  }}
                >
                  <LineChart className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => {
                    const text = form.getValues('content');
                    form.setValue('content', text + ' 😊');
                  }}
                >
                  <Smile className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => {
                    const text = form.getValues('content');
                    form.setValue('content', `**${text}**`);
                  }}
                >
                  <Bold className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => {
                    const text = form.getValues('content');
                    form.setValue('content', `*${text}*`);
                  }}
                >
                  <Italic className="h-4 w-4" />
                </Button>
              </div>
              <Button 
                onClick={form.handleSubmit((data) => createPost.mutate(data))}
                disabled={createPost.isPending}
              >
                Post
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {posts?.map((post: any) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border rounded-lg p-4 space-y-2"
              >
                <div className="flex gap-3">
                  <Avatar>
                    <AvatarImage src={post.user.image} />
                    <AvatarFallback>{post.user.username[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{post.user.username}</span>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(post.createdAt), "PPp")}
                      </span>
                    </div>
                    <p className="mt-2">{post.content}</p>
                    <div className="flex gap-4 mt-4">
                      <Button variant="ghost" size="sm">
                        <ThumbsUp className="h-4 w-4 mr-2" />
                        Like
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Comment
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Repeat2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Bookmark className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
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
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="following">
                <Users className="h-4 w-4 mr-2" />
                Following
              </TabsTrigger>
              <TabsTrigger value="watchlist">
                <List className="h-4 w-4 mr-2" />
                Watchlist
              </TabsTrigger>
              <TabsTrigger value="trending">
                <TrendingUp className="h-4 w-4 mr-2" />
                Trending
              </TabsTrigger>
              <TabsTrigger value="suggested">
                <Sparkles className="h-4 w-4 mr-2" />
                For You
              </TabsTrigger>
            </TabsList>

            <TabsContent value="following" className="h-full">
              <ScrollArea className="h-[calc(80vh-8rem)]">
                <div className="space-y-4 p-4">
                  {posts?.map((post: any) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border rounded-lg p-4 space-y-2"
                    >
                      <div className="flex gap-3">
                        <Avatar>
                          <AvatarImage src={post.user.image} />
                          <AvatarFallback>{post.user.username[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{post.user.username}</span>
                            <span className="text-sm text-muted-foreground">
                              {format(new Date(post.createdAt), "PPp")}
                            </span>
                          </div>
                          <p className="mt-2">{post.content}</p>
                          <div className="flex gap-4 mt-4">
                            <Button variant="ghost" size="sm">
                              <ThumbsUp className="h-4 w-4 mr-2" />
                              Like
                            </Button>
                            <Button variant="ghost" size="sm">
                              <MessageCircle className="h-4 w-4 mr-2" />
                              Comment
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Repeat2 className="h-4 w-4 mr-2" />
                              Share
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Bookmark className="h-4 w-4 mr-2" />
                              Save
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="watchlist" className="h-full">
              <ScrollArea className="h-[calc(80vh-8rem)]">
                <div className="space-y-4 p-4">
                  <div className="text-center text-muted-foreground">
                    Posts from your paper trading watchlist will appear here
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="trending" className="h-full">
              <ScrollArea className="h-[calc(80vh-8rem)]">
                <div className="space-y-4 p-4">
                  <div className="text-center text-muted-foreground">
                    Posts about trending stocks will appear here
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="suggested" className="h-full">
              <ScrollArea className="h-[calc(80vh-8rem)]">
                <div className="space-y-4 p-4">
                  <div className="text-center text-muted-foreground">
                    Personalized post suggestions based on your activity will appear here
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
}
