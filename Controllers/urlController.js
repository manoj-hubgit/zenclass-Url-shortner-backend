import shortid from "shortid";
import Url from "../Models/urlSchema.js";

export const createShortUrl = async(req,res) =>{
    const {longUrl} =req.body;

try {
   
    let url = await Url.findOne({longUrl});
    if(url){
        return res.json(url);
    }
  const urlCode=shortid.generate();
    const shortUrl=`https://shortner-backend-c4dw.onrender.com/api/url/${urlCode}`;
    url = new Url({
        longUrl,
        shortUrl,
        urlCode,
        date: new Date(),
      }); 
      await url.save();
      res.json(url);
} catch (error) {
    console.error(error);
    res.status(500).json('Internal Server error');
}
}

export const redirectUrl = async(req,res)=>{
    try {
        const url = await Url.findOne({urlCode:req.params.code})
        if(url){
            return res.redirect(url.longUrl);
        }
        else{
            return res.status(404).json('No URL found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).json('Internal Server error');
    }
}