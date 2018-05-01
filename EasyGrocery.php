<?php

    $methodType = $_SERVER['REQUEST_METHOD'];
    
      if ($methodType === 'GET') {
        if(isset($_GET['output'])) {
          $output = $_GET['output'];
            // YOUR CODE GOES HERE TO GRAB THE DATA FROM THE DATABASE
            // (I.E., YOUR TRY CATCH)
          
          $servername = "localhost";
          $dblogin = "root";
          $dbpassword = "";
          $dbname = "food";
          $tableNames = array("meat", "grains", "dairy", "veggies_and_fruits", "other");
          
          try {
            
            $conn = new PDO("mysql:host=$servername;dbname=$dbname", $dblogin, $dbpassword);
            
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            
            for($i = 0; $i < 5; $i++){
              $sql[$i] = "SELECT * FROM $tableNames[$i]";
              $statement = $conn->prepare($sql[$i]);
              $statement->execute();
              $data[$tableNames[$i]] = $statement->fetchAll(PDO::FETCH_ASSOC);
            }
          } catch(PDOException $e) {
            echo "<p style='color: red;'>From the SQL code: $sql</p>";
            $error = $e->getMessage();
            echo "<p style='color: red;'>$error</p>";
          }
          
            /////////////////////////////////////////////////////////

          $json = json_encode($data);
          echo $json;
          
        } else {
            echo "Need a type of output!";
        }

    } else {
        echo $data;
    }
?>