var calSum = 0;
var userName;
var gender = "male";
var age = "2-13";
var queryData;
var totalCost = 0.00;
var neededCal;
var sortedData = new Object();
var selectedFood = new Object();
var calData = {male: {}, female: {}};
var femaleCal = [ 1666, 2000, 1800 ];
var maleCal = [ 1733, 2800, 2600 ];
var youngProportion = [ 0.152, 0.31, 0.176, 0.139, 0.223];
var adultProportion = [ 0.205, 0.285, 0.123, 0.16, 0.227 ];

for (let i = 0; i < maleCal.length; i++){
  calData['male'][i] = maleCal[i];
  calData['female'][i] = femaleCal[i];
}


//================================================== selection for the first page. ==========================================//
//-------------------------------------------------- go to the third page ----------------------------------//

$("#customizePage").on("click",function(event){
  userName = $("#userName").val();
  event.preventDefault();
  selectCalories();
  localStorage.setItem("userName",userName);
  localStorage.setItem("age",age);
  localStorage.setItem("gender",gender);
  localStorage.setItem("neededCal", neededCal)
  $.ajax({
      url: "EasyGrocery.php",
      dataType: "json",
      type: "GET",
      data: {output: 'json'},
      success: function(data) {
          localStorage.setItem("queryData",JSON.stringify(data));
          document.location = "thridpage.html";

    },
    error: function(errorThrown) {
      console.log(errorThrown);
    }
  });
});

//================================================= selection for the third page. ==========================================//

//----------------------------- Generate the information WHEN 'thirdPage.html' is opened ------------------------------//

$(document).ready(function() {
  if(window.location.pathname.split("/").pop() == "thirdPage.html"){
    age = localStorage.getItem("age");
    gender = localStorage.getItem("gender");
    userName = localStorage.getItem("userName");
    neededCal = localStorage.getItem("neededCal");
    queryData = JSON.parse(localStorage.getItem("queryData"));
    $("#username").html(userName);
    $("#gender").html(gender);
    $("#age").html(age);
    createData(queryData);
  }
});

//---------------------------------------------- Create data from the data. -------------------------------------------------//

function createData(data){
  for (let d in data){
    let st = "<p>" + d + "</p>";
    for (let i = 0; i < selectedFood[d]['data'].length; i++){
      st += "<img class='img foodImg' cost='" + selectedFood[d]['data'][i]['cost'] + "' cal='" + selectedFood[d]['data'][i]['calories'] + "' value='" + selectedFood[d]['data'][i]['name'] + "' src='" + selectedFood[d]['data'][i]['img'] +"'/>";
    }
    $("#" + d).html(st);
  }

