const UserModel = require("../models/user.model");
const fs = require("fs");
const { promisify } = require("util");
const { uploadErrors } = require("../utils/errors.utils");



module.exports.uploadProfil = async (req, res) => {
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


    console.log(req.file);
    const path = "./" + req.file.path;
    const fileNameDes = req.file.destination + "" + req.body.name + ".jpg";
    var fileName = "uploads/profil/" + req.body.name + ".jpg";
    console.log(path);

    fs.rename(path, fileNameDes, (err, docs) => {
        if (err) console.log(err)
        else console.log(docs);
    })

    await UserModel.findByIdAndUpdate(
        req.body.userId,
        { $set: { picture: fileName } },
        { new: true, upsert: true, setDefaultsOnInsert: true }
    ).then((docs) => {
        return res.status(201).send(docs);
    }).catch((err) => res.status(200).send({ message: err }));
};

