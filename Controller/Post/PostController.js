const PostModel = require('../../Model/post/PostModel');
const uploadOnCloudinary = require('../../config/cloud');
const moment = require("moment");
const CreatePost = async (req, res) => {
    try {

        if (!req.files || !req.files.thumbnail || !req.files.images) {
            throw new Error('File upload failed');
        }

        const thumbnailResponse = await uploadOnCloudinary(req.files?.thumbnail[0]?.path);
        const imagePromises = req.files?.images?.map(file => uploadOnCloudinary(file.path));
        const imageResponses = await Promise.all(imagePromises);

        const { title, body, latitude, longitude } = req.body;
        const userId = req.user?._id;

        const newPost = new PostModel({
            title,
            body,
            createdBy: userId,
            location: { latitude, longitude },
            thumbnail: thumbnailResponse?.url,
            images: imageResponses.map(file => file.url),
        });

        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ error: "Failed to create post", details: error.message });
    }
};

const GetAll = async (req, res) => {
    try {
        const Data = await PostModel.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'createdBy',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            { $unwind: '$user' },
            {
                $addFields: {
                    likeCount: { $size: "$likes" }
                }
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    body: 1,
                    thumbnail: 1,
                    images: 1,
                    isActive: 1,
                    likes: 1,
                    likeCount: 1,
                    comments: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    location: 1,
                    'user.username': 1,
                    'user.fullname': 1,
                    'user.avatar': 1,
                }
            },
            {
                $sort: { createdAt: -1 }
            }
        ]);
        res.status(200).json(Data);
    } catch (error) {
        res.status(500).json({ error: "Error fetching data" });
    }
};


const GetByID = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await PostModel.findById(id)
            .populate({
                path: "createdBy",
                select: "username avatar",
            })
            .populate({
                path: 'likes',
                select: 'username avatar'
            })
            .populate({
                path: 'comments.user',
                select: 'username avatar'
            });

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ error: "Failed to show post", details: error.message });
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
        const totalCount = await PostModel.countDocuments({}); 

        res.status(200).json({ activeCount, inactiveCount, totalCount });
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve post counts", details: error.message });
    }
};


const likePost = async (req, res) => {
    try {
        const userId = req.user?._id;

        const post = await PostModel.findOneAndUpdate(
            { _id: req.params.id, likes: { $ne: userId } },
            { $addToSet: { likes: userId } },
            { new: true }
        );

        if (post) {
            res.status(200).json('Post liked');
        } else {
            await PostModel.findOneAndUpdate(
                { _id: req.params.id },
                { $pull: { likes: userId } },
                { new: true }
            );
            res.status(200).json('Post unliked');
        }
    } catch (error) {
        res.status(500).json(error.message);
    }
};

const commentPost = async (req, res) => {
    try {
        const post = await PostModel.findById(req.params.id);
        const userId = req.user?._id;
        const { comment } = req.body;

        if (!post) {
            return res.status(404).json('Post not found');
        }

        post.comments.push({ user: userId, comment });
        await post.save();
        res.status(200).json('Comment added');
    } catch (error) {
        res.status(500).json(error.message);
    }
};

const GetPostCountsPerDate = async (req, res) => {
    try {
        const postCountsPerDate = await PostModel.aggregate([
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%d-%m-%Y", date: "$createdAt" }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { "_id": 1 } 
            }
        ]);

        res.status(200).json(postCountsPerDate);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve post counts per date", details: error.message });
    }
};

const GetLikesAndCommentsCount = async (req, res) => {
    try {
        const result = await PostModel.aggregate([
            {
                $group: {
                    _id: null, 
                    totalLikes: { $sum: { $size: "$likes" } },
                    totalComments: { $sum: { $size: "$comments" } }
                }
            }
        ]);

        const totalLikes = result.length > 0 ? result[0].totalLikes : 0;
        const totalComments = result.length > 0 ? result[0].totalComments : 0;

        res.status(200).json({ totalLikes, totalComments });
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve likes and comments counts", details: error.message });
    }
};
module.exports = { CreatePost, GetAll, GetByID, Update, Delete, FilterByLocation, GetPostCounts, likePost, commentPost ,GetPostCountsPerDate,GetLikesAndCommentsCount};
