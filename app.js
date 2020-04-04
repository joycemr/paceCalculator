var paceController = (function() {

    var goalTime = function(distInMeters, time) {
        this.distInMeters = parseInt(distInMeters);
        this.time = time;
        this.minutes = parseInt(time.split(':')[0]);
        this.seconds = parseInt(time.split(':')[1]);
        this.timeInSeconds = (this.minutes * 60) + parseInt(this.seconds);
        this.secondsPerMeter = this.timeInSeconds / this.distInMeters;
    }

    var paces = function(secondsPerMeter) {
        this.secondsPerMeter = secondsPerMeter;
        this.kmPaceMin = timeInMinutes(trackTime(secondsPerMeter, 1000));
    }

    const trackDistances = [100, 200, 400, 800, 1000, 1200, 1600];

    function timeInMinutes(timeInSeconds) {
        const min = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds - (min * 60);
        return min.toString() + ':' + Math.round(seconds,2).toString().padStart(2, '0');
    }

    function trackTime(secondsPerMeter, distanceInMeters) {
        return Math.round(secondsPerMeter * distanceInMeters,2);
    }

    function newRunTime(input) {
        return new goalTime(input.distance, input.time);
    }

    function logTrackTime(runTime, trackDistance) {
        var timeInSeconds = trackTime(runTime.secondsPerMeter, trackDistance)
        console.log('time for ' + trackDistance + 'M in seconds: ' + timeInSeconds);
        if (timeInSeconds > 60) {
            console.log('time for ' + trackDistance + 'M in minutes: ' + timeInMinutes(timeInSeconds));
        }
    }

    function pace100m(input) {

        const runTime = newRunTime(input);

        // Inputs
        console.log('Race Distance in meters: ' + runTime.distInMeters);
        console.log('Race time: ' + runTime.minutes + ':' + runTime.seconds);

        // How many seconds?
        console.log('total time in seconds: ' + runTime.timeInSeconds);

        // Seconds per/meter
        console.log('seconds per meter: ' + runTime.secondsPerMeter);

        for (trackDistance of trackDistances) {
            logTrackTime(runTime, trackDistance);
        }

    }

    return {

        calculatePaces: function(input) {
            // console testing
            pace100m(input);

            // calculate the raw values
            const runTime = newRunTime(input);

            // calculate the track paces
            return new paces(runTime.secondsPerMeter);
        }

    }

})();


// UI Controller
var UIController = (function() {

    var DOMStrings = {
        inputDistance: '.add__distance',
        inputTime: '.add__time',
        addButton: '.add__btn',
        kmPaceDisplay: '.pace__km--value'
    }

    return {
        getInput: function() {
            return {
                distance: document.querySelector(DOMStrings.inputDistance).value,
                time: document.querySelector(DOMStrings.inputTime).value
            }
        },

        displayKmPace: function(allPaces) {
            document.querySelector(DOMStrings.kmPaceDisplay).textContent = allPaces.kmPaceMin;
        },

        getDOMStrings: function() {
            return DOMStrings;
        }
    };

})();


// Main Application Controller
var controller = (function(paceCtrl, uiCtrl) {

    var setupEventListeners = function() {
        var DOMStrings = uiCtrl.getDOMStrings();
        document.querySelector(DOMStrings.addButton).addEventListener('click', ctrlAddTime);
    };

    var ctrlAddTime = function() {
        console.log("I am here");
        var input

        // Get the input data
        input = uiCtrl.getInput();
        console.log(input);

        // fill in the calculated paces
        allPaces = paceCtrl.calculatePaces(input);

        // display the KM pace
        uiCtrl.displayKmPace(allPaces);
    };

    return {
        init: function() {
            console.log('The Pace Application has started.');
            setupEventListeners();
        }

    };

})(paceController, UIController);

controller.init();
