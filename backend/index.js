const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let users = [
  { id: 1, username: "Bharanikumar", password: "12345" }
];

let blogs = [
  { 
    id: 1, 
    title: "First Blog", 
    content: "This is my first blog post", 
    author: "Bharanikumar",
    likes: 5,
    comments: ["Great post!"],
    createdAt: new Date()
  },
  { 
    id: 2, 
    title: "Second Blog", 
    content: "Learning React + Express is fun", 
    author: "Bharanikumar",
    likes: 3,
    comments: [],
    createdAt: new Date()
  }
];

let notifications = [
  { 
    id: 1, 
    username: "Bharanikumar", 
    message: "Your blog 'First Blog' received a new like!", 
    timestamp: new Date()
  }
];

let profiles = [
  {
    username: "Bharanikumar",
    bio: "I love writing about technology and programming!",
    avatar: "https://github.com/Bharanikumar-BK"
  }
];


// Login Content 
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    res.json({ success: true, message: "Login successful", user: { username } });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
});

// Signup Content
app.post("/signup", (req, res) => {
  const { username, password } = req.body;

  const existingUser = users.find(u => u.username === username);
  if (existingUser) {
    return res.status(400).json({ success: false, message: "Username already exists" });
  }

  const newUser = { id: users.length + 1, username, password };
  users.push(newUser);
  profiles.push({ username, bio: "", avatar: "" });

  res.json({ success: true, message: "Signup successful", user: { username } });
});

//Dashboard here
app.post("/dashboard", (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ success: false, message: "Username is required" });
  }

  const userBlogs = blogs.filter(blog => blog.author === username);
  const totalLikes = userBlogs.reduce((sum, b) => sum + b.likes, 0);
  const totalComments = userBlogs.reduce((sum, b) => sum + b.comments.length, 0);

  res.json({
    success: true,
    message: `Welcome ${username}`,
    user: { username },
    blogs: userBlogs,
    stats: {
      totalBlogs: userBlogs.length,
      totalLikes,
      totalComments
    }
  });
});


app.post("/blogs", (req, res) => {
  const { username, title, content } = req.body;

  const newBlog = {
    id: blogs.length + 1,
    title,
    content,
    author: username,
    likes: 0,
    comments: [],
    createdAt: new Date()
  };

  blogs.push(newBlog);
  notifications.push({
    id: notifications.length + 1,
    username,
    message: `Your blog "${title}" was published successfully!`,
    timestamp: new Date()
  });

  res.json({ success: true, message: "Blog created successfully", blog: newBlog });
});

app.put("/blogs/:id", (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  const blog = blogs.find(b => b.id == id);
  if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });

  blog.title = title;
  blog.content = content;

  res.json({ success: true, message: "Blog updated", blog });
});

app.delete("/blogs/:id", (req, res) => {
  const { id } = req.params;
  blogs = blogs.filter(b => b.id != id);
  res.json({ success: true, message: "Blog deleted" });
});

app.post("/blogs/:id/like", (req, res) => {
  const { id } = req.params;
  const blog = blogs.find(b => b.id == id);

  if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });

  blog.likes++;
  res.json({ success: true, message: "Blog liked", likes: blog.likes });
});

// Notification
app.get("/notifications/:username", (req, res) => {
  const { username } = req.params;
  const userNotes = notifications.filter(n => n.username === username);
  res.json({ success: true, notifications: userNotes });
});

app.get("/profile/:username", (req, res) => {
  const { username } = req.params;
  const profile = profiles.find(p => p.username === username) || { username, bio: "", avatar: "" };
  res.json({ success: true, profile });
});

app.put("/profile/:username", (req, res) => {
  const { username } = req.params;
  const { bio, avatar } = req.body;

  let profile = profiles.find(p => p.username === username);
  if (profile) {
    profile.bio = bio;
    profile.avatar = avatar;
  } else {
    profiles.push({ username, bio, avatar });
  }

  res.json({ success: true, message: "Profile updated" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
