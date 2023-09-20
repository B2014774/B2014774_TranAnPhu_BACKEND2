const express = require("express");
const cors = require("cors");
const ApiError = require("./app/api-error");

const app = express();
const contactsRouter = require("./app/routes/contact.route");

app.use(cors());
app.use(express.json());

app.get ("/", (req,res) => {
    res.json({message: "Welcome to contact book application."});
});

app.use("/api/contacts", contactsRouter);

//handle 404 response
app.use((req,res,next) => {
    //Code se chay khi khong co router duoc dinh nghia
    return next(new ApiError(404, "Resource not found"));
});

//define error-handling middleware last, after other app.use() and routes calls
app.use((err,req,res,next) => {
    //Middleware xu ly loi tap trung
    // Trong cac doan code xu ly cac route, goi next(error)
    // Se chuyen ve middleware xu ly loi nay
   return res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
   });
});

module.exports = app;