import { Router } from "express";
import TransformSymboleoFactory from "../factories/transform-symboleo-factory";
import adapter from "../http/adapter";
import Handler from "../http/handler";
import multer from "multer";

const upload = multer({ dest: 'uploads/' })

export const routes = (app : Router) => {
    app.post('/contract-symboleo', upload.single('file'), adapter(Handler, TransformSymboleoFactory));
}


