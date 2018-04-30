var calSum=0;
var userName;
var gender = "male";
var age = "2-13";
var queryData;
var totalCost = 0.00;
var ageChoice=0;
var neededCal;
var sortedData = new Object();
var selectedFood = new Object();
// calories that the per son need



var necCal = 0;
var calData = {male: {}, female: {}};
  
var femaleCal = [ 1666, 2000, 1800 ];
var maleCal = [ 1733, 2800, 2600 ];
for (var i = 0; i < maleCal.length; i++){
  calData['male'][i] = maleCal[i];
  calData['female'][i] = femaleCal[i];
}

$(".genderSelection").on("click", function(event){
  $(".genderSelection").removeClass("selectedGender");
  $(this).addClass("selectedGender");
  gender = $(this).attr("value");
});

$(".ageSelection").on("click", function(event){
  $(".ageSelection").removeClass("selectedAge");
  $(this).addClass("selectedAge");
  age = $(this).attr("value");
  selectCalories();
});


  
$(".submit").on("click",function(event){
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
          
          document.location = "secondpage.html";

    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(errorThrown);
    }
  });
  
  
});


function createTable(data){
  

  sortData(data);
  getFoodData();
  for (var d in selectedFood){
    var st = "<p>" + d + "</p>";
    for (var i = 0; i < selectedFood[d]['data'].length; i++){
      st += "<img class='img foodImg' cost='" + selectedFood[d]['data'][i]['cost'] + "' cal='" + selectedFood[d]['data'][i]['calories'] + "' value='" + selectedFood[d]['data'][i]['name'] + "' src='" + selectedFood[d]['data'][i]['img'] +"'/>";
    }
    $("#" + d).html(st);
  }
  
  
  $(".foodImg").on("click", function(event){
    console.log($(this).attr("cost"));
    if($(this).hasClass("selectedFood")){
      calSum -= ($(this).attr("cal"));
      totalCost -= parseFloat($(this).attr("cost"));
    } else {
      calSum += ($(this).attr("cal"));
      totalCost += parseFloat($(this).attr("cost"));
    }
    $(this).toggleClass("selectedFood");
    calculateCalories();
});

    
}

function calculateCalories(){
  $("#calories").html("Total Calories: " + calSum);;
  $("#bot").html("<p>The total estamated cost is:  <span id='cost'> " + totalCost.toFixed(2) + "</span> </p>")
}

$(document).ready(function() {
  if(window.location.pathname.split("/").pop() == "secondpage.html"){
    age = localStorage.getItem("age");
    gender = localStorage.getItem("gender");
    userName = localStorage.getItem("userName");
    neededCal = localStorage.getItem("neededCal");
    queryData = JSON.parse(localStorage.getItem("queryData"));
    $("#username").html(userName);
    $("#gender").html(gender);
    $("#age").html(age);
    createTable(queryData);
  }
  
});

function selectCalories(){
  var ageIndex = 0;
  switch (age) {
    case "2-13":
      ageIndex = 0;
      break;
    case "14-18":
      ageIndex = 1;
      break;
    case "19-51+":
      ageIndex = 2;
      break;
  }
  neededCal = calData[gender][ageIndex];
}

function sortData(data){
  var restrictedIndex = new Array();

  for (var d in data){
    sortedData[d] = new Object();
    sortedData[d]['data'] = new Array();
    sortedData[d]['min'] = parseFloat(data[d][0]['calories']);
    sortedData[d]['max'] = parseFloat(data[d][0]['calories']);
    for (var i = 0; i < data[d].length; i++){
      sortedData[d]['max'] = (sortedData[d]['max'] > parseFloat(data[d][i]['calories'])) ?
          sortedData[d]['max'] : parseFloat(data[d][i]['calories']);
      sortedData[d]['min'] = (sortedData[d]['min'] < parseFloat(data[d][i]['calories'])) ?
          sortedData[d]['min'] : parseFloat(data[d][i]['calories']);
      if(sortedData[d]['max'] < parseFloat(data[d][i]['calories'])){
        sortedData[d]['max'] = parseFloat(data[d][i]['calories']);
      }
      if(sortedData[d]['min'] > parseFloat(data[d][i]['calories'])){
        sortedData[d]['min'] = parseFloat(data[d][i]['calories']);
      }
      //console.log(d + i);
    }
    
    for (var i = 0; i < data[d].length; i++){
      
      
      var minValue = parseFloat(sortedData[d]['max']);
      
      for (var j = 0; j < data[d].length; j++) {
        if (minValue >= parseFloat(data[d][j]['calories']) && !restrictedIndex.includes(j)) {
          sortedData[d]['data'][i] = data[d][j];
          minValue = parseFloat(data[d][j]['calories']);
          restrictedIndex[i] = j;
        }

      }
    }
    restrictedIndex = new Array();
  }

}

function getFoodData(){
  var calRemaining = new Array();
  var calIndex = 0;
  for (var i = 0; i < 5; i++){
    calRemaining[i] = neededCal/5;   
  }
  var foodIndex =0;
  for (var d in sortedData){
    selectedFood[d] = new Object();
    selectedFood[d]['data'] = new Array();
    foodIndex = 0;
    while (calRemaining[calIndex] > sortedData[d]['min']) {
      var maxIndex = 0;
          
      for (var i in sortedData[d]['data']) {
        if(sortedData[d]['data'][i]['calories'] <= calRemaining[calIndex]) {
          maxIndex++;
        } else {
          break;
        }
      }
      var randIndex = Math.floor(Math.random() * maxIndex);
      selectedFood[d]['data'][foodIndex] = sortedData[d]['data'][randIndex];
        //console.log(d+ selectedFood[d]['data'][foodIndex]['calories']);
      
      calRemaining[calIndex] -= parseFloat(selectedFood[d]['data'][foodIndex]['calories']);
      foodIndex++;
      //console.log(calRemaining[calIndex]);
    }
    calIndex++;
  }

}

  