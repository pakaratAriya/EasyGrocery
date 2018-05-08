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
var loadFromSelection = false;
var foodSelection = new Object();

for (let i = 0; i < maleCal.length; i++){
  calData['male'][i] = maleCal[i];
  calData['female'][i] = femaleCal[i];
}


//================================================== selection for the first page. ==========================================//

//-------------------------------------------------- select the gender for the individual ----------------------------------//

$(".genderSelection").on("click", function(event){
  $(".genderSelection").removeClass("selectedGender");
  $(this).addClass("selectedGender");
  gender = $(this).attr("value");

});

//-------------------------------------------------- select the age for the individual ----------------------------------//

$(".ageSelection").on("click", function(event){
  $(".ageSelection").removeClass("selectedAge");
  $(this).addClass("selectedAge");
  age = $(this).attr("value");
  selectCalories();
});

//-------------------------------------------------- go to the second page ----------------------------------//

$(".submit").on("click",function(event){
  userName = $("#userName").val();
  event.preventDefault();
  loadFromSelection = false;
  selectCalories();
  localStorage.setItem("userName",userName);
  localStorage.setItem("age",age);
  localStorage.setItem("gender",gender);
  localStorage.setItem("neededCal", neededCal);
  localStorage.setItem("loadFromSelection", loadFromSelection);
  $.ajax({
      url: "EasyGrocery.php",
      dataType: "json",
      type: "GET",
      data: {output: 'json'},
      success: function(data) {
          localStorage.setItem("queryData",JSON.stringify(data));
          document.location = "secondpage.html";
    },
    error: function(errorThrown) {
      console.log(errorThrown);
    }
  });
});

//================================================= selection for the second page. ==========================================//

//----------------------------- Generate the information WHEN 'secondpage.html' is opened ------------------------------//

$(document).ready(function() {
  if(window.location.pathname.split("/").pop() == "secondpage.html"){
    age = localStorage.getItem("age");
    gender = localStorage.getItem("gender");
    userName = localStorage.getItem("userName");
    neededCal = localStorage.getItem("neededCal");
    queryData = JSON.parse(localStorage.getItem("queryData"));
    loadFromSelection = localStorage.getItem("loadFromSelection");
    foodSelection = JSON.parse(localStorage.getItem("foodSelection"));
    $("#username").html(userName);
    $("#gender").html(gender);
    $("#age").html(age);
    createData(queryData);

  }
});

//---------------------------------------------- Create data from the data. -------------------------------------------------//

function createData(data){
  if (loadFromSelection == 'false') {
    // sort all the data by calories.
    sortData(data);
    // pick the item randomly to fulfill the calories that the user needs.
    getFoodData();
  } else {
    sortDataFromSelection(foodSelection);
  }
  displayFoodItems(selectedFood);
  
    calculateCalories();
  //------------------------------------------------- Select and deselect the food items ---------------------------------//


}
  
  function displayFoodItems(myFoodData){
        console.log(myFoodData);
    for (let d in myFoodData){
    let st = "<p class='label'>" + d + "</p><div class='forRow'>";
    if (myFoodData[d]['data'] == 0){
      $("#" + d).html("");
    }
    for (let i = 0; i < myFoodData[d]['data'].length; i++){
      st += "<div class='img foodBlock' cost='"
      + myFoodData[d]['data'][i]['cost']
      + "' cal='"
      + myFoodData[d]['data'][i]['calories']
      + "' value='"
      + myFoodData[d]['data'][i]['name']
      + "' src='"
      + myFoodData[d]['data'][i]['img']
      + "'><img class='img foodImg' cost='"
      + myFoodData[d]['data'][i]['cost']
      + "' cal='"
      + myFoodData[d]['data'][i]['calories']
      + "' value='"
      + myFoodData[d]['data'][i]['name']
      + "' src='"
      + myFoodData[d]['data'][i]['img']
      + "' ><h6>"
      + myFoodData[d]['data'][i]['name']
      + "</h6></div>";

      totalCost += parseFloat(myFoodData[d]['data'][i]['cost']);  

    $("#" + d).html(st);
  }
  }
  
  
    $(".foodBlock").on("click", function(event){
    if($(this).hasClass("selectedFood")){
      calSum += ($(this).attr("cal"));
      totalCost += parseFloat($(this).attr("cost"));
    } else {
      calSum -= ($(this).attr("cal"));
      totalCost -= parseFloat($(this).attr("cost"));
    }
    $(this).toggleClass("selectedFood");
    calculateCalories();

  });  
}
//-------------------------------------- Show the result of calories that the user needs ------------------------------------//


function calculateCalories(){
  $("#calories").html("Total Calories: " + calSum);;
  $("#bot").html("<p>Total Estamated Cost : <span id='cost'> " + totalCost.toFixed(2) + "</span> </p>")
}

//---------------------------------------- Select the calories by the first page -------------------------------------------//

function selectCalories(){
  let ageIndex = 0;
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

//--------------------------------------------  sort all the data by calories. ----------------------------------------------//

function sortData(data){
  let restrictedIndex = new Array();
  for (let d in data){
    sortedData[d] = new Object();
    sortedData[d]['data'] = new Array();
    sortedData[d]['min'] = parseFloat(data[d][0]['calories']);
    sortedData[d]['max'] = parseFloat(data[d][0]['calories']);
    for (let i = 0; i < data[d].length; i++){
      if(sortedData[d]['max'] < parseFloat(data[d][i]['calories'])){
        sortedData[d]['max'] = parseFloat(data[d][i]['calories']);
      }
      if(sortedData[d]['min'] > parseFloat(data[d][i]['calories'])){
        sortedData[d]['min'] = parseFloat(data[d][i]['calories']);
      }
    }

    for (let i = 0; i < data[d].length; i++){


      let minValue = parseFloat(sortedData[d]['max']);

      for (let j = 0; j < data[d].length; j++) {
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

//----------------------- pick the item randomly to fulfill the calories that the user needs. -----------------------------//

function getFoodData(){
  let calRemaining = new Array();
  let calIndex = 0;
  let calFactor = 0;
  for (let i = 0; i < 5; i++){
    if (age = "19-51+") {
      calFactor = adultProportion[i];
    } else {
      calFactor = youngProportion[i];
    }
    calRemaining[i] = neededCal * calFactor;
  }
  let foodIndex =0;
  for (let d in sortedData){
    selectedFood[d] = new Object();
    selectedFood[d]['data'] = new Array();
    foodIndex = 0;
    while (calRemaining[calIndex] > sortedData[d]['min']) {
      let maxIndex = 0;

      for (let i in sortedData[d]['data']) {
        if(sortedData[d]['data'][i]['calories'] <= calRemaining[calIndex]) {
          maxIndex++;
        } else {
          break;
        }
      }
      let randIndex = Math.floor(Math.random() * maxIndex);
      selectedFood[d]['data'][foodIndex] = sortedData[d]['data'][randIndex];

      calRemaining[calIndex] -= parseFloat(selectedFood[d]['data'][foodIndex]['calories']);
      foodIndex++;
    }
    calIndex++;
  }
}

function sortDataFromSelection(data){
  for (let d in queryData){
    selectedFood[d] = new Object();
    selectedFood[d]['data'] = new Array();
  }
  for (let i = 0; i < data.length; i++) {
    let d = data[i]['catagory'];
    let num = selectedFood[data[i]['catagory']]['data'].length;
    selectedFood[d]['data'][num] = queryData[d][data[i]['index']];
  }
}

  

