<?php
	$inData = getRequestInfo();
	
    $firstName = $inData["FirstName"];
	$lastName = $inData["LastName"];
    $email = $inData["Email"];
	$phone = $inData["Phone"];
    $userID = $inData["UserID"];
    $id = $inData["ID"];
	
	

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("UPDATE Contacts SET FirstName=?, LastName=?, Email=?, Phone=?, UserID=? WHERE ID = ?");
		$stmt->bind_param("ssssii", $firstName, $lastName, $email, $phone, $userID, $id);
		$stmt->execute();
		$stmt->close();
		$conn->close();
		returnWithError("");
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
?>