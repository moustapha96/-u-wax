const PostModel = require("../models/post.model");
const ObjectID = require("mongoose").Types.ObjectId;
const UserModel = require("../models/user.model");

const fs = require("fs");
const { promisify } = require("util");
const { uploadErrors } = require("../utils/errors.utils");


module.exports.getAllPost = (req, res) => {
    PostModel.find((err, docs) => {
        if (!err) return res.status(200).json(docs);
        else console.log("erreur load data : " + err)
    }).sort({ createdAt: -1 });
}
module.exports.create = async (req, res) => {
    if (req.file !== null) {
        try {
            if (
                req.file.mimetype != "image/jpg" &&
                req.file.mimetype != "image/png" &&
                req.file.mimetype != "image/jpeg"
            )
                throw Error("invalid file");
            if (req.file.size > 500000) throw Error("max size");
        } catch (err) {
            const errors = uploadErrors(err);
            return res.status(201).json({ errors });
        }

        const path = "./" + req.file.path;
        var fileName = "./uploads/posts/"+req.body.posterId +  Date.now() + ".jpg";
        console.log(path);

        fs.rename(path, fileName, (err, docs) => {
            if (err) console.log(err)
            else console.log(docs);
        })


    }


    if (!ObjectID.isValid(req.body.posterId))
        return res.status(400).send("ID unknown : " + req.body.posterId);

    const newPost = new PostModel({
        posterId: req.body.posterId,
        message: req.body.message,
        video: req.body.video,
        picture: req.file != null ? fileName : '',
        likers: [],
        comments: []
    });
    try {
        const posts = await newPost.save();
        return res.status(201).json(posts);
    } catch (error) {
        return res.status(400).send({ message: error });
    }
}


module.exports.update = async (req, res) => {

    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID unknown : " + req.params.id);

    PostModel.findOneAndUpdate(
        req.params.id, {
        $set: { message: req.body.message }
    }, { new: true },
        (err, docs) => {
            if (!err) return res.status(200).json(docs);
            else return res.status(200).json({ message: err });
        }
    );
}

module.exports.delete = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID unknown : " + req.params.id);
    PostModel.findByIdAndRemove(req.params.id, (err, docs) => {

        if (!err) return res.send(docs);
        else return res.status(400).send({ message: err });
    })
}

module.exports.info = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID unknown : " + req.params.id);

    PostModel.findById(req.params.id, (err, docs) => {
        if (!err) res.send(docs);
        else console.log("ID unknown" + err);
    });
}


module.exports.likePost = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID unknown : " + req.params.id);

    try {
        await PostModel.findOneAndUpdate(
            { _id: req.params.id },
            {
                $addToSet: { likers: req.body.id },
            },
            { new: true },

        );
        await UserModel.findOneAndUpdate(
            { _id: req.body.id },
            {
                $addToSet: { likes: req.params.id },
            },
            { new: true },
        );

        return res.status(200).send({ message: "like reussie" });
    } catch (err) {
        return res.status(400).send(err);
    }
};

module.exports.unlikePost = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID unknown : " + req.params.id);

    try {
        await PostModel.findOneAndUpdate(
            { _id: req.params.id },
            {
                $pull: { likers: req.body.id },
            },
            { new: true },


        );
        await UserModel.findOneAndUpdate(
            { _id: req.body.id },
            {
                $pull: { likes: req.params.id },
            },
            { new: true },
        );

        return res.status(200).send({ message: "unlike reussie" });
    } catch (err) {
        return res.status(400).send(err);
    }

}


//parti des commenctaires

module.exports.commentPost = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID unknown : " + req.params.id);
    await PostModel.findOneAndUpdate({ _id: req.params.id },
        {
            $push: {
                comments: {
                    commenterId: req.body.commenterId,
                    commenterPseudo: req.body.commenterPseudo,
                    text: req.body.text,
                    timestamp: new Date().getTime()
                }
            },
        },
        { new: true })

        .then(r => {
            return res.status(201).json(r);
        })
        .catch(err => { return res.status(400).send({ message: err }); })
}


module.exports.editCommentPost = (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID unknown : " + req.params.id);

    try {
        return PostModel.findById(req.params.id, (err, docs) => {
            const theComment = docs.comments.find((comment) =>
                comment._id.equals(req.body.commentId)
            );
            if (!theComment) return res.status(404).send("Comment not found");
            theComment.text = req.body.text;
            return docs.save((err) => {
                if (!err) return res.status(200).send(docs);
                return res.status(500).send(err);
            });
        });
    } catch (err) {
        return res.status(400).send(err);
    }
};


module.exports.deleteCommentPost = (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID unknown : " + req.params.id);

    try {
        return PostModel.findByIdAndUpdate(
            req.params.id,
            {
                $pull: {
                    comments: {
                        _id: req.body.commentId,
                    },
                },
            },
            { new: true },
            (err, docs) => {
                if (!err) return res.send(docs);
                else return res.status(400).send(err);
            }
        );
    } catch (err) {
        return res.status(400).send(err);
    }
};
