var calSum = new Object;
var totalCost = 0.00;
var calData = {male: {}, female: {}};
var femaleCal = [ 1666, 2000, 1800 ];
var maleCal = [ 1733, 2800, 2600 ];
var youngProportion = [ 0.152, 0.31, 0.176, 0.139, 0.223];
var adultProportion = [ 0.205, 0.285, 0.123, 0.16, 0.227 ];
var calories = new Object();
var calRemaining = new Array();
var foodSelection = new Array();
var dataCounter = new Object();

var counter = 0;


for (let i = 0; i < maleCal.length; i++){
  calData['male'][i] = maleCal[i];
  calData['female'][i] = femaleCal[i];
}


//================================================== selection for the first page. ==========================================//
//-------------------------------------------------- go to the third page ----------------------------------//

$(".selectionButton").on("click",function(event){
  event.preventDefault();
  selectCalories();
  loadFromSelection = true;
  localStorage.setItem("userName",userName);
  localStorage.setItem("age",age);
  localStorage.setItem("gender",gender);
  localStorage.setItem("neededCal", neededCal)
  localStorage.setItem("loadFromSelection", loadFromSelection);
  $.ajax({
      url: "https://easygroce-59546.firebaseio.com/.json",
      dataType: "json",
      type: "GET",
      data: {output: 'json'},
      success: function(data) {
          localStorage.setItem("queryData",JSON.stringify(data));
          document.location = "thirdpage.html";

    },
    error: function(errorThrown) {
      console.log(errorThrown);
    }
  });
});

//================================================= selection for the third page. ==========================================//

//----------------------------- Generate the information WHEN 'thirdPage.html' is opened ------------------------------//

$(document).ready(function() {
  if(window.location.pathname.split("/").pop() == "thirdpage.html"){
    age = localStorage.getItem("age");
    gender = localStorage.getItem("gender");
    userName = localStorage.getItem("userName");
    neededCal = localStorage.getItem("neededCal");
    loadFromSelection = localStorage.getItem("loadFromSelection");
    queryData = JSON.parse(localStorage.getItem("queryData"));
    $("#username").html(userName);
    $("#gender").html(gender);
    $("#age").html(age);
    createData(queryData);
    if (userName == 'undefined'){
      $('#lastPageBtn').attr("href", "index.html");
    }
  }
});

// ------------------------------- Get the data from database and display them in grid form ----------------------------//

function createData(data){
  for (let d in data){
    calSum[d] = 0;

    dataCounter[d] = new Array();

    let st = "<div class='labelRowWithProg'><p class='catName'>" + d + "</p>";
    st += "<div class='progress'><div class='progress-bar progress-bar-striped active progBar' id='prog" + d + "' role='progressbar' value='" + d + "' style='width:0%'></div></div></div>";
    for (let i = 0; i < data[d].length; i++){
      dataCounter[d][i] = 0;

      st += "<div class='img foodBlock' cost='"
      + data[d][i]['cost']
      + "' cal='"
      + data[d][i]['calories']
      + "' value='"
      + data[d][i]['name']
      + "' catagory='" + d + "' index='" + i + "' id='data" + d + i
      + "'><img class='img foodImg' "
      + "value='"
      + data[d][i]['name']
      + "' src='"
      + data[d][i]['img']
      + "'/><h6>"
      + data[d][i]['name']
      + "</h6>"
      + "<span id='span" + d + i + "' class='itemCounter'>0</span></div>";
    }
    $("#" + d).html(st);
  }
  // ----------------------- work when the user click the food img -> add the item into foodSelection --------------------//
  $(".foodBlock").on("click", function(event){
    if ($(this).attr('value') == 'egg') {
      counter++;
      if (counter == 5) {
        $('.foodImg[value=egg]').css({
         transition: 'all .3s ease-in',
         transform: 'scale(10)'
        });
      }
    }
    // stop adding if the percentage is over 100 (99.99 is fine)
    if (getFoodData($(this).attr('catagory')) >= 100) {
      return;
    }

    calSum[$(this).attr('catagory')] += parseFloat($(this).attr("cal"));
    totalCost += parseFloat($(this).attr("cost"));
    $(this).addClass("selectedFood");
    let count = ++dataCounter[$(this).attr('catagory')][$(this).attr('index')];
    calculateCalories($(this).attr('catagory'));
    let sendingFood = data[$(this).attr('catagory')][$(this).attr('index')];
    sendingFood['catagory'] = $(this).attr('catagory');
    foodSelection.push(sendingFood);
    $('#span' + $(this).attr('catagory') + $(this).attr('index')).html(count);
  });

}

// ------------------------------- delete the latest item that the user just chose ----------------------------//

$("#undo").on("click", function(event){
  if(foodSelection.length > 0) {

    var temp = foodSelection.pop();
    calSum[temp['catagory']] -= temp['calories'];
    totalCost -= temp['cost'];
    var count = --dataCounter[temp['catagory']][temp['ID'] - 1];
    calculateCalories(temp['catagory']);;
    $('#span' + temp['catagory'] + (temp['ID'] - 1)).html(count);
    if (count == 0){
      $('#data' + temp['catagory'] + (temp['ID'] - 1)).removeClass('selectedFood');
    }
  }

  });
// ------------------------------- go to next page when user press next ----------------------------//

$("#next").on("click", function(event){
    localStorage.setItem("foodSelection", JSON.stringify(foodSelection));
    localStorage.setItem("loadFromSelection", loadFromSelection);
    localStorage.setItem("userName",userName);
    document.location = "secondpage.html";
  });

function calculateCalories(proCat){
   $("#prog" + proCat).css("width", (getFoodData(proCat) + "%"));

}

// -------------------------------- calculate how many percentage of all selected items ------------------------------//

function getFoodData(proCat){

  let calIndex = 0;
  let calFactor = 0;
  let percent = 0;
  let i = 0;
  for (let x in calSum){
    if (age = "19-51+") {
      calFactor = adultProportion[i];
    } else {
      calFactor = youngProportion[i];
    }
    calRemaining[i] = neededCal * calFactor;
    if (x == proCat) {
      percent = calSum[proCat]/calRemaining[i]*100;
    }
    i++;
  }
  return percent;
}
