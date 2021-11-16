//jshint esversion:6

// setup - mongoose, ejs, express
const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();

mongoose.connect("mongodb://localhost:27017/wikiDB");
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

//Schema
const articleSchema = {
	title: String,
	content: String,
};
const Article = mongoose.model("Article", articleSchema);

// Get all articles - HTTP verbs
app.get("/article", function (req, res) {
	Article.find(function (err, foundArticles) {
		// console.log(foundArticles);
		// 우리가 보는 것 대신 클라이언트에 보내기 위해서 -> response 한다, send를 통해서, (보낼 내용)을. **
		if (!err) {
			res.send(foundArticles);
		} else {
			//res.send(에러내용) **
			res.send(err);
		}
	});
});
//postman에서 post선택 → localhost:3000/article 경로지정 후 key:value를 입력하고 nodemon rs하게되면 key, value 값이 출력된다.
//post request는 클라이언트로부터 또는 form으로 받아 콜백으로 처리?
//form에서 name을 따서 → req.body.[form_name] 을 받아와서 console.log로 테스트해본다.
app.post("/articles", function (req, res) {
	//이 데이터를 mongodb에 저장하려면 const <constantName>로 새로운 const를 만들고 거기에 new <ModelName> 에 넣어서 데이터 집어넣기 그리고 <constantName>.save();로 db저장
	const newArticle = new Article({
		title: req.body.title,
		content: req.body.content,
	});
	newArticle.save(function (err) {
		if (!err) {
			res.send("Successfully added a new article");
		} else {
			res.send(err);
		}
	});
});
// Post all Articles - HTTP verbs
// postman의 사용 - enable to send data and test our API without building an html form or the frontend at all.

app.delete("/articles", function (req, res) {
	//when the user make request, respond to delete
	//<ModelName>.deleteMany( {conditions}, function (err){ [ RES ] } );
	Article.deleteMany(function (err) {
		if (!err) {
			res.send("successfully deleted all articles.");
		} else {
			res.send(err);
		}
	});
});

app.listen(3000, function () {
	console.log("Server Started on port 3000.");
});

// Express 의 Chained Route Handlers Using Express 의 적용 전
// app.route("/articles").get().post().delete()