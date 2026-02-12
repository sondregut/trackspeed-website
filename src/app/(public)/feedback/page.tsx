"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface FeedbackPost {
  id: string;
  title: string;
  description: string | null;
  category: "feature" | "bug" | "improvement";
  status: "open" | "planned" | "in_progress" | "completed";
  author_name: string | null;
  vote_count: number;
  comment_count: number;
  created_at: string;
}

interface Comment {
  id: string;
  post_id: string;
  author_name: string;
  content: string;
  is_admin: boolean;
  created_at: string;
}

const categories = [
  { value: "all", label: "All" },
  { value: "feature", label: "Features" },
  { value: "bug", label: "Bugs" },
  { value: "improvement", label: "Improvements" },
] as const;

const categoryColors: Record<string, string> = {
  feature: "bg-[#5C8DB8]/10 text-[#5C8DB8] border-[#5C8DB8]/20",
  bug: "bg-red-50 text-red-600 border-red-200",
  improvement: "bg-amber-50 text-amber-600 border-amber-200",
};

const statusColors: Record<string, string> = {
  open: "bg-gray-100 text-gray-600 border-gray-200",
  planned: "bg-[#5C8DB8]/10 text-[#5C8DB8] border-[#5C8DB8]/20",
  in_progress: "bg-amber-50 text-amber-600 border-amber-200",
  completed: "bg-green-50 text-green-600 border-green-200",
};

const statusLabels: Record<string, string> = {
  open: "Open",
  planned: "Planned",
  in_progress: "In Progress",
  completed: "Completed",
};

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

export default function FeedbackPage() {
  const [posts, setPosts] = useState<FeedbackPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [votedPosts, setVotedPosts] = useState<Set<string>>(new Set());
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [loadingComments, setLoadingComments] = useState<string | null>(null);
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);

  // Submit form state
  const [submitTitle, setSubmitTitle] = useState("");
  const [submitDescription, setSubmitDescription] = useState("");
  const [submitCategory, setSubmitCategory] = useState("feature");
  const [submitName, setSubmitName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Comment form state
  const [commentText, setCommentText] = useState("");
  const [commentName, setCommentName] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeCategory !== "all") params.set("category", activeCategory);
      const res = await fetch(`/api/feedback?${params}`);
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    } finally {
      setLoading(false);
    }
  }, [activeCategory]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    const stored = localStorage.getItem("feedback-votes");
    if (stored) {
      try {
        setVotedPosts(new Set(JSON.parse(stored)));
      } catch { /* ignore invalid data */ }
    }
  }, []);

  const saveVotedPosts = (newSet: Set<string>) => {
    setVotedPosts(newSet);
    localStorage.setItem("feedback-votes", JSON.stringify([...newSet]));
  };

  const handleVote = async (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (votedPosts.has(postId)) return;

    // Optimistic update
    const newVoted = new Set(votedPosts);
    newVoted.add(postId);
    saveVotedPosts(newVoted);
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, vote_count: p.vote_count + 1 } : p
      )
    );

    try {
      const res = await fetch(`/api/feedback/${postId}/vote`, { method: "POST" });
      if (!res.ok) {
        // Revert on failure
        const reverted = new Set(votedPosts);
        saveVotedPosts(reverted);
        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId ? { ...p, vote_count: p.vote_count - 1 } : p
          )
        );
      }
    } catch {
      // Revert on error
      const reverted = new Set(votedPosts);
      saveVotedPosts(reverted);
    }
  };

  const handleSubmit = async () => {
    if (!submitTitle.trim()) return;
    setSubmitting(true);

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: submitTitle,
          description: submitDescription,
          category: submitCategory,
          author_name: submitName,
        }),
      });

      if (res.ok) {
        setSubmitTitle("");
        setSubmitDescription("");
        setSubmitCategory("feature");
        setSubmitName("");
        setSubmitDialogOpen(false);
        fetchPosts();
      }
    } catch (err) {
      console.error("Failed to submit:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const fetchComments = async (postId: string) => {
    setLoadingComments(postId);
    try {
      const res = await fetch(`/api/feedback/${postId}/comments`);
      if (res.ok) {
        const data = await res.json();
        setComments((prev) => ({ ...prev, [postId]: data }));
      }
    } catch (err) {
      console.error("Failed to fetch comments:", err);
    } finally {
      setLoadingComments(null);
    }
  };

  const toggleExpand = (postId: string) => {
    if (expandedPost === postId) {
      setExpandedPost(null);
    } else {
      setExpandedPost(postId);
      if (!comments[postId]) {
        fetchComments(postId);
      }
    }
  };

  const handleComment = async (postId: string) => {
    if (!commentText.trim()) return;
    setSubmittingComment(true);

    try {
      const res = await fetch(`/api/feedback/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: commentText,
          author_name: commentName,
        }),
      });

      if (res.ok) {
        const newComment = await res.json();
        setComments((prev) => ({
          ...prev,
          [postId]: [...(prev[postId] || []), newComment],
        }));
        // Update comment count in posts
        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId ? { ...p, comment_count: p.comment_count + 1 } : p
          )
        );
        setCommentText("");
        setCommentName("");
      }
    } catch (err) {
      console.error("Failed to comment:", err);
    } finally {
      setSubmittingComment(false);
    }
  };

  return (
    <div className="pt-24 pb-16 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1
              className="text-3xl md:text-4xl font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              Feature Requests & Feedback
            </h1>
            <p
              className="mt-2 text-base"
              style={{ color: "var(--text-muted)" }}
            >
              Vote on ideas you want to see, or suggest your own.
            </p>
          </div>
          <Dialog open={submitDialogOpen} onOpenChange={setSubmitDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="shrink-0 text-white rounded-lg"
                style={{ backgroundColor: "#5C8DB8" }}
              >
                <svg
                  className="w-4 h-4 mr-1.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
                Submit Idea
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Submit an Idea</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-2">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="A short, descriptive title"
                    value={submitTitle}
                    onChange={(e) => setSubmitTitle(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Explain what you'd like and why it would be useful..."
                    value={submitDescription}
                    onChange={(e) => setSubmitDescription(e.target.value)}
                    rows={4}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    value={submitCategory}
                    onChange={(e) => setSubmitCategory(e.target.value)}
                    className="mt-1 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="feature">Feature Request</option>
                    <option value="bug">Bug Report</option>
                    <option value="improvement">Improvement</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="name">Your Name (optional)</Label>
                  <Input
                    id="name"
                    placeholder="Anonymous"
                    value={submitName}
                    onChange={(e) => setSubmitName(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <Button
                  onClick={handleSubmit}
                  disabled={!submitTitle.trim() || submitting}
                  className="w-full text-white"
                  style={{ backgroundColor: "#5C8DB8" }}
                >
                  {submitting ? "Submitting..." : "Submit"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Category Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                activeCategory === cat.value
                  ? "text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              style={
                activeCategory === cat.value
                  ? { backgroundColor: "#5C8DB8" }
                  : { backgroundColor: "transparent" }
              }
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Posts List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="card-feature animate-pulse"
                style={{ padding: "1.5rem" }}
              >
                <div className="flex gap-4">
                  <div className="w-12 h-16 bg-gray-100 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <div className="h-5 bg-gray-100 rounded w-2/3" />
                    <div className="h-4 bg-gray-100 rounded w-full" />
                    <div className="h-4 bg-gray-100 rounded w-1/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="card-feature text-center py-12">
            <svg
              className="w-12 h-12 mx-auto mb-4"
              style={{ color: "var(--text-muted)" }}
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
              />
            </svg>
            <p
              className="text-lg font-medium"
              style={{ color: "var(--text-primary)" }}
            >
              No ideas yet
            </p>
            <p className="mt-1" style={{ color: "var(--text-muted)" }}>
              Be the first to submit a feature request!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map((post) => (
              <div key={post.id}>
                <div
                  className="card-feature cursor-pointer"
                  style={{ padding: "1.25rem 1.5rem" }}
                  onClick={() => toggleExpand(post.id)}
                >
                  <div className="flex gap-4">
                    {/* Vote button */}
                    <button
                      onClick={(e) => handleVote(post.id, e)}
                      className={`flex flex-col items-center justify-center min-w-[3rem] py-2 rounded-lg border transition-colors ${
                        votedPosts.has(post.id)
                          ? "border-[#5C8DB8]/30 bg-[#5C8DB8]/5"
                          : "border-gray-200 hover:border-[#5C8DB8]/30 hover:bg-[#5C8DB8]/5"
                      }`}
                    >
                      <svg
                        className="w-4 h-4 mb-0.5"
                        viewBox="0 0 24 24"
                        fill={votedPosts.has(post.id) ? "#5C8DB8" : "none"}
                        stroke={votedPosts.has(post.id) ? "#5C8DB8" : "#9CA3AF"}
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.5 15.75l7.5-7.5 7.5 7.5"
                        />
                      </svg>
                      <span
                        className="text-sm font-semibold"
                        style={{
                          color: votedPosts.has(post.id) ? "#5C8DB8" : "var(--text-muted)",
                        }}
                      >
                        {post.vote_count}
                      </span>
                    </button>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2 flex-wrap">
                        <h3
                          className="text-base font-semibold"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {post.title}
                        </h3>
                        <div className="flex gap-1.5 flex-wrap">
                          <Badge
                            variant="outline"
                            className={`text-[10px] px-1.5 py-0 ${categoryColors[post.category]}`}
                          >
                            {post.category}
                          </Badge>
                          {post.status !== "open" && (
                            <Badge
                              variant="outline"
                              className={`text-[10px] px-1.5 py-0 ${statusColors[post.status]}`}
                            >
                              {statusLabels[post.status]}
                            </Badge>
                          )}
                        </div>
                      </div>
                      {post.description && (
                        <p
                          className="mt-1 text-sm line-clamp-2"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {post.description}
                        </p>
                      )}
                      <div
                        className="mt-2 flex items-center gap-3 text-xs"
                        style={{ color: "var(--text-muted)" }}
                      >
                        <span>{post.author_name || "Anonymous"}</span>
                        <span>-</span>
                        <span>{timeAgo(post.created_at)}</span>
                        {post.comment_count > 0 && (
                          <>
                            <span>-</span>
                            <span className="flex items-center gap-1">
                              <svg
                                className="w-3.5 h-3.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
                                />
                              </svg>
                              {post.comment_count}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Expand indicator */}
                    <svg
                      className={`w-5 h-5 shrink-0 mt-1 transition-transform ${
                        expandedPost === post.id ? "rotate-180" : ""
                      }`}
                      style={{ color: "var(--text-muted)" }}
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m19.5 8.25-7.5 7.5-7.5-7.5"
                      />
                    </svg>
                  </div>
                </div>

                {/* Expanded comments section */}
                {expandedPost === post.id && (
                  <div
                    className="border border-t-0 rounded-b-xl px-6 py-4"
                    style={{ borderColor: "var(--border-light)" }}
                  >
                    {/* Comments list */}
                    {loadingComments === post.id ? (
                      <div
                        className="text-sm py-4 text-center"
                        style={{ color: "var(--text-muted)" }}
                      >
                        Loading comments...
                      </div>
                    ) : (comments[post.id] ?? []).length > 0 ? (
                      <div className="space-y-3 mb-4">
                        {(comments[post.id] ?? []).map((comment) => (
                          <div
                            key={comment.id}
                            className="flex gap-3"
                          >
                            <div
                              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium shrink-0"
                              style={{
                                backgroundColor: comment.is_admin
                                  ? "#5C8DB8"
                                  : "#F3F4F6",
                                color: comment.is_admin ? "#fff" : "var(--text-muted)",
                              }}
                            >
                              {(comment.author_name || "A")[0].toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span
                                  className="text-sm font-medium"
                                  style={{ color: "var(--text-primary)" }}
                                >
                                  {comment.author_name}
                                </span>
                                {comment.is_admin && (
                                  <Badge
                                    className="text-[10px] px-1.5 py-0 bg-[#5C8DB8] text-white border-transparent"
                                  >
                                    Team
                                  </Badge>
                                )}
                                <span
                                  className="text-xs"
                                  style={{ color: "var(--text-muted)" }}
                                >
                                  {timeAgo(comment.created_at)}
                                </span>
                              </div>
                              <p
                                className="text-sm mt-0.5"
                                style={{ color: "var(--text-secondary)" }}
                              >
                                {comment.content}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p
                        className="text-sm py-2 mb-3"
                        style={{ color: "var(--text-muted)" }}
                      >
                        No comments yet. Be the first to share your thoughts!
                      </p>
                    )}

                    {/* Add comment form */}
                    <div
                      className="pt-3"
                      style={{ borderTop: "1px solid var(--border-light)" }}
                    >
                      <div className="flex gap-2 mb-2">
                        <Input
                          placeholder="Your name (optional)"
                          value={commentName}
                          onChange={(e) => setCommentName(e.target.value)}
                          className="max-w-[200px] h-8 text-sm"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add a comment..."
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          className="h-8 text-sm"
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && commentText.trim()) {
                              handleComment(post.id);
                            }
                          }}
                        />
                        <Button
                          size="sm"
                          onClick={() => handleComment(post.id)}
                          disabled={!commentText.trim() || submittingComment}
                          className="text-white h-8 px-3"
                          style={{ backgroundColor: "#5C8DB8" }}
                        >
                          {submittingComment ? "..." : "Post"}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
