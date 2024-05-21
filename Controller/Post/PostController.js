const PostModel = require('../../Model/post/PostModel');


const CreatePost = async (req, res) => {

    //    console.log(object,"req.body")
    //     return
    try {
        const { title, body, latitude, longitude } = req.body;
        const userId = req.user?._id;

        const newPost = new PostModel({
            title,
            body,
            createdBy: userId,
            location: { latitude, longitude }
        });

        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ error: "Failed to create post", details: error.message });
    }
};

const GetByID = async (req, res) => {
    try {
        const posts = await PostModel.find({ createdBy: req.user._id });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: "Failed to show posts", details: error.message });
    }
};

const Update = async (req, res) => {

    try {
        const { postId } = req.params;
        const { title, body, latitude, longitude, isActive } = req.body;

        const post = await PostModel.findOne({ _id: postId, createdBy: req.user._id });
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        post.title = title || post.title;
        post.body = body || post.body;
        post.location = { latitude: latitude || post.location.latitude, longitude: longitude || post.location.longitude };
        post.isActive = isActive !== undefined ? isActive : post.isActive;

        await post.save();
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ error: "Failed to update post", details: error.message });
    }
};

const Delete = async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await PostModel.findOneAndDelete({ _id: postId, createdBy: req.user._id });
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete post", details: error.message });
    }
};

const FilterByLocation = async (req, res) => {

    //    console.log(object,"req.body")
    //     return
    try {
        const { latitude, longitude } = req.body;
        if (!latitude || !longitude) {
            return res.status(400).json({ error: "Latitude and longitude are required" });
        }

        const query = {
            'location.latitude': parseFloat(latitude),
            'location.longitude': parseFloat(longitude)
        };
        const posts = await PostModel.find(query);

        if (posts.length === 0) {
            res.status(200).json({ posts: [] });
            return;
        }

        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve posts by location", details: error.message });
    }
};

const GetPostCounts = async (req, res) => {
    try {
        const activeCount = await PostModel.countDocuments({ isActive: true });
        const inactiveCount = await PostModel.countDocuments({ isActive: false });

        res.status(200).json({ activeCount, inactiveCount });
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve post counts", details: error.message });
    }
};

module.exports = { CreatePost, GetByID, Update, Delete, FilterByLocation,GetPostCounts };
