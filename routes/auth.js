var express = require('express');
var passport = require('passport');
var router = express.Router();
let msRestAzure = require('ms-rest-azure');

/* GET auth callback. */
router.get('/signin',
  function  (req, res, next) {
    passport.authenticate('azuread-openidconnect',
      {
        response: res,
        prompt: 'login',
        failureRedirect: '/',
        failureFlash: true,
        successRedirect: '/'
      }
    )(req,res,next);
  }
);

router.post('/callback',
  function(req, res, next) {
    passport.authenticate('azuread-openidconnect',
      {
        response: res,
        failureRedirect: '/',
        failureFlash: true,
        successRedirect: '/'
      }
    )(req,res,next);
  }
);

router.get('/signout',
  function(req, res) {
    req.session.destroy(function(err) {
      req.logout();
      res.redirect('/');
    });
  }
);


router.get('/signcustomin', function(req, res) {

  console.log(req)
  console.log(res)

  req.json({success: true, req})

  return true


  msRestAzure.loginWithUsernamePassword('username@contosocorp.onmicrosoft.com', 'your-password', { tokenAudience: 'graph', domain: tenantId }, function (err, credentials, subscriptions) {
    if (err) console.log(err);
    var client = new graphRbacManagementClient(credentials, tenantId);
    var userParams = {
      accountEnabled: true,
      userPrincipalName: 'OfficialStark@<yourdomain.com>', //please add your domain over here
      displayName: 'Jon Snow',
      mailNickname: 'OfficialStark',
      passwordProfile: {
        password: 'WinterisComing!',
        forceChangePasswordNextLogin: false
      }
    };
    client.users.create(userParams, function (err, user, request, response) {
      if (err) return console.log(err);
      console.log(user);
      var userObjectId = user.objectId;
      client.users.list(function (err, result, request, response) {
        if (err) return console.log(err);
        console.log(result);
        client.users.deleteMethod(userObjectId, function (err, result, request, response) {
          if (err) return console.log(err);
          console.log(result);
        });
      });
    });
   });
})

module.exports = router;