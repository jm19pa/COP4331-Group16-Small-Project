<?php

	$inData = getRequestInfo();
	
	$searchResults = "";
	$searchCount = 0;

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("select * from Contacts where (FirstName like ? OR LastName like ? OR Phone like ? OR Email like ?) and UserID=?");
		$searchVar = "%" . $inData["search"] . "%";
		$stmt->bind_param("sssss", $searchVar, $searchVar, $searchVar, $searchVar, $inData["userId"]);
		if(!$stmt->execute()){
			error_log("Query failed: " . $stmt->error);
		}

		
		$result = $stmt->get_result();
		
		while($row = $result->fetch_assoc())
		{
			if( $searchCount > 0 )
			{
				$searchResults .= ",";
			}
      
			$searchCount++;
			$searchResults .= '{"ID" : "' . $row["ID"] . '", "FirstName" : "' . $row["FirstName"] . '", "LastName" : "' . $row["LastName"] . '", "Email" : "' . $row["Email"] . '", "Phone" : "' . $row["Phone"] . '"}';
		}
		
		if( $searchCount == 0 )
		{
			returnWithError( "No Records Found" );
		}
		else
		{
			returnWithInfo( $searchResults );
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
		$retValue = '{"id":0,"FirstName":"","LastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $searchResults )
	{
		$retValue = '{"results":[' . $searchResults . '],"error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>