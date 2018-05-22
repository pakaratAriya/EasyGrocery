var playername = $("#playername")[0];

 var config = {
    apiKey: "AIzaSyCzABecdstnYpHXmL9RmPbLsIezpqQOF8g",
    authDomain: "easygrocery-b41d7.firebaseapp.com",
    databaseURL: "https://easygrocery-b41d7.firebaseio.com",
    projectId: "easygrocery-b41d7",
    storageBucket: "easygrocery-b41d7.appspot.com",
    messagingSenderId: "320819117084"
  };
  firebase.initializeApp(config);

  var firebaseRef = firebase.database().ref();

function goToGame(){
  if (playername.value != ""){
    localStorage.setItem("playername",playername.value);
    document.location = "foodHero.html";
  }
}

function exitGame(){
  document.location = "../index.html";
}

firebase.database().ref("scoreBoard").on('value', function(snapshot) {
  loadedData = snapshot.val();
  let scoreInfo = "<table><tr><th>#</th><th>name</th><th>score</th>";
  for (let i = 0; i < 10; i++){
    if (loadedData[i]!=null){
      scoreInfo += "<tr>"
      + "<td>" + (i+1) + "</td>"
      + "<td>" + loadedData[i]['playername'] + "</td>"
      + "<td>" + loadedData[i]['score'] + "</td>"
      + "</tr>";
    }
    
  }
  scoreInfo += "</table>";
  $("#score").html(scoreInfo);
});


