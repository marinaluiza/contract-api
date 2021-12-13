import fs from "fs";
class UploadFile {

    static readFile(path : string, callback : any) {
        fs.readFile(path, "utf8", callback);
    }
}


export default UploadFile;