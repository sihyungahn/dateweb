/*
    Record for a user's date suggestion.

    example:
        var dateInstance = DateInfo.createNew("user",
                new Date(2015, 03, 07, 12, 00), "The Cinema", 47.616831,
                -122.329461, true, "movie",
                "Let's watch the new Alan Turing movie!");

    userId - the unique string identifier provided by Facebook.
    dateTime - time/date of the meeting (pass in new Date(YYYY, MM, DD, hh, mm))
    blind - true or false
 */


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
    return;
}
