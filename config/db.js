const url = "mongodb://localhost:27017/mern-project";
// const url =
// "mongodb+srv://moustaphakhouma964:zP8kFpa4ScC33v5L@mydata.9wncuz2.mongodb.net/parlons-de-nous";
const mongoose = require("mongoose");

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true,
    // useFindAndModify: false
  })
  .then(() => console.log("connected to mongo db"))
  .catch((err) => console.log("Failed to connect to mongo " + err));
