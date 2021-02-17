function validform() {

    var a = document.forms["my-form"]["full-name"].value;
    var b = document.forms["my-form"]["email-address"].value;
    var c = document.forms["my-form"]["username"].value;
    var d = document.forms["my-form"]["password"].value;
    var e = document.forms["my-form"]["password"].value;

    if (a == null || a == "") {
        alert("Please Enter Your Full Name");
        return false;
    } else if (b == null || b == "") {
        alert("Please Enter Your Email Address");
        return false;
    } else if (c == null || c == "") {
        alert("Please Enter Your Username");
        return false;
    } else if (d == null || d == "") {
        alert("Please Enter a Password");
        return false;
    } else if (e == null || e == "") {
        alert("Please Confirm your Password");
        return false;
    }
}