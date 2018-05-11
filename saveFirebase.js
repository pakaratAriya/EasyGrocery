
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

$(document).ready(function(){
      userName = localStorage.getItem("userName");
});

$(".saveBtn").on("click", function(){
  
  if(userName != "undefined"){
    let saveNumber = $(this).attr("value");
    firebaseRef.child(userName + "/" + saveNumber).remove();
    for (let d in selectedFood){
      for (let i = 0; i < selectedFood[d]['data'].length; i++) {
        for (let x in selectedFood[d]['data'][i]) {
          let pathName = userName + "/" + saveNumber + "/" + d + "/" + i + "/"  + x;
          firebaseRef.child(pathName).set(selectedFood[d]['data'][i][x]); 
        }
      }
    }
    window.alert("Saved successfully");
    $("#main").toggleClass("blur");
    $("#saveContent").fadeToggle("slow","linear");
  } else {
    window.alert("Please log in Facebook");
  }
});

$("#openSaveData").on("click", function(){
    $("#main").toggleClass("blur");
    $("#saveContent").fadeToggle("slow","linear");
});

$("#openLoadData").on("click", function(){
  $("#content").toggleClass("blur");
  $("#lists").fadeToggle("slow","linear");
});

$(".cancelSaveBtn").on("click", function(){
    $("#main").toggleClass("blur");
    $("#saveContent").fadeToggle("slow","linear");
});

$(".cancelLoadBtn").on("click", function(){
    $("#content").toggleClass("blur");
  $("#lists").fadeToggle("slow","linear");
});

// copied loaded food iteam(from user databse) to selectedFood and selectedFood.

$("#loadData").on("click", function(){
  if (userName == "undefined"){
    return;
  }
  let saveNumber = $(this).attr("value");
  let pathName = userName + saveNumber;
  foodSelection = new Array();
  firebase.database().ref(pathName).on('value', function(snapshot) {
    let loadedData = snapshot.val();
    for (let d in loadedData){
      for(let i in loadedData[d]) {
        loadedData[d][i]['catagory'] = d;
        foodSelection.push(loadedData[d][i]);
      }
    }
    loadFromSelection = true;
    localStorage.setItem("loadFromSelection",loadFromSelection);
    localStorage.setItem("foodSelection", JSON.stringify(foodSelection));
    document.location = "secondpage.html";
  })
});