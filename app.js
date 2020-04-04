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
        this.pace100 = trackTime(secondsPerMeter, 100);
        this.pace100Min = timeInMinutes(trackTime(secondsPerMeter, 100));
        this.pace200 = trackTime(secondsPerMeter, 200);
        this.pace200Min = timeInMinutes(trackTime(secondsPerMeter, 200));
        this.pace400 = trackTime(secondsPerMeter, 400);
        this.pace400Min = timeInMinutes(trackTime(secondsPerMeter, 400));
        this.pace800 = trackTime(secondsPerMeter, 800);
        this.pace800Min = timeInMinutes(trackTime(secondsPerMeter, 800));
        this.pace1000 = trackTime(secondsPerMeter, 1000);
        this.pace1000Min = timeInMinutes(trackTime(secondsPerMeter, 1000));
        this.pace1200 = trackTime(secondsPerMeter, 1200);
        this.pace1200Min = timeInMinutes(trackTime(secondsPerMeter, 1200));
        this.pace1600 = trackTime(secondsPerMeter, 1600);
        this.pace1600Min = timeInMinutes(trackTime(secondsPerMeter, 1600));
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
        },

        getNewRuntime: function(input) {
            return newRunTime(input);
        }

    }

})();


// UI Controller
var UIController = (function() {

    var DOMStrings = {
        inputDistance: '.add__distance',
        inputTime: '.add__time',
        addButton: '.add__btn',
        kmPaceDisplay: '.pace__km--value',
        paceList: '.pace_breakdown__list'
    }

    return {
        getInput: function() {
            return {
                distance: document.querySelector(DOMStrings.inputDistance).value,
                time: document.querySelector(DOMStrings.inputTime).value
            }
        },

        displayKmPace: function(allPaces) {
            document.querySelector(DOMStrings.kmPaceDisplay).textContent = allPaces.pace1000Min;
        },

        addListTitle: function(runTime) {
            var html, newHtml, element;
            element = DOMStrings.paceList;
            html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">Paces for %distance% KM at: %time%</div>'
            newHtml = html.replace('%distance%', runTime.distInMeters);
            newHtml = newHtml.replace('%time%', runTime.time);
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        addListItem: function(newPace) {
            var html, newHtml, element;
            element = DOMStrings.paceList;
            html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%distance%</div> \
            <div class="right clearfix"> \
                <div class="item__value">%time% %time-measure%</div> \
            </div> \
            </div>'
            newHtml = html.replace('%distance%', newPace.distance);
            newHtml = newHtml.replace('%time%', newPace.time);
            newHtml = newHtml.replace('%time-measure%', newPace.timeMeasure);
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
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
        var runTime = paceCtrl.getNewRuntime(input)

        // DEBUG
        console.log(input);

        // fill in the calculated paces
        allPaces = paceCtrl.calculatePaces(input);

        // display the KM pace
        uiCtrl.displayKmPace(allPaces);

        // display track paces title block
        uiCtrl.addListTitle(runTime);

        // display track paces
        var newPace = {
            distance: "400",
            time: allPaces.pace400,
            timeMeasure: 'Seconds'
        }
        uiCtrl.addListItem(newPace);
        newPace = {
            distance: "400",
            time: allPaces.pace400Min,
            timeMeasure: 'Min:Sec'
        }
        uiCtrl.addListItem(newPace);

    };

    return {
        init: function() {
            console.log('The Pace Application has started.');
            setupEventListeners();
        }

    };

})(paceController, UIController);

controller.init();
