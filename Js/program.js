// program.js

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
  	// let hash = md5(pass);

    document.getElementById("error_display").innerHTML = "";
    console.log("Login = " + login + "\nPass = " + pass); // debugging

    // creating an object from the login credentials
    let loginAttempt = {login:login,password:pass}; // WITHOUT HASH
    // let loginAttempt = {login:login,password:hash}; // WITH HASH
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
                    // window.alert("User/Password Combination Incorrect");
                    document.getElementById("error_display").innerHTML = "User/Password Combination Incorrect";
                    return;
                }

                firstName = jsonObject.firstName;
                lastName = jsonObject.lastName;

                saveCookie();

                window.location.href = "loggedIn.html";
            }
        };
        xhr.send(jsonPayload);
    }
    catch(err){
        // window.alert("Login attempt failed, try again");    
        document.getElementById("error_display").innerHTML = "Login attempt failed, try again";
    }

}

function saveCookie(){
    let minutes = 20;
    let date = new Date();
    date.setTime(date.getTime()+(minutes*60*1000));
    document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie(){
    userId = -1;
    let data = document.cookie;
    let splits = data.split(",");
    for(var i = 0; i < splits.length; i++){
        let thisOne = splits[i].trim();
        let tokens = thisOne.split("=");
        if(tokens[0] == "firstName"){
            firstName = tokens[1];
        }
        else if(tokens[0] == "lastName"){
            lastName = tokens[1];
        }
        else if(tokens[0] == "userID"){
            userId = parseInt(tokens[1].trim());
        }
    }

    if(userId < 0){
        wondow.location.href = "index.html";
    }
    else{
        document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
    }
}

function logout(){
    userId = 0;
    firstName = "";
    lastName = "";
    document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = "index.html";
}

function addInformation(){
    // ask database for all user info

    // display in-order
}

function register()
{

    console.log("register has been clicked");

	let first = document.getElementById("first_name").value;
    let last = document.getElementById("last_name").value;
    let login = document.getElementById("username_input").value;
    let pass = document.getElementById("password_input").value;
  
	document.getElementById("error_display").innerHTML = "";

    //json object for the new user being added
	let tmp = {FirstName:first, LastName:last, Login:login, Password:pass};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/create.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
                // window.alert("User has been registered");
                document.getElementById("error_display").innerHTML = "User has been registered";
                
                window.location.href = "loggedIn.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
        // window.alert("An error has occured, please try again");
        document.getElementById("error_display").innerHTML = "An error has occured, please try again";

	}
  
}