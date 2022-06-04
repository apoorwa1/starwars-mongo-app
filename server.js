import express from "express";
import bodyParser from "body-parser";
import ejs from "ejs";
import dotenv from "dotenv";
dotenv.config();

const app = express();
import path from "path";

import * as mongodb from "mongodb";
let MongoClient = mongodb.MongoClient;

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname) + "/index.html");
// });
const connectionString = process.env.DB_URL;
console.log(connectionString);

MongoClient.connect(connectionString, { useUnifiedTopology: true })
  .then((client) => {
    //console.log("connected to database");
    const db = client.db("starwars");
    const quotesCollection = db.collection("quotes");
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(express.static("public"));
    app.set("view engine", "ejs");

    /* 
    CREATE REQUEST
    post request using the form elements in html*/
    app.post("/quotes", (req, res) => {
      quotesCollection
        .insertOne(req.body)
        .then((result) => {
          //console.log(result);
          res.redirect("/");
        })
        .catch((error) => console.error(error));
    });

    /*GET REQUEST*/

    app.get("/", (req, res) => {
      db.collection("quotes")
        .find()
        .toArray()
        .then((results) => {
          //console.log(results);
          res.render("index.ejs", { quotes: results });
        })
        .catch((error) => console.error(error));
    });

    /* UPDATE REQUEST  using JavaScript*/

    app.put("/quotes", (req, res) => {
      quotesCollection
        .findOneAndUpdate(
          { name: "yoda" },
          {
            $set: {
              name: req.body.name,
              quote: req.body.quote,
            },
          },
          {
            upsert: true,
          }
        )
        .then((result) => {
          res.json("Success");
          //console.log(result);
        })
        .catch((error) => console.error(error));
      //console.log(req.body);
    });

    /* DELETE REQUEST */
    app.delete("/quotes", (req, res) => {
      quotesCollection
        .deleteOne({ name: req.body.name })
        .then((result) => {
          if (result.deletedCount === 0) {
            return res.json("No quote to delete");
          }
          //console.log(result);
          return res.json(`Deleted Darth Vadar's quote`);
        })
        .catch((error) => console.error(error));
    });

    app.listen(3001, function () {
      console.log("listening on 3001");
    });
  })
  .catch((error) => console.error(error));
