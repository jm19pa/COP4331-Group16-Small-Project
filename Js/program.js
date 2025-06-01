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
    
    document.getElementById("error_display").innerHTML = "";

    // gather's the inputted username and password
    let login = document.getElementById("username_input").value;
    let pass = document.getElementById("password_input").value;
  	// let hash = md5(pass);

    let isBlank = false;

    if(checkBlank(login, "username_input") == true) isBlank = true;
    if(checkBlank(pass, "password_input") == true) isBlank = true;
  
    if(isBlank == true){
        login.reset();
        return;
    }

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
        else if(tokens[0] == "userId"){
            userId = parseInt(tokens[1].trim());
        }
    }

    if(userId < 0){
        window.location.href = "index.html";
    }
    else{
        // document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
        console.log(userId);
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

function checkBlank(inp, location){
    let label = location + "_label";
    document.getElementById(label).innerHTML = document.getElementById(label).innerHTML.replace("*", "").replace(" ", "");
    document.getElementById(label).style.color = "white";
    if(inp == ""){
        document.getElementById("error_display").innerHTML = "Fill out the forms in red marked by *";
        document.getElementById(label).style.color = "darkred";
        document.getElementById(label).innerHTML += " *";
        return true;
    }
    else return false;
}

function register()
{

    console.log("register has been clicked");
	document.getElementById("error_display").innerHTML = "";

	let first = document.getElementById("first_name").value;
    let last = document.getElementById("last_name").value;
    let login = document.getElementById("username_input").value;
    let pass = document.getElementById("password_input").value;

    let isBlank = false;

    if(checkBlank(first, "first_name") == true) isBlank = true;
    if(checkBlank(last, "last_name") == true) isBlank = true;
    if(checkBlank(login, "username_input") == true) isBlank = true;
    if(checkBlank(pass, "password_input") == true) isBlank = true;
  
    if(isBlank == true) return;

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

function addContact(){
    let first = document.getElementById("first_name").value;
    let last = document.getElementById("last_name").value;
    let phone = document.getElementById("phone").value;
    let email = document.getElementById("email").value;  

    let isBlank = false;

    if(checkBlank(first, "first_name") == true) isBlank = true;
    if(checkBlank(last, "last_name") == true) isBlank = true;
    if(checkBlank(phone, "phone") == true) isBlank = true;
    if(checkBlank(email, "email") == true) isBlank = true;

    if(isBlank == true) return;

    readCookie();

    console.log(first + " " + last + " " + phone + " " + email + " " + userId);

    let tmp = {FirstName:first, LastName:last, Email:email, Phone:phone, UserID:userId};
    let jsonPayload = JSON.stringify( tmp );

    let url = urlBase + '/add.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try
    {
        xhr.onreadystatechange = function() 
        {
        if (this.readyState == 4 && this.status == 200) 
        {
            console.log("Contact has been added");
            // Clear input fields in form 
            document.getElementById("first_name").value = "";
            document.getElementById("last_name").value = "";
            document.getElementById("phone").value = "";
            document.getElementById("email").value = "";
            // reload contacts table and switch view to show
            loadContacts();
        }
        };
        xhr.send(jsonPayload);
    }
    catch(err)
    {
        document.getElementById("error_display").innerHTML = "An error has occured, please try again";
    }
        
}

function loadContacts() {

    readCookie();

    let tmp = { search: "", UserID: userId};

    let jsonPayload = JSON.stringify(tmp);
    let url = urlBase + '/search.' + extension;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let jsonObject = JSON.parse(xhr.responseText);
            console.log(jsonObject.results);
            if (jsonObject.error) {
                console.log(jsonObject.error);
                return;
            }

            // Get reference to the table
            let table = document.getElementById("contactTable");

            // Delete all rows except the header (index 0)
            while (table.rows.length > 1) {
                table.deleteRow(1); 
            }


            for (let i = 0; i < jsonObject.results.length; i++) {
                let contact = jsonObject.results[i];

                let newRow = document.createElement("tr");

                Object.values(contact).forEach((value) => {
                    let cell = document.createElement("td");
                    cell.innerText = value;
                    newRow.appendChild(cell);
                })
                
                table.appendChild(newRow);

                // Optional: Store the ID for later use (e.g., in edit/delete functions)
                ids[i] = contact.ID;
            }
        }
        };

        xhr.send(jsonPayload);
    } catch (err) {
        console.log(err.message);
    }
}