const router=require("express").Router();
const Audit=require("../models/Audit");
const auth=require("../middleware/authMiddleware");
const allow=require("../middleware/roleMiddleware");

router.get("/",
 auth,
 allow("super_admin"),
 async(req,res)=>{
  const logs=await Audit
   .find()
   .populate("performedBy","name email");
  res.json(logs);
 });

module.exports=router;
