const express = require('express');
const bodyparser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/wikiDB',{useNewUrlParser: true});


const app = express();

app.set('view-engine','ejs');

app.use(bodyparser.urlencoded({extended: true}));

app.use(express.static("public"));

const articleSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Article = mongoose.model("Article",articleSchema);


//todo

app.route("/articles")

.get((req,res)=>{
    Article.find({})
    .exec()
    .then((foundarticles)=>{
        res.send(foundarticles);
    })
    .catch((e)=>{
        res.send(e);
    })
})

.post((req,res)=>{

    const newPost = new Article ({
          title:req.body.title,
          content:req.body.content
    });
  
    newPost.save()
    .then(()=>{
      res.send("Article send sucesfully.");
    })
    .catch((e)=>{
      res.send(e);
    })
  
  })

  .delete((req,res)=>{
    Article.deleteMany({})
    .then(()=>{
        res.send("Articles deleted sucesfully.");
    })
    .catch(()=>{
        res.send(e);
    })
});


//operations for specific article
app.route("/articles/:articleTitle")

.get((req,res)=>{
    Article.findOne({title: req.params.articleTitle})
    .exec()
    .then((foundArticle)=>{
        res.send(foundArticle);
    })
    .catch((e)=>{
        res.send("Not found"+e);
    })
})

.put((req,res)=>{
    Article.findOneAndUpdate(
        {title: req.params.articleTitle},
        {title:req.body.title,content:req.body.content},
        {overwrite: true}
        )
        .then(()=>{
            res.send("Sucessfully Updated");
        })
        .catch((e)=>{
            res.send(e);
        })
})

.patch((req,res)=>{
    Article.findOneAndUpdate(
        {title: req.params.articleTitle},
        {$set: req.body}//used for updating data as per requirement.
    )
    .then(()=>{
        res.send("patch updated sucesfully");
    })
    .catch((e)=>{
        res.send(e);
    })
})

.delete((req,res)=>{
    Article.deleteOne({title : req.params.articleTitle})
    .then(()=>{
        res.send("Article deleted sucesfully.");
    })
    .catch((e)=>{
        res.send(e);
    })
})

app.listen(3000,()=>{
    console.log("server started on port 3000");
});