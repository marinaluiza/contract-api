import express from "express";
import fs from "fs";
import multer from "multer";
import cors from "cors";
import {routes} from './infrasctructure/routers'
const port = 3333;

const app = express();
const upload = multer({ dest: 'uploads/' })


app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  console.log('teste')
  res.send("CONTRACT API ON!");
});

routes(app);

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
