// program.js

const urlBase = "http://csmajorsvsgorilla.xyz/LAMPAPI";
const extension = "php";

let userId = 0;
let firstName = "";
let lastName = "";
let hidden = true;

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

function toggleVisibility(location){
    if(hidden == false){
        location.style.display = "none";
        hidden = true;
    }
    else{
        location.style.display = "flex";
        hidden = false;
    }
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

// function fillPhone(){
//     // make sure user inputs a phone number in the following order: ###-###-####

//     let inputtedPhone = document.getElementById("phone").value;
    
//     for(let i = 0; i < inputtedPhone.length; i++){
//         if(i == 3 || i == 7){ // check for dashes
//             if(inputtedPhone[i] != '-') document.getElementById("error_display").innerHTML = "Input phone # in the format: ###-###-####";
//             else if(inputtedPhone[i] == '-') document.getElementById("error_display").innerHTML = "";
//         }
//         else{ // check for numbers
//             if(Number.isInteger(inputtedPhone[i]) == false) document.getElementById("error_display").innerHTML = "Input phone # in the format: ###-###-####";
//             else if(Number.isInteger(inputtedPhone[i]) == true) document.getElementById("error_display").innerHTML = "";
//         }
//     }
// }

// function fillMail(){
//     // make sure a user inputs a mail address in the order of: WORDS@SOMETHING.COM

//     let inputtedMail = document.getElementById("email").value;

//     let index = 0;

//     for(index; index < inputtedMail.length; index++){
//         if(inputtedMail[index] == '@') break;
//     }

//     for(index; index < inputtedMail.length; index++){
//         if(inputtedMail[index] == '.') return true;
//     }

//     return false;
// }

function register()
{
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
    let tmp = {
        search: document.getElementById("user_search").value, // live input if available
        userId: userId
    };

    let jsonPayload = JSON.stringify(tmp);
    let url = urlBase + "/search." + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    console.log("Raw response:", xhr.responseText);
    xhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let jsonObject = JSON.parse(xhr.responseText);

            if (jsonObject.error && jsonObject.error !== "") {
                document.getElementById("error_display").innerHTML = jsonObject.error;
                return;
            }

            let table = document.getElementById("contactTable");

            // Clear previous rows except the header
            while (table.rows.length > 1) {
                table.deleteRow(1);
            }

            for (let i = 0; i < jsonObject.results.length; i++) {
                let contact = jsonObject.results[i];
                let contactId = contact.ID;

                let row = table.insertRow(-1);
                row.id = "row" + i;

                row.insertCell(0).innerHTML = `<span class = "first_Name" id="first_Name${i}">${contact.FirstName}</span>`;
                row.insertCell(1).innerHTML = `<span class = "last_Name" id="last_Name${i}">${contact.LastName}</span>`;
                row.insertCell(2).innerHTML = `<span class = "email" id="email${i}">${contact.Email}</span>`;
                row.insertCell(3).innerHTML = `<span class = "phone" id="phone${i}">${contact.Phone}</span>`;
                row.insertCell(4).innerHTML = `
                    <div class="button-row">
                        <button onclick="edit_row(${i}, ${contactId})"><img src="Images/ChangeIcon.webp" title="Edit"></button>
                        <button onclick="deleteContact(${i}, ${contactId})"><img src="Images/TrashCan.webp" title="Delete"></button>
                    </div>
                `;
            }

        }
    };

    xhr.send(jsonPayload);
}


function searchContacts() {
    const content = document.getElementById("searchText");
    const selections = content.value.toUpperCase().split(' ');
    const table = document.getElementById("contacts");
    const tableRow = table.getElementsByTagName("tr");// Table Row

    for (let i = 0; i < tableRow.length; i++) {
        const firstNameTBL = tableRow[i].getElementsByTagName("td")[0];// Table Data: First Name
        const lastNameTBL = tableRow[i].getElementsByTagName("td")[1];// Table Data: Last Name

        if (firstNameTBL && lastNameTBL) {
            const txtValue_fn = firstNameTBL.textContent || firstNameTBL.innerText;
            const txtValue_ln = lastNameTBL.textContent || lastNameTBL.innerText;
            tableRow[i].style.display = "none";

            for (selection of selections) {
                if (txtValue_fn.toUpperCase().indexOf(selection) > -1) {
                    tableRow[i].style.display = "";
                }
                if (txtValue_ln.toUpperCase().indexOf(selection) > -1) {
                    tableRow[i].style.display = "";
                }
            }
        }
    }
}

//This is code we need to talk about:
function edit_row(id, contactId) {
    const id_val = contactId;

    // Get cell references
    const firstNameCell = document.getElementById("first_Name" + id);
    const lastNameCell = document.getElementById("last_Name" + id);
    const emailCell = document.getElementById("email" + id);
    const phoneCell = document.getElementById("phone" + id);

    // Get current values
    const namef_data = firstNameCell.innerText;
    const namel_data = lastNameCell.innerText;
    const email_data = emailCell.innerText;
    const phone_data = phoneCell.innerText;

    // Replace with inputs
    firstNameCell.innerHTML = `<input type="text" id="namef_text${id}" value="${namef_data}">`;
    lastNameCell.innerHTML = `<input type="text" id="namel_text${id}" value="${namel_data}">`;
    emailCell.innerHTML = `<input type="text" id="email_text${id}" value="${email_data}">`;
    phoneCell.innerHTML = `<input type="text" id="phone_text${id}" value="${phone_data}">`;

    // Add keydown listener to each input
    const saveOnEnter = (event) => {
        if (event.key === "Enter") {
        const namef_val = document.getElementById("namef_text" + id).value;
        const namel_val = document.getElementById("namel_text" + id).value;
        const email_val = document.getElementById("email_text" + id).value;
        const phone_val = document.getElementById("phone_text" + id).value;

        // Replace inputs with updated text
        firstNameCell.innerHTML = namef_val;
        lastNameCell.innerHTML = namel_val;
        emailCell.innerHTML = email_val;
        phoneCell.innerHTML = phone_val;

        // Prepare update payload
        const tmp = {
            FirstName: namef_val,
            LastName: namel_val,
            Email: email_val,
            Phone: phone_val,
            ID: id_val
        };

        const jsonPayload = JSON.stringify(tmp);
        const url = urlBase + '/update.' + extension;

        // Send update request
        const xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        try {
            xhr.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                console.log("Contact has been updated");
                readCookie();
                loadContacts();
            }
            };

            console.log("Update payload:", tmp);
            xhr.send(jsonPayload);
        } catch (err) {
            console.log(err.message);
        }
        }
    };

    // Attach event listener to all four input fields
    document.getElementById("namef_text" + id).addEventListener("keydown", saveOnEnter);
    document.getElementById("namel_text" + id).addEventListener("keydown", saveOnEnter);
    document.getElementById("email_text" + id).addEventListener("keydown", saveOnEnter);
    document.getElementById("phone_text" + id).addEventListener("keydown", saveOnEnter);
}


function deleteContact(rowIndex, contactId)
{

    let FirstName = document.getElementById("first_Name" + rowIndex).innerText;
    let LastName = document.getElementById("last_Name" + rowIndex).innerText;
    //let first = substring(0, FirstName.length);
    //let last = substring(0, LastName.length);

    let tmp = {id:contactId, UserID: userId};
    let jsonPayload = JSON.stringify( tmp );

    let url = urlBase + '/delete.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    document.getElementById("error_display").innerHTML = "";

    let check = confirm('Are you sure you want to delete ' + FirstName + ' ' + LastName + '?');
    if (check === true)
    {
        document.getElementById("row" + rowIndex).outerHTML = "";

        try
        {
            xhr.onreadystatechange = function() 
            {
                if(this.readyState == 4 && this.status == 200)
                {
                    let jsonObject = JSON.parse( xhr.responseText );
    
                    document.getElementById("error_display").innerHTML = "deleting Contact successful";
                }
            };
            xhr.send(jsonPayload);
        }
    
        catch(err)
        {
            document.getElementById("error_display").innerHTML = err.message;
        }
    }
}

