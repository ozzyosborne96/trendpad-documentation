import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Avatar,
  IconButton,
  Divider,
} from "@mui/material";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";

const DiscussionForum = () => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const handlePost = () => {
    if (newComment.trim() === "") return;

    const commentObj = {
      id: Date.now(),
      user: "User" + Math.floor(Math.random() * 1000),
      content: newComment,
      timestamp: new Date().toLocaleString(),
      likes: 0,
    };

    setComments([commentObj, ...comments]);
    setNewComment("");
  };

  const handleLike = (id) => {
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === id ? { ...comment, likes: comment.likes + 1 } : comment
      )
    );
  };

  return (
    <Paper
      sx={{
        p: 3,
        mt: 4,
        backgroundColor: "transparent",
        border: "1px solid #333",
        borderRadius: 2,
      }}
    >
      <Typography variant="h6" color="#fff" mb={2}>
        💬 Discussion
      </Typography>

      {/* Input Field */}
      <Box sx={{ display: "flex", flexDirection: "column", mb: 3 }}>
        <TextField
          multiline
          rows={3}
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          sx={{
            backgroundColor: "#fff",
            borderRadius: 1,
            mb: 1,
          }}
        />
        <Box textAlign="right">
          <Button variant="contained" onClick={handlePost}>
            Post
          </Button>
        </Box>
      </Box>

      <Divider sx={{ borderColor: "#444", mb: 2 }} />

      {/* Comments */}
      {comments.length === 0 ? (
        <Typography color="#aaa">No comments yet. Be the first!</Typography>
      ) : (
        comments.map((comment) => (
          <Box
            key={comment.id}
            sx={{
              mb: 3,
              p: 2,
              backgroundColor: "#1e1e24",
              borderRadius: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Avatar sx={{ width: 32, height: 32, mr: 1 }} />
              <Typography sx={{ color: "#fff", fontWeight: 500 }}>
                {comment.user}
              </Typography>
              <Typography sx={{ color: "#888", ml: 2, fontSize: "0.8rem" }}>
                {comment.timestamp}
              </Typography>
            </Box>
            <Typography sx={{ color: "#ddd", mb: 1 }}>
              {comment.content}
            </Typography>
            <IconButton onClick={() => handleLike(comment.id)} size="small">
              <ThumbUpAltIcon fontSize="small" sx={{ color: "#ff9800" }} />
              <Typography sx={{ color: "#fff", ml: 0.5 }}>
                {comment.likes}
              </Typography>
            </IconButton>
          </Box>
        ))
      )}
    </Paper>
  );
};

export default DiscussionForum;
