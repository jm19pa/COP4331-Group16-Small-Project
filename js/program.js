// write the login page
    // check for if user does / doesn't exist

// write the register page
    // check for pre-existing user

// checks for an existing user
    // returns TRUE if user exists
    // returns FALSE if user does not exist

const urlBase = "http://csmajorsvsgorilla.xyz/LAMPAPI";
const extension = "php";

let userId = 0;
let firstName = "";
let lastName = "";

function checkLogin(){ 

    // reseting the parameters below
    userId = 0;
    firstName = "";
    lastName = "";

    // gather's the inputted username and password
    let login = document.getElementById("username_input").value;
    let pass = document.getElementById("password_input").value;

    console.log("Login = " + login + "\nPass = " + pass); // debugging

    // creating an object from the login credentials
    let loginAttempt = {login:login,password:pass};
    let jsonPayload = JSON.stringify(loginAttempt);

    let url = urlBase + "/Login." + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    // attempting to use the login information provided
    try{
        xhr.onreadystatechange = function(){
            if(this.readyState == 4 && this.status == 200){
                let jsonObject = JSON.parse(xhr.responseText);
                userId = jsonObject.id;

                if(userId < 1){
                    window.alert("User/Password Combination Incorrect");
                    return;
                }

                firstName = jsonObject.firstName;
                lastName = jsonObject.lastName;

                window.location.href = "loggedIn.html";
            }
        };
        xhr.send(jsonPayload);
    }
    catch(err){
        window.alert("Login attempt failed, try again");
    }

    // once we get these values, we need to make a request to the database
    // from there, we compare with each of the entries
    // IF we get a matching entry, lets print as so
    // IF we do not get a matching entry, also print
}

function logout(){
    userId = 0;
    firstName = "";
    lastName = "";
    window.location.href = "index.html";
}