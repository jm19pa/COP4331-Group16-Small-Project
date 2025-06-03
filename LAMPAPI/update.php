<?php
	$inData = getRequestInfo();
	
    $firstName = $inData["FirstName"];
	$lastName = $inData["LastName"];
	$email = $inData["Email"];
	$phone = $inData["Phone"];
	$id = $inData["ID"];
	
	

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("UPDATE Contacts SET FirstName = ?, LastName = ?, Email = ?, Phone = ? WHERE ID = ?");
		$stmt->bind_param("ssssi", $firstName, $lastName, $email, $phone, $id);
		$stmt->execute();

		if ($stmt->affected_rows == 0) {
			returnWithError("No rows updated. SQL may have run but nothing changed. ID: $id");
		} else {
			returnWithError("");
		}

		$stmt->close();
		$conn->close();
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
