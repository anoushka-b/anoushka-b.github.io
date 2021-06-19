//####################################################
//formatter: uses the information provided and converts it to readable clock format
//This function takes in 2 parameters: sun and tz
    //sun is the completed calculation for sunrise/sunset
    //tz is the desired timezone
//This function returns 1 value: t
    //t is the string in clock format
var solarNoon = "";
var bgClicked = false;
function formatter(sun, tz, letter){
    
    var sun = (sun/60) + tz;
    hour = Math.floor(sun);
    mn = Math.floor((sun - hour) * 60);

    var x = hour * 60;
    x += mn;
    if(letter == "n"){
        document.getElementById("myRange").value = x;
    }
    if(letter == "r"){
        document.getElementById("myRange").min = x;
    }
    if(letter == "s"){
        document.getElementById("myRange").max = x;
    }

    if(hour > 11){
        m = "PM";
        if(hour != 12)
            hour = hour - 12;
    }

    else
        m = "AM";

    if(hour <= 9){
        hour = "0" + hour.toString();
    }

    if(mn <= 9){
        mn = "0" + mn.toString();
    }
    
    var t = hour.toString() + ":" + mn.toString() + " " + m;
    return t;    
}
//####################################################
//success: finds and updates the user's current latitude and longitude 
//This function takes in 1 parameter: position
    //position holds the user's current location
//This function does not return any values
function success(position) {
    const latitude  = position.coords.latitude;
    const longitude = position.coords.longitude;    
    document.getElementById("l-lat").value = latitude;
    document.getElementById("l-lon").value = longitude;
    document.getElementById("loader").style.visibility = "hidden";

}
//####################################################
//errorLoc: runs only if the user's current position cannot be located
//This function does not take in any parameters
//This function does not return any values
function errorLoc() {
    window.alert("Unable to locate the user");
    document.getElementById("loader").style.visibility = "hidden";

}
//####################################################
//getCoordinates: attempts to get the user's current position
//This function does not take in any parameters
//This function does not return any values
function getCoordinates(){
    //gets the user's location
    if('geolocation' in navigator){
        document.getElementById("loader").style.visibility = "visible";
        navigator.geolocation.getCurrentPosition(success, errorLoc);
        window.alert("Starting");

    }
    else{
        window.alert("Geolocation is not enabled");
    }

}
//####################################################
function getDate(){
    var d = new Date();
    document.getElementById("t-date").value = (d.getMonth()+1) + "/" + (d.getDate()) + "/" + (d.getFullYear());
}
//####################################################
//bigMath: calculates sunrise and sunset
//This function does not take in any parameters
//This function does not return any values
function bigMath(){
    if(document.getElementById("l-lat").value == "" || document.getElementById("l-lon").value == ""){
        window.alert("Please enter the latitude and longitude values");
        exit(1);
    }
    bgClicked = true;
    var z = document.getElementById("tz");
    var tz = z.value;
    tz = parseInt(tz);
    //var tz = -5;
    //fetches and updates the latitude and longitude values
    var lat = document.getElementById("l-lat").value;
    lat = lat * (Math.PI/180);
    var long = document.getElementById("l-lon").value;

    var td = document.getElementById("t-date").value;
    var to = td.split("/");
    a = new Array();
    a = to;

    a[0] = parseInt(a[0]) - 1;
    a[1] = parseInt(a[1]);
    a[2] = parseInt(a[2]);

    //gets the first day of the year, today's date, and the current hour
    var first = new Date(2021, 0, 1, 0, 0, 0, 0);
    var today = new Date(a[2], a[0], a[1], 0, 0, 0, 0);
    //numdays tells us how far we are into the year
    var numDays = (today.getTime() - first.getTime())/(1000*3600*24)+1;
    numDays = Math.floor(numDays);

    var hr = 6;
    var yr = today.getFullYear();

    var diy = 365;
    if(yr % 4 == 0){
        diy = 366;
    }

    //equation for the fractional year
    var fracYear = ((2*Math.PI)/diy) * (numDays - 1 + ((hr-12)/24))
    //equation of time with respect to the fractional year
    var timeEQ = 229.18*(0.000075 + (0.001868 * Math.cos(fracYear)) - (.032077 * Math.sin(fracYear)) - (.014615 * Math.cos(2*fracYear)) - (.040849 * Math.sin(2* fracYear)))
    //the solar declination angle --> convert it to radians
    var solarDQ = (.006918 - (0.399912 * Math.cos(fracYear)) + (.070257 * Math.sin(fracYear)) - (.006758 * Math.cos(2*fracYear)) + (.000907 * Math.sin(2*fracYear)) - (.002697 * Math.cos(3*fracYear)) + (.00148 * Math.sin(3*fracYear)))

    //solving for the solar hour angle when the zenith is set to 90.833 degrees --> converted to radians as 1.58533492
    var hourAn = (Math.cos(1.58533492)/(Math.cos(lat) * Math.cos(solarDQ))) - (Math.tan(lat) * Math.tan(solarDQ));
    hourAn = Math.acos(hourAn);
    hourAn = hourAn * (180/Math.PI);
    //final calculations:
    var sunrise = 720 - 4* (hourAn + parseFloat(long)) - timeEQ;
    var snoon = 720 - 4 * long - timeEQ;    
    var sunset = 720 - 4 * (long - hourAn) - timeEQ;

    var sr = formatter(sunrise, tz, "r");
    var sn = formatter(snoon, tz, "n");

    var ss = formatter(sunset, tz, "s");

    document.getElementById("sr").innerHTML = "Sunrise: " + sr;
    document.getElementById("sn").innerHTML = "Solar Noon: " + sn;
    document.getElementById("ss").innerHTML = "Sunset: " + ss;
    document.getElementById("hrs").innerHTML = sn;
    document.getElementById("ltt").innerHTML = "";
    document.getElementById("myRange").disabled = false;
    solarNoon = sn;

}


function srClick(){
    if(bgClicked == true){
        document.getElementById("myRange").value = document.getElementById("myRange").min;
        timothy();
    }
}
function snClick(){
    if(bgClicked == true){
        document.getElementById("myRange").value = solarNoon;
        timothy();
    }
}
function ssClick(){
    if(bgClicked == true){
        document.getElementById("myRange").value = document.getElementById("myRange").max;
        timothy();
    }
}

function tim1(){
    var today = new Date();
    var h = today.getHours();
    if(h >=12){
        document.getElementById("ltt").innerHTML = "PM";
        if(h != 12)
            h = h-12;
    }else{
        document.getElementById("ltt").innerHTML = "AM";
        if(h==0)
            h = 12;
        }

    var m = today.getMinutes();
    if(m <= 9){
        m = "0" + m.toString();
    }

    var x = today.getHours()*60 + today.getMinutes();

    document.getElementById("hrs").innerHTML = h.toString() + ":" + m.toString();
    document.getElementById("myRange").value = x;
    document.getElementById("myRange").disabled = true;
}

function timothy(){
    var x = document.getElementById("myRange");
    var mins = x.value % 60;
    if(mins <= 9){
        mins = "0" + mins.toString();
    }
    var hours = Math.floor(x.value / 60);
    if(hours > 11){
        document.getElementById("ltt").innerHTML = "PM";
        if(hours != 12)
          hours = hours-12;
    }else
        document.getElementById("ltt").innerHTML = "AM";

    document.getElementById("hrs").innerHTML = hours.toString() + ":" + mins.toString();

}
