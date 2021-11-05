import express from "express";
import ContractTransformationSymboleo from "./services/ContractTransformationSymboleoService";
import ContractTransformation from "./services/ContractTransformation";
import CreateDiagramService from "./services/CreateDiagramService";
import CreateDiagramSymboleoService from "./services/CreateDiagramSymboleoService";
import fs from "fs";
import multer from "multer";
import cors from "cors";

const port = 3333;

const app = express();
const upload = multer({ dest: 'uploads/' })
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  console.log('teste')
  res.send("CONTRACT API ON!");
});

app.post("/contract-symboleo",upload.single('file'), (req, res) => {
  const tmp_path = req.file?.path || '';
  if(tmp_path) {
    fs.readFile(tmp_path, "utf8", (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      const contractService = new ContractTransformation(new ContractTransformationSymboleo());
      const contract = contractService.execute(data);
      
      const createDiagramService = new CreateDiagramService(
        new CreateDiagramSymboleoService()
      );
      const response = createDiagramService.execute(contract);
      res.send(response);
    });
  }


});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
