'use strict';

const { http, https } = require('follow-redirects');
const httpsNoRedirect = require('https');
const httpNoRedirect = require('http');
const path = require('path');
const fs = require('fs');
const pdf = require('html-pdf');

const express = require('express'), session = require("express-session"), passport = require('passport'), LocalStrategy = require('passport-local'), flash = require('connect-flash');
const moment = require('moment');
const bcrypt = require("bcryptjs");
const { randomUUID } = require("crypto")

const mdb = require('./mod/db.js');
const mysql = require('./mod/mysql.js');
const { send365Email, sendGmail } = require("./mod/email");
//require("./mod/chat");

const app = express({ limit: '50mb' });

app.use(express.text({}));
app.use('/public', express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))
app.use(express.json({ limit: '50mb', extended: true }))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(express.raw({ type: 'application/octet-stream', limit: '50mb' }));

app.use(
  session({
    secret: "rest-tracker-app",
    rolling: true,
    resave: true,
    saveUninitialized: false,
    cookie: { maxAge: 604000000, secret: true },
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

passport.use(new LocalStrategy({
  passReqToCallback: true
},
  async (req, username, password, done) => {
    const user = req.body.username.trim();    
    const rows = await mysql.customQuery(`select * from patient_list where app_id = '${username}' and clinic_id=2`)
    
    if (rows.length == 0)
      return done(null, false, req.flash('message', 'App Id does not exist'))

      if (rows.length>1)
      return done(null, false, req.flash('message', `${username} is not unique. Contact support!`))
    // if (!req.body.remember) {
  
    // }
    const found  = rows[0]

    if (found.app_deactive &&  found.app_deactive != "no") {
      return done(null, false, req.flash('message', 'Your account is deactivated!'))
    }

    if (!found.app_id || found.app_id == '') {
      return done(null, false, req.flash('message', 'Your App Id is empty'))
    }

    if (!found.dob || found.dob == '') {
      return done(null, false, req.flash('message', 'Please have support add your date of birth'))
    }

    req.session.cookie.maxAge = 2592000000; // 86400000 a day milisecond 

    if (!found.password) {
      if (password != moment(found.dob).format('MMDDYYYY') ) {
        return done(null, false, req.flash('message', 'Wrong Credential'))
      } else {
        return done(null, found)
      }
    }

    if (!await bcrypt.compare(password, found.password))
      return done(null, false, req.flash('message', 'Wrong Credential'))

    return done(null, found)
  }
))

var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated())
    return next();

    const message = req.flash('message')
    res.render('login.ejs', { message: message });    
}

app.get("/getaccount", async (req, res) => {
  const clinic_id = Number(req.query.clinic_id.trim());
  const app_id = req.query.app_id.trim();
  // const found = await mdb.findOne('patient_list', { 'App_Id': user });
  const found = await mysql.findPatientByClinicAppId(clinic_id, app_id);
  if (found.length > 0) {
    found[0].dob = moment(found[0].dob).format("MM/DD/YYYY")
  }
  res.send(JSON.stringify(found))
})

app.get('/', isAuthenticated, async (req, res) => {
  const message = req.flash('message')
  res.render('index', { user: req.user, message: message, });    
    
  // if (req.query.app_id)
  //   res.render('index', { app_id: req.query.app_id })
  // else
  //   res.send("<div style='font-size:16px'>Unauthorized use of the app. Please contact support!</div>")
});

app.get('/getmanifest', (req, res) => {
  const manifest = {
    "name": "CSMA App",
    "short_name": "CSMA App",
    "icons": [
      {
        "src": "/public/images/ios/144.png",
        "sizes": "144x144"
      },
      {
        "src": "/public/images/ios/152.png",
        "sizes": "152x152"
      },
      {
        "src": "/public/images/ios/192.png",
        "sizes": "192x192"
      },
      {
        "src": "/public/images/ios/256.png",
        "sizes": "256x256"
      },
      {
        "src": "/public/images/ios/512.png",
        "sizes": "512x512"
      }
    ],
    "lang": "en-US",
    "start_url": `/public/html/index.html?app_id=${req.query.app_id}`,
    "id": "/public/html/",
    "scope": "/public/html/",
    "display": "standalone",
    "background_color": "white",
    "theme_color": "white"
  }

  res.send(JSON.stringify(manifest))

  //return res.sendFile(path.join(__dirname, "public", "html", "index.html"))
});

app.post('/save-comment', async (req, res) => {

  if (req.body.type  == "onboarding") {
    const date_created = moment(req.body.date).format('YYYY-MM-DD')
    const query = `insert into nih_high_risk_ob_patient (subject_number, ring_serial_number, firstname, lastname, data, date_created) values ('${req.body.data.subject_number}', '${req.body.data.ring_serial_number}', '${req.body.data.firstname}', '${req.body.data.lastname}', '${JSON.stringify(req.body.data)}', '${date_created}')`;
    const data = await mysql.customQuery(query)
    
  } else {
    const save = (req.body.type == 'general' || req.body.type == 'event' )?
    await mdb.save("patient_comment", req.body) : await mdb.save("patient_comment_nih", req.body);
  }

  res.send("saved")

  // if (!found) {
  //   req.flash('message', `Username '${user}' does not exist`);
  //   res.redirect('/signin');
  // }

  //req.flash('message', "An email with link to reset your password was to the email on the account");
  //res.redirect('/signin');
});

// app.get('/chat', async (req, res) => {
//   res.render("chat")
// });


app.get('/getversion', async (req, res) => {
  const found = await mdb.find("app_version", {});
  res.send(JSON.stringify(found))
});

app.get('/getCsvData', async (req, res) => {
  const data = await mysql.selectAllWhere("sleep_nih_high_risk_ob", `ring_id='${req.query.ring_id}' order by plot_date`)
  res.send(data)
})

app.get('/checkcode', async (req, res) => {
  if (req.query.code == "CSMADATA") {
    res.send(true)
  } else {
    res.send(false)
  }
})

app.get('/getPatList', async (req, res) => {
  const data = await mysql.selectRingIdsWhere("ring_id", "patient_list", `ring_id != '' and ring_id is not null`)
  res.send(data)
})

app.post('/getCsmaApp', async (req, res) => {
  let patId = req.body.patId;
  if (patId == "A1B2C3") {
    patId = "479WUG"
  }
  //let foundNew = await mdb.find("patient_comment", { "patient_app_id": { $regex: new RegExp("^" + req.body.patId.toLowerCase(), "i") } })
  let foundNew = await mdb.find("patient_comment_nih", { "patient_app_id": req.body.patId })

  if (req.body.patId == "A1B2C3") {
    foundNew = (await mdb.find("patient_comment_nih", { "patient_app_id": { $regex: new RegExp("^" + "479WUG", "i") } })).concat(foundNew);
  }

  let convertedNew = []
  for (const e of foundNew) {
    const tmp = {}
    tmp["Patient ID"] = e.patient_app_id
    tmp["Date"] = e.date
    if (e["type"] == "dsa") {
      tmp["Question 1 (DSA)"] = `${e.data.DSA1},${e.data.DSA2}`
    } else if (e["type"] == "med") {
      tmp["Medication Changes"] = e.data.comment
    } else if (e["type"] == "general") {
      tmp["General Notes"] = e.data.comment
    } else if (e["type"] == "pap") {
      tmp["PAP"] = e.data.comment
    } else if (e["type"] == "appliance") {
      tmp["Dental Appiance"] = e.data.comment
    } else if (e["type"] == "inspire") {
      tmp["Inspire Changes"] = e.data.inspire_level
    } else {
      tmp[e.type] = e.data
    }
    
    let plot_date = new Date(e.date).setHours(0, 0, 0, 0) - 1;
    if (e.data.whichnight == "tonight") {
        if (new Date(e.date).getHours() > 1) {
            plot_date = moment(e.date).add( 1, 'days')._d.setHours(0, 0, 0, 0) -1;
        }
    }

    tmp["Plot_Date"] = plot_date;
    convertedNew.push(tmp)
  }

  // if (foundOld) {
  //   convertedNew = JSON.parse(foundOld.comments).concat(convertedNew)
  //   //return res.send(JSON.parse(foundOld.comments).concat(convertedNew))
  // }

  const clinic_datapoint = await mdb.find("clinic_comment_datapoint", { "exPatId": req.body.patId });
  const clinic_data = await mdb.find("clinic_comment", { "exPatId": req.body.patId });

  res.send([convertedNew, clinic_datapoint, clinic_data])
})


function https_request(httpsVar, options, cb) {
  var pagedata = "";
  const req = httpsVar.request(options, res => {
    res.on('data', d => {
      pagedata = pagedata + d;
    })

    res.on('end', function () {
      cb(pagedata)
    });

  })

  req.on('error', error => {
    console.error(error);
  })

  req.end();
}

String.prototype.replaceAll = function (search, toReplace) {
  const replacer = new RegExp(search, 'g')
  return this.replace(replacer, toReplace);
}

// function getHost(){
//   return req.protocol + '://' + req.get('host') // + req.originalUrl;
// }


const port = process.env.PORT || 3030;
app.listen(port);
const captchaKey = '0d2bbb4da84be9b455dea3e468c56b75';

console.log('Server started! At http://localhost:' + port);


app.post('/signin', passport.authenticate('local', {failureRedirect : '/signin',}), (req, res) => {
  res.redirect('/')
});

app.get('/signin', (req, res) => {
  const message = req.flash('message')
  res.render('login.ejs', { message: message }); 
});



app.get('/users/:username', isAuthenticated, async (req, res) => {
  const user = req.params.username.toLowerCase();
  const found = await mysql.findByUsername(user);
  const message = req.flash('message');
  if (!found) {
    req.flash('message', "Please login");
    return res.redirect('/signin');
  }
  //   getCookie(cookie=>{
  // console.log(cookie)

  //   })
  if (found.app_deactive && found.app_deactive == 'no') {
    req.flash('message', "Your account has been terminated");
    return res.redirect('/signin');
  }

  res.render('index', { user: user, message: message, });
});


// app.post('/signup', async (req, res) => {

//   const email = req.body.email.toLowerCase();
//   const found = await mysql.findByUsername(email);

//   if (found) {
//     req.flash('message', user + " is not available! Please choose another username.");
//     return res.redirect('/signin');
//   }

//   const newuser = {
//     'email': req.body.email.toLowerCase(),
//     'firsname': req.body.firstname,
//     'lastname': req.body.lastname,
//     'password': bcrypt.hashSync(req.body.password, 12),
//     'dob': req.body.dob,
//     'created_date': moment(new Date()).format("YYYY/MM/DD"),
//     'gender': req.body.gender,
//     'phone': req.body.phone,
//     'token': randomUUID(),
//     'active': 'Pending',
//   }

//   const savedUser = await mysql.insertUser(newuser)

//   req.flash('message', "Your account has been created! You can login now.");
//   return res.redirect('/signin');

// });


app.get('/signout', function (req, res, next) {
  req.logout(function (err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

// app.get('/password-reset', async (req, res) => {
//   if (!req.query.username && !req.query.token) {
//     return res.redirect('/signin');
//   }
//   const user = req.query.username.toLowerCase();
//   const token = req.query.token;


//   const found = await mysql.findByUsername(user);

//   if (!found) {
//     req.flash('message', "username does not exist");
//     return res.redirect('/signin');
//   }

//   if (found.token != token) {
//     req.flash('message', "Wrong token likely link is expired, please contact support");
//     return res.redirect('/signin');
//   }

//   return res.render('password-reset', { username: user, message: "" })
// })

// app.post('/password-reset', async (req, res) => {
//   const user = req.body.username.toLowerCase();
//   const found = await mysql.findByUsername(user);

//   const result = await mysql.updateUser(found.id, { 'token': randomUUID(), 'password': bcrypt.hashSync(req.body.newpassword, 12) })

//   req.flash('message', "Your password has been successfully reset");
//   return res.redirect('/signin');

// })

// app.post('/password-reset-internal', isAuthenticated, async (req, res) => {
//   const user = req.body.username.toLowerCase();
//   const currentpassword = req.body.currentpassword;
//   const found = await mysql.findByUsername(user);


//   if (!await bcrypt.compare(currentpassword, found.password)) {
//     req.flash('message', "Your current password didn't match, if you forgot your password, try resetting on sign-in page");
//     return res.redirect(`/users/${user}`);
//   }

//   const result = await mysql.updateUser(found.id, { 'token': randomUUID(), 'password': bcrypt.hashSync(req.body.newpassword, 12) })

//   req.flash('message', "Your password has been successfully reset");
//   return res.redirect(`/users/${user}`);

// })

// app.post('/forgot-password', async (req, res) => {

//   const user = req.body.username.toLowerCase();
//   const found = await mysql.findByUsername(user);

//   if (!found) {
//     req.flash('message', `Username '${user}' does not exist`);
//     res.redirect('/signin');
//   }

//   req.flash('message', "An email with link to reset your password was to the email on the account");
//   res.redirect('/signin');

//   const resetlink = `${req.protocol}://${req.get('host')}/password-reset?username=${user}&token=${found.token}`
//   sendGmail(found.email, `The Vin Report Password Reset`, ` <b>Your password reset link:</b><br/><br/> ${resetlink}`, null)
// });

// app.post('/addcredits', async (req, res) => {
//   const verify_payment = req.body.verify_payment;
//   const username = req.query.username.toLowerCase();
//   if (verify_payment != "done") {
//     req.flash('message', "Unauthorized payment!");
//     return res.redirect(`/users/${username}`);
//   }

//   //const found = await mdb.findOne('users', { 'username': username });
//   const found = await mysql.findByUsername(username);
//   if (!found) {
//     req.flash('message', "Please login");
//     return res.redirect('/signin');
//   }

//   let totalcredits = Number(found.credits) + Number(req.body.credits_add)

//   //const updatecreidts = await mdb.updateOne('users', { 'username': username }, { credits: totalcredits});

//   const updatecreidts = await mysql.updateCreditForUser(username, totalcredits);

//   req.flash('message', `${req.body.credits_add} credits added!`);
//   return res.redirect(`/users/${username}`);
// });

// app.post('/change-password', async (req, res) => {
//   const user = req.body.patient_app_id;
//   const found = await mdb.findOne('patient_list', { 'App_Id': user });

//   if (found.password) {
//     if (!await bcrypt.compare(req.body.currentpassword, found.password)) {
//       req.flash('message', `<span style="color:red"> Current password is wrong. Password Not changed! </span>`);
//       return res.redirect("/settings")
//     }
//   } else {

//   }

//   const result = await mdb.updateOne("patient_list", { _id: found._id.toString() }, { 'password': bcrypt.hashSync(req.body.newpassword, 12) })

//   req.flash('message', `<span style="color:green">Password successfully changed! </span>`);
//   res.redirect("/settings")
// })