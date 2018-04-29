var calSum=0;
var userName;
var gender = "male";
var age = "2-13";
var queryData;
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
});


  
$(".submit").on("click",function(event){
  userName = $("#userName").val();

  event.preventDefault();
  
  localStorage.setItem("userName",userName);
  localStorage.setItem("age",age);
  localStorage.setItem("gender",gender);
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
  
  for (var d in data){
    var st = "<p>" + d + "</p>";
    for (var i = 0; i < data[d].length; i++){
      st += "<img class='img foodImg' cal='" + data[d][i]['calories'] + "'value='" + data[d][i]['name'] + "' src='" + data[d][i]['img'] +"'/>";
    }
    $("#" + d).html(st);
  }
  
  
  $(".foodImg").on("click", function(event){
    if($(this).hasClass("selectedFood")){
      calSum -= parseInt($(this).attr("cal"));
    } else {
      calSum += parseInt($(this).attr("cal"));
    }
    $(this).toggleClass("selectedFood");
    calculateCalories();
});

    
}

function calculateCalories(){
  $("#calories").html("Total Calories: " + calSum);;
}

$(document).ready(function() {
  if(window.location.pathname.split("/").pop() == "secondpage.html"){
    age = localStorage.getItem("age");
    gender = localStorage.getItem("gender");
    userName = localStorage.getItem("userName");
    queryData = JSON.parse(localStorage.getItem("queryData"));
    $("#username").html(userName);
    $("#gender").html(gender);
    $("#age").html(age);
    createTable(queryData);
  }
  
});


  