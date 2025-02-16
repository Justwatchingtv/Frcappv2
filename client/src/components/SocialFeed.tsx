import React, { useState, useEffect } from "react";
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
import { useForm } from "react-hook-form";
import { useUser } from "@/hooks/use-user";
import { format } from "date-fns";
import { 
  MessageSquare, 
  TrendingUp, 
  Users, 
  List, 
  Sparkles,
  Image as ImageIcon,
  LineChart,
  Smile,
  Bold,
  Italic,
  ThumbsUp,
  MessageCircle,
  Share2,
  Bookmark,
  Heart,
  Laugh,
  DollarSign,
  AtSign,
  Hash
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type PostForm = {
  content: string;
  ticker?: string;
  mediaUrl?: string;
};

export function SocialFeed() {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [chatBoardOpen, setChatBoardOpen] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const socket = new WebSocket(`${wsProtocol}//${window.location.hostname}/ws`);

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages((prev) => [...prev, message]);
    };

    socket.onopen = () => {
      console.log('WebSocket Connected');
    };

    setWs(socket);

    return () => {
      socket.close();
    };
  }, []);

  const { data: posts, isLoading } = useQuery({
    queryKey: ["/api/posts"],
  });

  const form = useForm<PostForm>({
    defaultValues: {
      content: "",
      ticker: "",
      mediaUrl: "",
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

  const addReaction = useMutation({
    mutationFn: async ({ postId, reaction }: { postId: number; reaction: string }) => {
      const response = await fetch(`/api/posts/${postId}/react`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ reaction }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
    },
  });

  const handleSubmit = (data: PostForm) => {
    if (data.content.trim()) {
      // Process cashtags and mentions
      const processedContent = data.content
        .replace(/\$([A-Za-z]+)/g, '<cashtag>$1</cashtag>')
        .replace(/@([A-Za-z0-9_]+)/g, '<mention>$1</mention>');

      createPost.mutate({ ...data, content: processedContent });
    }
  };

  const reactions = ["👍", "❤️", "😂", "🚀", "💰", "🤔"];

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

  const renderContent = (content: string) => {
    return content
      .replace(/<cashtag>(.*?)<\/cashtag>/g, '<span class="text-green-500">$$$1</span>')
      .replace(/<mention>(.*?)<\/mention>/g, '<span class="text-blue-500">@$1</span>');
  };

  return (
    <Card className="h-[calc(100vh-2rem)]">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Social Feed</CardTitle>
        <Button variant="outline" size="sm" onClick={() => setChatBoardOpen(true)}>
          <MessageSquare className="h-4 w-4 mr-2" />
          Expand
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border rounded-lg p-4">
          <div className="flex gap-3 mb-2">
            <Avatar>
              <AvatarImage src={user?.image} />
              <AvatarFallback>{user?.username?.[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                placeholder="Share your market insights..."
                className="resize-none min-h-[100px]"
                {...form.register("content")}
              />
              <div className="flex justify-between items-center mt-2">
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => {
                      const content = form.getValues('content');
                      form.setValue('content', content + ' $');
                    }}
                  >
                    <DollarSign className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => {
                      const content = form.getValues('content');
                      form.setValue('content', content + ' @');
                    }}
                  >
                    <AtSign className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => {
                      const content = form.getValues('content');
                      form.setValue('content', content + ' #');
                    }}
                  >
                    <Hash className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  >
                    <Smile className="h-4 w-4" />
                  </Button>
                </div>
                <Button 
                  onClick={() => handleSubmit(form.getValues())}
                  disabled={createPost.isPending}
                >
                  Post
                </Button>
              </div>
            </div>
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-15rem)]">
          <div className="space-y-4">
            <AnimatePresence>
              {posts?.map((post: any) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="border rounded-lg p-4 hover:border-primary/50 transition-all"
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
                      <div 
                        className="mt-2 whitespace-pre-wrap"
                        dangerouslySetInnerHTML={{ __html: renderContent(post.content) }}
                      />
                      {post.mediaUrl && (
                        <img 
                          src={post.mediaUrl} 
                          alt="Post media" 
                          className="mt-2 rounded-lg max-h-[300px] object-cover"
                        />
                      )}
                      <div className="flex flex-wrap gap-2 mt-2">
                        {post.tickers?.map((ticker: string) => (
                          <span key={ticker} className="text-xs bg-secondary px-2 py-1 rounded-full">
                            ${ticker}
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-4 mt-4">
                        <div className="flex gap-1">
                          {reactions.map((reaction) => (
                            <Button
                              key={reaction}
                              variant="ghost"
                              size="sm"
                              className="px-2"
                              onClick={() => addReaction.mutate({ postId: post.id, reaction })}
                            >
                              {reaction}
                              <span className="ml-1 text-xs">
                                {post.reactions?.[reaction] || 0}
                              </span>
                            </Button>
                          ))}
                        </div>
                        <Button variant="ghost" size="sm">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          {post.commentsCount || 0}
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}