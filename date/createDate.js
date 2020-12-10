
// (function() {
    $(function() {
        $("#datepicker").datepicker({dateFormat: "yy-mm-dd"});
        $("#timepicker").timepicker({'timeFormat': 'h:i a'});
    });

    function getLocation() {
        if (navigator.geolocation)
            navigator.geolocation.getCurrentPosition(displayMap);
    }

    var gmap;
    var focus;
    var catBox;
    var service;
    var infowindow;
    var markers = [];

    var upos;  // tmp to pass user's location to Parse

    function displayMap(position) {
        upos = position;
        focus = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        var mapOptions = {
            zoom: 12,
            center: focus
        };
        gmap = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
        infowindow = new google.maps.InfoWindow();
        service = new google.maps.places.PlacesService(gmap);

        catBox = document.getElementById("catbox");
        catBox.addEventListener("change", updateMap);
        document.getElementById("submit").addEventListener("click", makeDateInfo);
        updateMap();
    }

    function updateMap() {
        for (var i = 0; i < markers.length; i++)
            markers[i].setMap(null);
        markers = [];

        var cat = catBox.options[catBox.selectedIndex];
        var request = {
            location: focus,
            radius: '4800',
            types: ["" + cat.value]
        };
        service.nearbySearch(request, callback);
    }

    function callback(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK)
            for (var i = 0; i < results.length; i++)
                createMarker(results[i]);
    }

    function createMarker(place) {
        var marker = new google.maps.Marker({
            map: gmap,
            position: place.geometry.location
        });
        markers.push(marker);
        google.maps.event.addListener(marker, 'click', function() {
            if (place.formatted_address != undefined)
                infowindow.setContent(place.name + " - " + place.formatted_address);
            else
                infowindow.setContent(place.name);
            infowindow.open(gmap, this);
        });
    }

    // needs form verification
    function makeDateInfo() {
        // get values from form fields
        var uid = Parse.User.current().attributes.username;
        var headline = document.getElementById("title").value;
        var locationName = document.getElementById("locationName").value;
        var blind = document.getElementById("blind").checked;
        var purpose = catBox.options[catBox.selectedIndex].value;
        var desc = document.getElementById("description").innerHTML;

        // query the current user's information
        // this doesn't work lol (ages and gender info is blank)
        var userInfo;
        var currentUser = Parse.User.current();
        var UserInformationClass = Parse.Object.extend("UserInformation");
        var query = new Parse.Query(UserInformationClass);
        query.equalTo("fbUserName", currentUser.attributes.username);

        var age;
        var gender;
        var seekmin;
        var seekmax;
        var seekgen;

        query.find({
            success: function(results) {
                userInfo = results[0];
                gender = userInfo.get("gender");
                age = userInfo.get("age");
                seekmin = userInfo.get("minAge");
                seekmax = userInfo.get("maxAge");
                seekgen = userInfo.get("genderPref");
            },
            error: function(error) {
                alert("Error: " + error.code + " " + error.message);
            }
        });

        // date and time (need to fix hour to +12 on pm)
        var date = document.getElementById("datepicker").value;
        var p0 = date.split('-');
        var time = document.getElementById("timepicker").value;
        var p1 = time.split(' ');
        var p2 = p1[0].split(':');
        var datetime = new Date(p0[0], p0[1], p0[2], p2[0], p2[1]);

        // need to change this to save location of selected place
        var locGeo = new Parse.GeoPoint({latitude: upos.coords.latitude, longitude: upos.coords.longitude});

        saveDateInfo(uid, datetime, headline, locationName, locGeo, blind, purpose, desc, age, gender, seekmin, seekmax, seekgen);
        document.getElementById("createDate").reset();
    }

    function saveDateInfo(uid, datetime, headline, locName, locGeo, blind, purpose,
        desc, age, gender, seekmin, seekmax, seekgen) {
        var DateInfo = Parse.Object.extend("DateInfo");
        var dateinfo = new DateInfo();

        dateinfo.set("UserID", uid);
        dateinfo.set("DateString", new Date());
        dateinfo.set("Headline", headline);
        dateinfo.set("LocationName", locName);

        // var locGeo = new Parse.GeoPoint({latitude: -40, longitude: 120});
        dateinfo.set("LocationGeo", locGeo);

        dateinfo.set("Blind", blind);
        dateinfo.set("Purpose", purpose);
        dateinfo.set("Description", desc);

        dateinfo.set("PosterAge", age);
        dateinfo.set("PosterGender", gender);

        dateinfo.set("PosterMinAgePref", seekmin);
        dateinfo.set("PosterMaxAgePref", seekmax);
        dateinfo.set("PosterGenderPref", seekgen);

        dateinfo.save(null, {
            success: function(dateinfo) { },
            error: function(dateinfo, error) {
                alert("error connecting to Parse: " + error);
            }
        });
    }

    google.maps.event.addDomListener(window, 'load', getLocation);
// })();
