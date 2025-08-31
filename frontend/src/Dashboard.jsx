import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [newBlog, setNewBlog] = useState({ title: "", content: "" });
  const [editingBlog, setEditingBlog] = useState(null);
  const [stats, setStats] = useState({ totalBlogs: 0, totalLikes: 0, totalComments: 0 });
  const [activeTab, setActiveTab] = useState("blogs");
  const [notifications, setNotifications] = useState([]);
  const [profile, setProfile] = useState({ bio: "", avatar: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { username } = location.state || { username: "Guest" };

  useEffect(() => {
    fetchDashboardData();
    fetchNotifications();
    fetchProfile();
  }, [username]);

  const fetchDashboardData = () => {
    setLoading(true);
    axios.post("/api/dashboard", { username })

      .then(res => {
        setUser({ name: username });
        setBlogs(res.data.blogs);
        setStats(res.data.stats);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const fetchNotifications = () => {
    axios.get(`/api/notifications/${username}`)

      .then(res => setNotifications(res.data.notifications))
      .catch(err => console.error(err));
  };

  const fetchProfile = () => {
    axios.get(`/api/profile/${username}`)

      .then(res => setProfile(res.data.profile))
      .catch(err => console.error(err));
  };

  const handleCreateBlog = (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    
  axios.post("/api/blogs", { username, title: newBlog.title, content: newBlog.content })

      .then(res => {
        if (res.data.success) {
          setNewBlog({ title: "", content: "" });
          setMessage("Blog published successfully!");
          fetchDashboardData();
          setActiveTab("blogs");
        } else {
          setMessage("Error: " + res.data.message);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setMessage("Error publishing blog. Please try again.");
        setLoading(false);
      });
  };

  const handleUpdateBlog = (e) => {
    e.preventDefault();
    setLoading(true);
   axios.put(`/api/blogs/${editingBlog.id}`, { title: editingBlog.title, content: editingBlog.content })

      .then(res => {
        setEditingBlog(null);
        fetchDashboardData();
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleDeleteBlog = (id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      setLoading(true);
     axios.delete(`/api/blogs/${id}`)

        .then(res => {
          fetchDashboardData();
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  };

  const handleLikeBlog = (id) => {
 axios.post(`/api/blogs/${id}/like`, { username })

    .then(res => {
      setBlogs(prevBlogs => 
        prevBlogs.map(blog => 
          blog.id === id 
            ? { ...blog, likes: res.data.likes } 
            : blog
        )
      );
      setStats(prevStats => ({
        ...prevStats,
        totalLikes: prevStats.totalLikes + 1
      }));
    })
    .catch(err => console.error(err));
};

  const handleLogout = () => {
    navigate("/");
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    setLoading(true);
    axios.put(`/api/profile/${username}`, profile)

      .then(res => {
        setMessage("Profile updated successfully!");
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setMessage("Error updating profile.");
        setLoading(false);
      });
  };

  const hasUserLiked = (blog) => {
    return blog.likedBy && blog.likedBy.includes(username);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
         MindScribe
        </h1>
        <div className="flex items-center space-x-4">
          <span>Hello, {user?.name}</span>
          <button 
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      {message && (
        <div className={`p-4 mb-6 rounded-lg ${message.includes("Error") ? "bg-red-800" : "bg-green-800"}`}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold mb-2">Total Scribes</h3>
          <p className="text-3xl font-bold text-purple-400">{stats.totalBlogs}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold mb-2">Total Likes</h3>
          <p className="text-3xl font-bold text-pink-400">{stats.totalLikes}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold mb-2">Total Comments</h3>
          <p className="text-3xl font-bold text-blue-400">{stats.totalComments}</p>
        </div>
      </div>

      <div className="flex border-b border-gray-700 mb-6">
        <button 
          className={`px-4 py-2 font-medium ${activeTab === 'blogs' ? 'border-b-2 border-purple-500' : ''}`}
          onClick={() => setActiveTab('blogs')}
        >
          Mind Scribes
        </button>
        <button 
          className={`px-4 py-2 font-medium ${activeTab === 'create' ? 'border-b-2 border-purple-500' : ''}`}
          onClick={() => setActiveTab('create')}
        >
          Create Scribes
        </button>
        <button 
          className={`px-4 py-2 font-medium ${activeTab === 'notifications' ? 'border-b-2 border-purple-500' : ''}`}
          onClick={() => setActiveTab('notifications')}
        >
          Notifications
        </button>
        <button 
          className={`px-4 py-2 font-medium ${activeTab === 'profile' ? 'border-b-2 border-purple-500' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>
      </div>

      {loading && (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      )}

      {activeTab === 'blogs' && !loading && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Your Scribes</h2>
            <span className="text-gray-400">Total: {blogs.length}</span>
          </div>
          {blogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {blogs.map(blog => (
                <div key={blog.id} className="bg-gray-800 p-6 rounded-xl shadow-lg">
                  {editingBlog?.id === blog.id ? (
                    <form onSubmit={handleUpdateBlog} className="space-y-4">
                      <input
                        type="text"
                        value={editingBlog.title}
                        onChange={(e) => setEditingBlog({...editingBlog, title: e.target.value})}
                        className="w-full p-2 bg-gray-700 rounded"
                        required
                      />
                      <textarea
                        value={editingBlog.content}
                        onChange={(e) => setEditingBlog({...editingBlog, content: e.target.value})}
                        className="w-full p-2 bg-gray-700 rounded"
                        rows="4"
                        required
                      />
                      <div className="flex space-x-2">
                        <button type="submit" className="px-4 py-2 bg-green-600 rounded-lg">Save</button>
                        <button 
                          type="button" 
                          onClick={() => setEditingBlog(null)}
                          className="px-4 py-2 bg-gray-600 rounded-lg"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <h3 className="text-xl font-bold mb-2">{blog.title}</h3>
                      <p className="text-gray-300 mb-4">{blog.content}</p>
                      <div className="text-sm text-gray-400 mb-4">
                        Created: {new Date(blog.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex space-x-4">
                          <button 
                            onClick={() => handleLikeBlog(blog.id)}
                            className={`flex items-center space-x-1 ${hasUserLiked(blog) ? 'text-pink-500' : 'text-gray-400 hover:text-pink-400'}`}
                          >
                            <span>{hasUserLiked(blog) ? '❤️' : '🤍'}</span>
                            <span>{blog.likes || 0}</span>
                          </button>
                          <button className="flex items-center space-x-1 text-gray-400 hover:text-blue-400">
                            <span>💬</span>
                            <span>{blog.comments?.length || 0}</span>
                          </button>
                        </div>
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => setEditingBlog(blog)}
                            className="px-3 py-1 bg-blue-600 rounded-lg text-sm"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteBlog(blog.id)}
                            className="px-3 py-1 bg-red-600 rounded-lg text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 mb-4">No Scribes yet. Start writing!</p>
              <button 
                onClick={() => setActiveTab('create')}
                className="px-6 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Create Your First Scribe
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'create' && !loading && (
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6">Create New Blog</h2>
          <form onSubmit={handleCreateBlog} className="space-y-6">
            <div>
              <label className="block mb-2 font-medium">Title</label>
              <input
                type="text"
                value={newBlog.title}
                onChange={(e) => setNewBlog({...newBlog, title: e.target.value})}
                className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
                required
                placeholder="Enter scribe title"
              />
            </div>
            <div>
              <label className="block mb-2 font-medium">Content</label>
              <textarea
                value={newBlog.content}
                onChange={(e) => setNewBlog({...newBlog, content: e.target.value})}
                className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
                rows="6"
                required
                placeholder="Write what's on your mind..."
              />
            </div>
            <button 
              type="submit" 
              className="px-6 py-3 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
              disabled={loading}
            >
              {loading ? "Publishing..." : "Publish Content"}
            </button>
          </form>
        </div>
      )}

      {activeTab === 'notifications' && !loading && (
        <div>
          <h2 className="text-2xl font-semibold mb-6">Notifications</h2>
          {notifications.length > 0 ? (
            <div className="space-y-4">
              {notifications.map(notification => (
                <div key={notification.id} className="p-4 bg-gray-800 rounded-lg">
                  <p>{notification.message}</p>
                  <span className="text-sm text-gray-400">{new Date(notification.timestamp).toLocaleString()}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No notifications yet.</p>
          )}
        </div>
      )}

      {activeTab === 'profile' && !loading && (
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6">Your Profile</h2>
          <form onSubmit={handleProfileUpdate} className="space-y-6">
            <div>
              <label className="block mb-2 font-medium">Username</label>
              <input
                type="text"
                value={username}
                className="w-full p-3 bg-gray-700 rounded-lg"
                disabled
              />
            </div>
            <div>
              <label className="block mb-2 font-medium">Bio</label>
              <textarea
                value={profile.bio}
                onChange={(e) => setProfile({...profile, bio: e.target.value})}
                className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
                rows="4"
                placeholder="Tell us about yourself..."
              />
            </div>
            <div>
              <label className="block mb-2 font-medium">Avatar URL</label>
              <input
                type="text"
                value={profile.avatar}
                onChange={(e) => setProfile({...profile, avatar: e.target.value})}
                className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
                placeholder="https://example.com/avatar.jpg"
              />
            </div>
          
            <button 
              type="submit" 
              className="px-6 py-3 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Profile"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Dashboard;