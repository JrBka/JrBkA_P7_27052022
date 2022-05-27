//importation des packages multer
const multer = require("multer");

//model d'extention
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

//disk storage = stockage sur le dique dur
const storage = multer.diskStorage({
  //determine la destination du fichier télécharger
  destination: (req, file, callback) => {
    //le fichier ira dans le dossier images
    callback(null, "images/profil");
  },
  //determine le nouveau nom du fichier
  filename: (req, file, callback) => {
    //utilise le nom d'origine et remplace les espace (s'il y en a) par des "_"
    const name = file.originalname.split(" ").join("_");
    //determine l'extention du fichier
    const extension = MIME_TYPES[file.mimetype];
    //ajoute un timestamp au nom
    callback(null, name + Date.now() + "." + extension);
  },
});
//storage = configuration de multer, single("image") = gerera uniquement les fichier image
module.exports = multer({ storage: storage }).single("image");
