var calSum = new Object;
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
var calories = new Object;
var calRemaining = new Array();
for (let i = 0; i < maleCal.length; i++){
  calData['male'][i] = maleCal[i];
  calData['female'][i] = femaleCal[i];
}


//================================================== selection for the first page. ==========================================//
//-------------------------------------------------- go to the third page ----------------------------------//

$(".selectionButton").on("click",function(event){
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
    queryData = JSON.parse(localStorage.getItem("queryData"));
    $("#username").html(userName);
    $("#gender").html(gender);
    $("#age").html(age);
    createData(queryData);
    console.log('hello');
  }
});

//---------------------------------------------- Create data from the data. -------------------------------------------------//

function createData(data){
  for (let d in data){
    calSum[d] = 0;

    let st = "<div class='labelRowWithProg'><p class='catName'>" + d + "</p>";
    //progress-bar-striped active progBar role='progressbar'
    st += "<div class='progress'><div class='progress-bar  active progBar' id='prog" + d + "' role='progressbar' value='" + d + "' style='width:0%'></div></div></div>";
    for (let i = 0; i < data[d].length; i++){
      st += "<div class='img foodBlock' cost='"
      + data[d][i]['cost']
      + "' cal='"
      + data[d][i]['calories']
      + "' value='"
      + data[d][i]['name']
      + "' src='"
      + data[d][i]['img']
      + "' catagory='" + d
      + "'><img class='img foodImg' cost='"
      + data[d][i]['cost']
      + "' cal='"
      + data[d][i]['calories']
      + "' value='"
      + data[d][i]['name']
      + "' src='"
      + data[d][i]['img']
      + "' ><h6>"
      + data[d][i]['name']
      + "</h6></div>";


    }
    $("#" + d).html(st);

  }
  $(".foodBlock").on("click", function(event){
      if($(this).hasClass("selectedFood")){
        calSum[$(this).attr('catagory')] -= parseFloat($(this).attr("cal"));
        totalCost -= parseFloat($(this).attr("cost"));
      } else {
        calSum[$(this).attr('catagory')] += parseFloat($(this).attr("cal"));
        totalCost += parseFloat($(this).attr("cost"));
      }
      $(this).toggleClass("selectedFood");
      calculateCalories($(this).attr('catagory'));
    });
}

function calculateCalories(proCat){
   $("#prog" + proCat).css("width", (getFoodData(proCat) + "%"));

}

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
