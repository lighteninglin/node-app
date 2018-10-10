// @login && register
const express = require("express");
const router = express.Router();
const Profile = require("../../models/Profile");
const passport = require("passport");

// $route  GET api/profiles/test
// @desc   返回请求的json数据
// @access public
router.get("/test", (req, res) => {
    res.json({ msg: "profile works" });
});

// $route  POST api/profiles/add
// @desc   返回请求的json数据
// @access private
router.post("/add",passport.authenticate("jwt", {session: false}),(req,res) => {
    const profileFields = {};

    if(req.body.type) profileFields.type = req.body.type;
    if(req.body.describe) profileFields.describe = req.body.describe;
    if(req.body.income) profileFields.income = req.body.income;
    if(req.body.expend) profileFields.expend = req.body.expend;
    if(req.body.cash) profileFields.cash = req.body.cash;
    if(req.body.remark) profileFields.remark = req.body.remark;

    new Profile(profileFields).save().then(profile => {
        res.json(profile);
    });
});

// $route  GET api/profiles/delete/:id
// @desc   返回请求的单个profile
// @access private
router.delete("/delete/:id",passport.authenticate("jwt", {session: false}),(req,res) => {
    Profile.findOneAndDelete(
        {_id: req.params.id}
    )
    .then(profile => {
        if(!profile){
            return res.status(404).json("没有任何数据!");
        }
        profile.save().then(profile => res.json(profile));
    })
    .catch(err => res.status(404).json("删除失败!"));
});

// $route  GET api/profiles
// @desc   返回请求的profiles
// @access private
router.get("/",passport.authenticate("jwt", {session: false}),(req,res) => {
    Profile.find()
    .then(profiles => {
        if(!profiles){
            return res.status(404).json("没有任何数据!");
        }

        res.json(profiles);
    })
    .catch(err => res.status(404).json(err));
});

// $route  GET api/profiles/:id
// @desc   返回请求的单个profile
// @access private
router.get("/:id",passport.authenticate("jwt", {session: false}),(req,res) => {
    Profile.findOne({_id: req.params.id})
    .then(profile => {
        if(!profile){
            return res.status(404).json("没有任何数据!");
        }

        res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});

// $route  POST api/profiles/update/:id
// @desc   修改指定的profile
// @access private
router.post("/update/:id",passport.authenticate("jwt", {session: false}),(req,res) => {
    const profileFields = {};

    if(req.body.type) profileFields.type = req.body.type;
    if(req.body.describe) profileFields.describe = req.body.describe;
    if(req.body.income) profileFields.income = req.body.income;
    if(req.body.expend) profileFields.expend = req.body.expend;
    if(req.body.cash) profileFields.cash = req.body.cash;
    if(req.body.remark) profileFields.remark = req.body.remark;

    Profile.findOneAndUpdate(
        {_id: req.params.id},
        {$set: profileFields},
        {new: true}
    )
    .then(profile => {
        res.json(profile);
    })
    .catch(err => res.json(err));
});

module.exports = router;