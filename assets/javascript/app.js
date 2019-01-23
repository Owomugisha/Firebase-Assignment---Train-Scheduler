$("document").ready(function () {
    var timer;
    var runClock;
    //Time at the top
    function timeClock() {
        timer = moment().format("hh:mm:ss A")
        $("#time").text(timer);
    }
    runClock = setInterval(timeClock, 1000);

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyDRORuwYmOO2RPLFrlvh-lE_BmizKgzETk",
        authDomain: "train-schedule-bbd8c.firebaseapp.com",
        databaseURL: "https://train-schedule-bbd8c.firebaseio.com",
        projectId: "train-schedule-bbd8c",
        storageBucket: "train-schedule-bbd8c.appspot.com",
        messagingSenderId: "61902254778"
    };
    firebase.initializeApp(config);
    //referencing our database in firebase
    var dataRef = firebase.database();

    //event listener for submit button
    $("#submitBtn").on("click", function (event) {
        event.preventDefault();
        console.log("heee");
        //grab user input values 
    trainInput = {
        trainName: $("#trainName").val().trim(),
        destination: $("#destination").val().trim(),
        firstTrainTime: $("#firstTrainTime").val().trim(),
        frequency: parseInt($("#frequency").val().trim())
    };
    //code for the push
    dataRef.ref().push(trainInput);
    //clear data
    $("#trainName, #destination, #firstTrainTime, #frequency").val("");
    })
    
   
    //get data from firebase
    dataRef.ref().on("child_added", function (childSnapshot) {
       //var trainData will store data
        var trainData = childSnapshot.val();
        //first time (pushed back 1 year to make sure it comes before current time)
        var firstTrainTimeConverted = moment(trainData.firstTrainTime, "HH:mm").subtract(1,"years");
        //difference between the times
        var diffTimes = moment().diff(moment(firstTrainTimeConverted), "minutes");
        //time apart
        var timeRemainder = diffTimes % trainData.frequency;
        //minutes until train
        var tMinutesTillTrain = trainData.frequency - timeRemainder;
        //next train
        var nextTrain = moment().add(tMinutesTillTrain,"minutes");
        nextTrain = moment(nextTrain).format("HH:mm");

        $("#trainSchedule").append(
            "<tr><td>"+trainData.trainName+"</td>"+"<td>"+trainData.destination
            +"</td>"+"<td class='text-center'>"+trainData.firstTrainTime+"</td>"
            +"<td class='text-center'>"+trainData.frequency+"</td>"+"</td class='text-center'>"
            +nextTrain+"</td>"+"<td class='text-center'>"+tMinutesTillTrain+"</td></tr>"
        
        );

        
    },//Handle the errors
    function(errorObject) {
        console.log("Errors handled: " + errorObject.code);
      });
    
    
    
})