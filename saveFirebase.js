
  // Initialize Firebase
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

$(".saveData").on("click", function(){
  let userName = "Game";
  for (let d in selectedFood){
    for (let i = 0; i < selectedFood[d]['data'].length; i++) {
      for (let x in selectedFood[d]['data'][i]) {
        console.log(x + ": " + selectedFood[d]['data'][i][x]);
        let pathName = userName + "/" + d + "/" + selectedFood[d]['data'][i]['name'] + "/" + x;
        firebaseRef.child(pathName).set(selectedFood[d]['data'][i][x]);
      }
    }
  }
});