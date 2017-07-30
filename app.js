var env = process.env.NODE_ENV || 'development';
var config = require('./config')[env];
//var dictionary = require('./dictionary');
var moment = require('moment');
const express = require('express')
var session = require('express-session');
const MongoStore = require('connect-mongo')(session);
var winston = require('winston');
var async = require("async");

var app = express()
var request = require('request');
var VError = require('verror');
var fs = require('fs')
var _ = require('underscore');
var bodyParser = require('body-parser');

var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var assert = require('assert');


var passport = require('passport')
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth20').Strategy;

app.use(express.static('client'))
app.use(bodyParser.urlencoded({ extended: false }))
app.set('view engine', 'pug');
app.set('views', './views');

app.use(session({
  secret: config.SESSION_SECRET_KEY,
  resave: false,
  saveUninitialized: true,
  store:new MongoStore({ url: config.DB_URL })
}));

var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      timestamp: true
    })
  ]
});
var mongodb;
var collectionUser;
var collectionTransaction;
var collectionFamily;
function dbconnect(url,callback)
{

  logger.info("DB connect")
  MongoClient.connect(url, function(err, db) {
     if (err) { 
        var error = new VError(err,"DB connect %s", url) 
        logger.error(error);
        callback(error); 
     }
    logger.info("Connected correctly to server");
    mongodb=db;
    collectionUser = mongodb.collection('User');
    collectionTransaction = mongodb.collection('Transaction');
    collectionFamily = mongodb.collection('Family');
    callback();
  });
}

function dbdisconnect(){
  mongodb.close();
}



app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
    clientID: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET,
    callbackURL: config.GOOGLE_CALLBACK_URL
  },
  function(accessToken, refreshToken, profile, done) {
    logger.info(profile.name)
    var _id = 'google:'+profile.id;;
      collectionUser.findOne({_id:_id},function(err, foundUser) {
        if (err) {logger.error('google strategy:',err); return done(err); }
        if(foundUser){
          logger.info("user already exist, proceed to login")
          done(null, foundUser);
        }
        else
        {
          logger.info("new user, proceed to login")
          var newuser = profile._json;
          newuser._id = _id;
          newuser.displayName = JSON.stringify(profile._json.name);
          logger.info('new user displayName',newuser.displayName)

          collectionUser.insertOne(newuser,function(err, newuser) {
            if (err) {var newError = VError(err,'google strategy InsertOne'); return done(newError); }
	        });
          done(null,newuser);
        }
      });
  }
));

passport.use(
  new FacebookStrategy({
    clientID: config.FACEBOOK_APP_ID,
    clientSecret: config.FACEBOOK_APP_SECRET,
    callbackURL: config.FACEBOOK_CALLBACK_URL,
    profileFields:['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'verified', 'displayName','age_range']
  },
  function(accessToken, refreshToken, profile, done) {
    logger.info('facebook login:',profile.name);
    var _id = 'facebook:'+profile.id;;
      collectionUser.findOne({_id:_id},function(err, foundUser) {
        if (err) {logger.error(err); return done(err); }
        if(foundUser){
          logger.info("user already exist, proceed to login")
          done(null, foundUser);
        }
        else
        {
          logger.info("new user, proceed to login")
          var newuser = profile._json;
          newuser._id = _id;
          newuser.displayName = profile._json.name;
          collectionUser.insertOne(newuser,function(err, newuser) {
            if (err) {var newError = VError(err,'facebook strategy insertOne'); return done(newError); }
	        });
          done(null,newuser);
        }
      });
  }

));


passport.serializeUser(function(user, done) {
  logger.info('         serializeUser',user._id, user.name);
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
 collectionUser.findOne({_id:id},function(err, foundUser) {
        if(err){logger.error('deserializeUser',err); return done(err);}
        if(foundUser)
        {
          logger.info('         deserializeUser ', id, foundUser.name)
          done(err, foundUser);
        }
        else
        {
          done('not existing FoundUser');
        }
  });

});


function initialize(){
  dbconnect(config.DB_URL,function(err){
    if (err) { var newError = new VError(err,'initialize dbconnect');  return newError; }

  });
}

initialize();


app.get('/auth/logout', function(req, res){
  if(req.user)
  {
    logger.info('/auth/logout', req.user._id, req.user.name);
    req.logout();
    req.session.save(function(){
      res.redirect('/');
    });
  }
  else{
    logger.info('/auth/logout not logged in approach')
    res.redirect('/');
  }
});




// Redirect the user to Facebook for authentication.  When complete,
// Facebook will redirect the user back to the application at
//     /auth/facebook/callback
app.get('/auth/facebook', passport.authenticate('facebook',{scope:'email'}));

// Facebook will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/',
                                      failureRedirect: '/' }));


app.get('/auth/google',passport.authenticate('google', { scope: ['profile','email'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { successRedirect:'/',
                                    failureRedirect: '/' }));

var TERM = {monthly:1,quaterly:3,yearly:12};

function addToList(startDate, endDate, dayList,item){
  if(item.repeat)
  {
    var initDate = new Date(item.startYear,item.startMonth,item.repeatdate,0,0,0,0);
    console.log('/addToList item.title',item.title)
    console.log('/addToList item.repeat',item.repeat)
    console.log('/addToList initDate ',initDate)
    console.log('/addToList endDate ',endDate)
    console.log('/addToList repeatdate ',item.repeatdate)
    console.log('/addToList repeatterm ',item.repeatterm)
    var candidate = initDate;

    while(candidate<endDate && candidate>startDate)
    {
      dayList[candidate].push(item);
      console.log('/addToList candidate',candidate)
      var m = moment(candidate);
      m.add(TERM[item.repeatterm],'months');
      candidate = m.toDate();;
    }
  }
  else{
    var mydate = new Date(item.year,item.month,item.date,0,0,0,0);
    if(dayList[mydate])
    {
      dayList[mydate].push(item);
    }
  } 
  return dayList;
}
// var d = new Date();
// var todayDate = new Date(d.getFullYear(),d.getMonth(),d.getDate(),0,0,0,0);
app.post('/item/add',function(req,res){
  if(req.user)
  {
    console.log(req.body);
    var expense = req.body.expense?parseFloat(req.body.expense):0;
    var income = req.body.income?parseFloat(req.body.income):0;

    collectionTransaction.insertOne({owner:req.user._id,date:new Date(req.body.date),title:req.body.title,
      expense:expense,income:income,category:req.body.category,memo:req.body.memo},function(err){
        if(err){logger.error('/item/add',err);return err;}
        res.redirect('/daily');
    })
  }
  else{
    logger.info('/item/add not valid access')
    res.redirect('/login');
  }

})
app.post('/item/modify',function(req,res){
  if(req.user)
  {
    console.log(req.body);
    var id = ObjectId(req.body.id);
    var expense = req.body.expense?parseFloat(req.body.expense):0;
    var income = req.body.income?parseFloat(req.body.income):0;
    
    collectionTransaction.updateOne({_id:id},{$set:{date:new Date(req.body.date),title:req.body.title,
      expense:expense,income:income,category:req.body.category,memo:req.body.memo}},function(err){
        if(err){logger.error('/item/update',err);return err;}
        res.redirect('/daily');
    })
  }
  else{
    logger.info('/item/modify not valid access')
    res.redirect('/login');
  }

})

app.post('/item/delete',function(req,res){
  if(req.user)
  {
    console.log(req.body);
    var id = ObjectId(req.body.id);

    collectionTransaction.remove({_id:id},function(err){
        if(err){logger.error('/item/delete',err);return err;}
        res.redirect('/daily');
    })
  }
  else{
    logger.info('/item/modify not valid access')
    res.redirect('/login');
  }

})

function setBalance(list)
{
  var currentBalance = 0;
 //sorting
 for(var i=0;i<list.length;i++)
 {
   currentBalance = currentBalance-list[i].expense+list[i].income;
   list[i].balance = currentBalance;
 }
 return list;
}

app.get('/login',function(req, res) {
    
    res.render('login.pug')
})


function getFamilyMembers(familyID,callback){

  collectionFamily.findOne({_id:familyID},function(err,result){
    callback(null,result.members);
  })
}
function joinFamily(userID,familyID,callback){
    collectionUser.updateOne({_id:userID},{$set:{familyID:familyID}},function(err){
      if(err){logger.error('join family userupdate',err);callback(err)}
      collectionFamily.updateOne({_id:familyID},{$push:{members:userID}},function(err){
        if(err){logger.error('join family memberupdate',err);callback(err)}
        callback();
      })
    })
}

function createFamily(callback){
  var family = {members:[]};
  collectionFamily.insertOne(family,function(err, insertedDocument) {
    if (err) {logger.error(err); callback(err); }
    logger.info('createFamily: successfully done:'+insertedDocument.insertedId);
    callback(null,insertedDocument.insertedId);
  })
}

function bindFamily_test(callback){
  var family = ['facebook:1523853431008054','facebook:1462769290453662'];
  createFamily(function(err,familiyID){
    if (err) {logger.error(err); callback(err); }
      joinFamily(family[0],familiyID,function(err){
        joinFamily(family[1],familiyID,function(err){
          callback();
        })
      })
  })
}

app.get('/admin/bindtest',function(req, res) {
    bindFamily_test(function(err){
      logger.info('/admin/bindtest done');
      res.send('good!')
    });
})
app.get('/dailyfamily',function(req, res) {
  if(req.user)
  {
    getFamilyMembers(req.user.familyID,function(err,members){
      collectionTransaction.find({owner:{$in:members}},function(err,cursor){
          if(err){logger.error('/daily find',err);return err;}
          
          cursor.sort({date:1}).toArray(function(err,list){
            if(err){logger.error('/daily toArray',err);return err;}
            var jrlist = setBalance(list);
            res.render('dailynote.pug',{list:jrlist,liststr:JSON.stringify(jrlist)});
          })
      })      
    })

  }
  else{
    logger.info('/item/add not valid access')
    res.redirect('/login');
  }

})
app.get('/daily',function(req, res) {
  if(req.user)
  {
    collectionTransaction.find({owner:req.user._id},function(err,cursor){
        if(err){logger.error('/daily find',err);return err;}
        
        cursor.sort({date:1}).toArray(function(err,list){
          if(err){logger.error('/daily toArray',err);return err;}
          var jrlist = setBalance(list);
          res.render('dailynote.pug',{list:jrlist,liststr:JSON.stringify(jrlist)});
        })
    })      

  }
  else{
    logger.info('/item/add not valid access')
    res.redirect('/login');
  }

})
app.get('/',function(req,res){
  if(req.user) //logged in user?
  {
  var list = [
    {title:'집세',price:795,type:'expense',repeat:true,repeatterm:'monthly',repeatdate:1,startYear:2017,startMonth:7},
    {title:'집주차비',price:36,type:'expense',repeat:true,repeatterm:'monthly',repeatdate:1,startYear:2017,startMonth:7},
    {title:'생활비',price:500,type:'expense',repeat:true,repeatterm:'monthly',repeatdate:1,startYear:2017,startMonth:7},
    {title:'병수사무실',price:250,type:'expense',repeat:true,repeatterm:'quaterly',repeatdate:7,startYear:2017,startMonth:7},
    {title:'요셉유치원',price:94,type:'expense',repeat:true,repeatterm:'monthly',repeatdate:5,startYear:2017,startMonth:7},
    {title:'ARD',price:52.5,type:'expense',repeat:true,repeatterm:'quaterly',repeatdate:10,startYear:2017,startMonth:7},
    {title:'HASPA KONTO',price:7.9,type:'expense',repeat:true,repeatterm:'monthly',repeatdate:28,startYear:2017,startMonth:6},
    {title:'통신비',price:100,type:'expense',repeat:true,repeatterm:'monthly',repeatdate:15,startYear:2017,startMonth:7},
    {title:'기름값 및 주차비',price:150,type:'expense',repeat:true,repeatterm:'monthly',repeatdate:15,startYear:2017,startMonth:7},
    {title:'차량유지비',price:50,type:'expense',repeat:true,repeatterm:'monthly',repeatdate:26,startYear:2017,startMonth:7},
    {title:'차보험',price:280,type:'expense',repeat:true,repeatterm:'quaterly',repeatdate:3,startYear:2017,startMonth:9},
    {title:'전기세',price:52,type:'expense',repeat:true,repeatterm:'monthly',repeatdate:19,startYear:2017,startMonth:7},
    {title:'재림용돈',price:100,type:'expense',repeat:true,repeatterm:'monthly',repeatdate:2,startYear:2017,startMonth:7},
    {title:'병수용돈',price:100,type:'expense',repeat:true,repeatterm:'monthly',repeatdate:2,startYear:2017,startMonth:7},
    {title:'병수회사',price:100,type:'expense',repeat:true,repeatterm:'monthly',repeatdate:2,startYear:2017,startMonth:7},
    {title:'KinderGeld',price:192,type:'income',repeat:true,repeatterm:'monthly',repeatdate:20,startYear:2017,startMonth:7},
    {title:'ALG',price:2070,type:'income',repeat:true,repeatterm:'monthly',repeatdate:27,startYear:2017,startMonth:9},
    {title:'ALG',price:550,type:'income',repeat:false,date:27,year:2017,month:8},
    {title:'JR_Klavier',price:200,type:'income',repeat:false,date:15,year:2017,month:7},
    {title:'JR_Klavier',price:50,type:'income',repeat:false,date:8,year:2017,month:9},
    {title:'JR_Klavier',price:150,type:'income',repeat:false,date:7,year:2017,month:10},
    {title:'JR운전면허_EHK',price:30,type:'expense',repeat:false,date:29,year:2017,month:6},
    {title:'JR운전면허_등록',price:45,type:'expense',repeat:false,date:1,year:2017,month:7},
    {title:'JR운전면허_도로연수',price:45,type:'expense',repeat:false,date:7,year:2017,month:7},
    {title:'JR운전면허_도로연수',price:45,type:'expense',repeat:false,date:10,year:2017,month:7},
    {title:'JR운전면허_도로연수',price:45,type:'expense',repeat:false,date:14,year:2017,month:7},
    {title:'JR운전면허_도로연수',price:45,type:'expense',repeat:false,date:17,year:2017,month:7},
    {title:'JR운전면허_도로연수',price:45,type:'expense',repeat:false,date:21,year:2017,month:7},
    {title:'JR운전면허_도로연수',price:45,type:'expense',repeat:false,date:24,year:2017,month:7},
    {title:'JR운전면허_도로연수',price:45,type:'expense',repeat:false,date:28,year:2017,month:7},
    {title:'JR운전면허_도로연수',price:45,type:'expense',repeat:false,date:31,year:2017,month:7},
    {title:'JR운전면허_SF',price:45,type:'expense',repeat:false,date:4,year:2017,month:8},
    {title:'JR운전면허_SF',price:45,type:'expense',repeat:false,date:6,year:2017,month:8},
    {title:'JR운전면허_SF',price:45,type:'expense',repeat:false,date:8,year:2017,month:8},
    {title:'JR운전면허_SF',price:45,type:'expense',repeat:false,date:11,year:2017,month:8},
    {title:'JR운전면허_SF',price:45,type:'expense',repeat:false,date:13,year:2017,month:8},
    {title:'JR운전면허_SF',price:45,type:'expense',repeat:false,date:15,year:2017,month:8},
    {title:'JR운전면허_SF',price:45,type:'expense',repeat:false,date:18,year:2017,month:8},
    {title:'JR운전면허_SF',price:45,type:'expense',repeat:false,date:20,year:2017,month:8},
    {title:'JR운전면허_SF',price:45,type:'expense',repeat:false,date:22,year:2017,month:8},
    {title:'JR운전면허_SF',price:45,type:'expense',repeat:false,date:25,year:2017,month:8},
    {title:'JR운전면허_SF',price:45,type:'expense',repeat:false,date:27,year:2017,month:8},
    {title:'JR운전면허_SF',price:45,type:'expense',repeat:false,date:29,year:2017,month:8},
    {title:'빌림',price:1000,type:'income',repeat:false,date:29,year:2017,month:7},
    ];
  var initBalance = 5618;
  var initDate = new Date(2017,6,27,0,0,0,0);//remove hours,minitue,seconds
  var duration = 365;
  var dailyList ={};
  console.log('initDate',initDate)

  var m = moment(initDate);
  m.add(duration,'days');
  var endDate = m.toDate();;
  console.log('endDate',endDate)

  //initialize array
  for(var i=0;i<duration;i++)
  {
    var m = moment(initDate);
    m.add(i,'days');
    var newDayTimeStamp = m.toDate();
    console.log('newDayTimeStamp',newDayTimeStamp);
    dailyList[newDayTimeStamp]=[]; 
  }
  
  for(var i=0;i<list.length;i++)
  {
    console.log('addToList',i);
    dailyList = addToList(initDate,endDate,dailyList,list[i]);
  }

  var mylist =[];
  var prevBalance = initBalance;
  for(var key in dailyList)
  {
    console.log(key,dailyList[key])
    var date = new Date(key).toLocaleDateString()
    var income = dailyList[key].reduce(
      function(acc,item){
        if(item.type=='income')
        {
          return acc+item.price;
        }else
        {
          return acc;
        }
    },0);
    var expense = dailyList[key].reduce(
      function(acc,item){
        if(item.type=='expense')
        {
          return acc+item.price;
        }else
        {
          return acc;
        }
    },0);
    var title = dailyList[key].reduce(
      function(acc,item){
          return acc+'|'+item.title;
    },'');

    var balance = prevBalance - expense + income;
    prevBalance = balance;
    var netbalance = balance ;
    var dayItem = {date:date,title:title,income:income,expense:expense,balance:balance,netbalance:netbalance};
    mylist.push(dayItem);
  }
  // for(var i=0;i<duration;i++)
  // {
  //   var date = today + i*(24*60*60*1000);
  //   var title
  //   dailyList.push({date:date}); 
  // }
  // var mylist = [
  //   {date:'2017년7월27일',title:'집세',income:0,expense:795,balance:'3409',netbalance:'2290'},
  //   {date:'2017년7월27일',title:'집세',income:0,expense:795,balance:'3409',netbalance:'2290'},
  //   {date:'2017년7월27일',title:'집세',income:0,expense:795,balance:'3409',netbalance:'2290'}
  //   ];
    
    res.render('home_login',{list:list,dailyList:mylist});
  }
  else{
    res.render('landingpage');
  }
})

app.listen(process.env.PORT || config.NODE_PORT, process.env.IP || "0.0.0.0",function(){
  logger.info('listening on %s',process.env.PORT||config.NODE_PORT)
})
