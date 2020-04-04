var paceController = (function() {

    var goalTime = function(distInMeters, time) {
        this.distInMeters = parseInt(distInMeters);
        this.time = time;
        this.minutes = parseInt(time.split(':')[0]);
        this.seconds = parseInt(time.split(':')[1]);
        this.timeInSeconds = (this.minutes * 60) + parseInt(this.seconds);
        this.secondsPerMeter = this.timeInSeconds / this.distInMeters;
    }

    var pace = function(distance, paceSeconds, paceMinutes) {
        this.distance = distance;
        this.paceSeconds = paceSeconds;
    }

    var paces = function(secondsPerMeter) {
        this.pace100 = trackTime(secondsPerMeter, 100);
        this.pace100Min = convertSecondsToMinutes(trackTime(secondsPerMeter, 100));
        this.pace200 = trackTime(secondsPerMeter, 200);
        this.pace200Min = convertSecondsToMinutes(trackTime(secondsPerMeter, 200));
        this.pace400 = trackTime(secondsPerMeter, 400);
        this.pace400Min = convertSecondsToMinutes(trackTime(secondsPerMeter, 400));
        this.pace800 = trackTime(secondsPerMeter, 800);
        this.pace800Min = convertSecondsToMinutes(trackTime(secondsPerMeter, 800));
        this.pace1000 = trackTime(secondsPerMeter, 1000);
        this.pace1000Min = convertSecondsToMinutes(trackTime(secondsPerMeter, 1000));
        this.pace1200 = trackTime(secondsPerMeter, 1200);
        this.pace1200Min = convertSecondsToMinutes(trackTime(secondsPerMeter, 1200));
        this.pace1600 = trackTime(secondsPerMeter, 1600);
        this.pace1600Min = convertSecondsToMinutes(trackTime(secondsPerMeter, 1600));
      }

    const trackDistances = [100, 200, 400, 800, 1000, 1200, 1600];

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
            console.log('time for ' + trackDistance + 'M in minutes: ' + convertSecondsToMinutes(timeInSeconds));
        }
    }

    function getPace(runTime, trackDistance) {
        var timeInSeconds = trackTime(runTime.secondsPerMeter, trackDistance);
        var trackPace = new pace(trackDistance, timeInSeconds);
        return trackPace;
    }

    return {

        getNewRuntime: function(input) {
            return newRunTime(input);
        },

        getAllPaces: function(runTime) {
            var allPaces = [];
            for (trackDistance of trackDistances) {
                allPaces.push(getPace(runTime, trackDistance));
            }
            return allPaces;
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

    function convertSecondsToMinutes(timeInSeconds) {
        const min = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds - (min * 60);
        return min.toString() + ':' + Math.round(seconds,2).toString().padStart(2, '0');
    }

    return {
        getInput: function() {
            return {
                distance: document.querySelector(DOMStrings.inputDistance).value,
                time: document.querySelector(DOMStrings.inputTime).value
            }
        },

        displayKmPace: function(kmPace) {
            document.querySelector(DOMStrings.kmPaceDisplay).textContent = convertSecondsToMinutes(kmPace);
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
            console.log(newPace);
            var html, newHtml, element;
            element = DOMStrings.paceList;
            html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%distance%</div> \
            <div class="right clearfix"> \
                <div class="item__value">%time% Seconds %minute-measure%</div> \
            </div> \
            </div>'
            newHtml = html.replace('%distance%', newPace.distance);
            newHtml = newHtml.replace('%time%', newPace.paceSeconds);
            if (newPace.paceSeconds > 60) {
                var paceMin = convertSecondsToMinutes(newPace.paceSeconds);
                newHtml = newHtml.replace('%minute-measure%', '(' + paceMin + ')');
            }
            newHtml = newHtml.replace('%minute-measure%', '');
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

        // calculate track paces
        var allPaces = paceCtrl.getAllPaces(runTime);

        // display the KM pace
        for (pace of allPaces) {
            if (pace.distance == 1000) {
                uiCtrl.displayKmPace(pace.paceSeconds);
            };
        }

        // display track paces title block
        uiCtrl.addListTitle(runTime);

        // display track paces
        for (pace of allPaces) {
            uiCtrl.addListItem(pace);
        }

    };

    return {
        init: function() {
            console.log('The Pace Application has started.');
            setupEventListeners();
        }

    };

})(paceController, UIController);

controller.init();
