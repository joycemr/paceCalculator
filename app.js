var paceController = (function() {

    var goalTime = function(distance, units, rawTime) {
        this.distance = distance;
        this.units = units;
        this.distInMeters = parseDistanceToMeters(distance, units);
        this.rawTime = rawTime;
        this.time = parseTime(rawTime)
        this.timeInSeconds = (this.time.minutes * 60) + parseInt(this.time.seconds);
        this.secondsPerMeter = this.timeInSeconds / this.distInMeters;
    }

    var time = function(hours, minutes, seconds) {
        this.hours = hours;
        this.minutes = minutes;
        this.seconds = seconds;
    }

    var pace = function(distance, paceSeconds) {
        this.distance = distance;
        this.paceSeconds = paceSeconds;
    }

    const trackDistances = [100, 200, 400, 800, 1000, 1200, 1600];

    function parseDistanceToMeters(distance, units) {
        var dist = 0;
        if (units == 'm') {
            dist = parseInt(distance);
        } else if (units == 'km') {
            dist = parseInt(distance * 1000);
        } else if (units == 'miles') {
            dist = convertMilesToMeters(distance);
        }
        return dist;
    }

    function parseTime(rawTime) {
        var min = parseInt(rawTime.split(':')[0]);
        var sec = parseInt(rawTime.split(':')[1]);
        return new time(0, min, sec);
    }

    function convertMilesToMeters(distance) {
        return Math.round(distance * 1609.34,0);
    }

    function trackTime(secondsPerMeter, distanceInMeters) {
        return Math.round(secondsPerMeter * distanceInMeters,2);
    }

    function newRunTime(input) {
        return new goalTime(input.distance, input.units, input.time);
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
        inputUnits: '.add__units',
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
                units: document.querySelector(DOMStrings.inputUnits).value,
                time: document.querySelector(DOMStrings.inputTime).value
            }
        },

        displayKmPace: function(kmPace) {
            document.querySelector(DOMStrings.kmPaceDisplay).textContent = convertSecondsToMinutes(kmPace);
        },

        addListTitle: function(runTime) {
            var html, newHtml, element;
            element = DOMStrings.paceList;
            html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">Paces for %distance% %units% at: %time%</div>'
            newHtml = html.replace('%distance%', runTime.distance);
            newHtml = newHtml.replace('%units%', runTime.units);
            newHtml = newHtml.replace('%time%', runTime.rawTime);
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        addListItem: function(newPace) {
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

        // DEBUG
        console.log(runTime);
        console.log(allPaces);

    };

    return {
        init: function() {
            console.log('The Pace Application has started.');
            setupEventListeners();
        }

    };

})(paceController, UIController);

controller.init();
