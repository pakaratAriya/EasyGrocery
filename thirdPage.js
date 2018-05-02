//----------------------- pick the item randomly to fulfill the calories that the user needs. ----------------------------- THIS STILL NEEDS TO BE DONE >:)//

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
    console.log(calRemaining[i]);
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
