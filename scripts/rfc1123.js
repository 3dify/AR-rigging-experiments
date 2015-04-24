(function () {
 
    var dayNames  = ["Sun", "Mon", "Tues", "Wednes", "Thurs", "Fri", "Satur"],
        monthAbbr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
 
    // ddd, dd MMM yyyy HH:mm:ss GMT
    Date.prototype.rfc1123 = function () {
        var self = this,
            getVal = function (name) {
                var val = "" + self["get" + name]();
                return val.length > 1 ? val : "0" + val;
            };
 
        return dayNames[+getVal("Day")]         // ddd
                + "day, "
                + getVal("Date")                // dd
                + " "
                + monthAbbr[+getVal("Month")]   // MMM
                + " "
                + getVal("FullYear")            // yyyy
                + " "
                + getVal("Hours")               // HH
                + ":"
                + getVal("Minutes")             // mm
                + ":"
                + getVal("Seconds")             // ss
                + " GMT";
    };
 
}());