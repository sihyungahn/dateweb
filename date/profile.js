currentUser = {};

$("#loginbtn").click(function(){
    
    Parse.FacebookUtils.logIn(null, {
      success: function(user) {
          
        currentUser.fbUserAuthData = user;
        currentUser.fbUserName = user.attributes.username;
          
        if (!user.existed()) {
            // show welcome stuff
            console.log("User signed up and logged in through Facebook!");
            
            createInitialUser();
            
        } else {
            // user already has an account
            alert("User logged in through Facebook!");
            
            //createInitialUser();
        }
        
      },
      error: function(user, error) {
        alert("User cancelled the Facebook login or did not fully authorize.");
      }
    });
})

function createInitialUser(){
    var UserInformation = Parse.Object.extend("UserInformation");
    var userInfo = new UserInformation();

    userInfo.set("fbUserName", currentUser.fbUserName);

    userInfo.save(null, {
      success: function(userInfo) {
        // a bunch of nested async save calls to get user profile info
          
        // get some basic info
        FB.api(
            "/me",
            function (response) {
                if (response && !response.error) {
                    // get data from fb
                    currentUser.firstName = response.first_name;
                    currentUser.lastName = response.last_name;
                    currentUser.gender = response.gender;
                    currentUser.fb_id = response.id;
                    
                    userInfo.set("firstName", currentUser.firstName);
                    userInfo.set("lastName",currentUser.lastName);
                    userInfo.set("gender", currentUser.gender);
                    userInfo.set("fb_id",currentUser.fb_id);
                    userInfo.save();
                    
                    // get profile pic from fb
                    FB.api(
                        "/me/picture",
                        {
                            "redirect": false,
                            "height": 400,
                            "width": 400,
                            "type": "normal"
                        },
                        function (response) {
                            if (response && !response.error) {
                                currentUser.profilePic = response.data.url;
                                userInfo.set("profilePic", currentUser.profilePic);
                                userInfo.save();
                            }
                            else{
                                console.log("Had trouble accessing FB API (#2)");
                            }
                        }
                    );
                }
                else{
                    console.log("Had trouble accessing FB API (#1)");
                }
            }
        );
        
          
      },
      error: function(userInfo, error) {
        // Execute any logic that should take place if the save fails.
        // error is a Parse.Error with an error code and message.
        alert('Failed to create new object, with error code: ' + error.message);
      }
    });
}

function getUserDetails(){
    var currentUser = Parse.User.current();
    if (currentUser) {
        console.log(currentUser)
        
        var UserInformationClass = Parse.Object.extend("UserInformation");
        var query = new Parse.Query(UserInformationClass);
        query.equalTo("fbUserName", currentUser.attributes.username);
        query.find({
          success: function(results) {
            
              userInfo = results[0];
              console.log(userInfo.get("gender"));
              
              $("#profileImg").attr("src",userInfo.get("profilePic"));
              
              $("#profileFirstName").html(userInfo.get("firstName"));
              $("#profileGender").html(userInfo.get("gender"));
              
              if (userInfo.get("age") != undefined){
                  $("#profileAge").val(userInfo.get("age"));
              }
              
              if (userInfo.get("description") != undefined){
                  $("#profileDescription").html(userInfo.get("description"));
              }
              else{
                  $("#profileDescription").html("Tell us about yourself..");
              }
              
              if (userInfo.get("minAge") != undefined){
                  $("#profileFilterMinAge").val(userInfo.get("minAge"));
              }
              
              if (userInfo.get("maxAge") != undefined){
                  $("#profileFilterMaxAge").val(userInfo.get("maxAge"));
              }
              
              if (userInfo.get("distancePref") != undefined){
                  $("#profileFilterDistance").val(userInfo.get("distancePref"));
              }
              
              if (userInfo.get("genderPref") == "male"){
                  $("#orientationPrefMale").attr("class","profileFilterInterestedIn btn-primary");
              }
              
              if (userInfo.get("genderPref") == "female"){
                  $("#orientationPrefFemale").attr("class","profileFilterInterestedIn btn-primary");
              }
              
              if (userInfo.get("genderPref") == "other"){
                  $("#orientationPrefOther").attr("class","profileFilterInterestedIn btn-primary");
              }
              
          },
          error: function(error) {
            alert("Error: " + error.code + " " + error.message);
          }
        });
        
        
    } else {
        // show the signup or login page
        console.log("crap, user got to this page and they aren't logged in")
    }
}

function saveUserDetails(){
    var currentUser = Parse.User.current();
    if (currentUser) {
        
        var UserInformationClass = Parse.Object.extend("UserInformation");
        var query = new Parse.Query(UserInformationClass);
        query.equalTo("fbUserName", currentUser.attributes.username);
        query.find({
          success: function(results) {
            
              userInfo = results[0];
              
              userInfo.set("age", $("#profileAge").val());
              userInfo.set("description", $("#profileDescription").html());
              userInfo.set("minAge", $("#profileFilterMinAge").val());
              userInfo.set("maxAge", $("#profileFilterMaxAge").val());
              userInfo.set("distancePref", $("#profileFilterDistance").val());
              
              userInfo.save();
          },
          error: function(error) {
            alert("Error: " + error.code + " " + error.message);
          }
        });
        
        
    } else {
        // show the signup or login page
        console.log("crap, user got to this page and they aren't logged in")
    }
}

function saveUserGenderPrefMale(){
    var currentUser = Parse.User.current();
    if (currentUser) {
        
        var UserInformationClass = Parse.Object.extend("UserInformation");
        var query = new Parse.Query(UserInformationClass);
        query.equalTo("fbUserName", currentUser.attributes.username);
        query.find({
          success: function(results) {
            
              userInfo = results[0];
              
              userInfo.set("genderPref","male");
            
              userInfo.save();
          },
          error: function(error) {
            alert("Error: " + error.code + " " + error.message);
          }
        });
        
        $("#orientationPrefMale").attr("class","profileFilterInterestedIn btn-primary");
        $("#orientationPrefFemale").attr("class","profileFilterInterestedIn btn-default");
        $("#orientationPrefOther").attr("class","profileFilterInterestedIn btn-default");
        
    } else {
        // show the signup or login page
        console.log("crap, user got to this page and they aren't logged in")
    }
}

function saveUserGenderPrefFemale(){
    var currentUser = Parse.User.current();
    if (currentUser) {
        
        var UserInformationClass = Parse.Object.extend("UserInformation");
        var query = new Parse.Query(UserInformationClass);
        query.equalTo("fbUserName", currentUser.attributes.username);
        query.find({
          success: function(results) {
            
              userInfo = results[0];
              
              userInfo.set("genderPref","female");
            
              userInfo.save();
          },
          error: function(error) {
            alert("Error: " + error.code + " " + error.message);
          }
        });
        
        $("#orientationPrefFemale").attr("class","profileFilterInterestedIn btn-primary");
        $("#orientationPrefMale").attr("class","profileFilterInterestedIn btn-default");
        $("#orientationPrefOther").attr("class","profileFilterInterestedIn btn-default");
        
    } else {
        // show the signup or login page
        console.log("crap, user got to this page and they aren't logged in")
    }
}

function saveUserGenderPrefOther(){
    var currentUser = Parse.User.current();
    if (currentUser) {
        
        var UserInformationClass = Parse.Object.extend("UserInformation");
        var query = new Parse.Query(UserInformationClass);
        query.equalTo("fbUserName", currentUser.attributes.username);
        query.find({
          success: function(results) {
            
              userInfo = results[0];
              
              userInfo.set("genderPref","other");
            
              userInfo.save();
          },
          error: function(error) {
            alert("Error: " + error.code + " " + error.message);
          }
        });
        
        $("#orientationPrefOther").attr("class","profileFilterInterestedIn btn-primary");
        $("#orientationPrefMale").attr("class","profileFilterInterestedIn btn-default");
        $("#orientationPrefFemale").attr("class","profileFilterInterestedIn btn-default");
        
    } else {
        // show the signup or login page
        console.log("crap, user got to this page and they aren't logged in")
    }
}