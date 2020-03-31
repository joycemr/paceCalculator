const time = '21:00';
const distInMeters = 5000;

function timeInMinutes(timeInSeconds) {
    const min = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds - (min * 60);
    return min + ':' + Math.round(seconds,2);
}

function pace100m(time, distInMeters) {

    const timeArray = time.split(':');
    const minutes = timeArray[0];
    const seconds = timeArray[1];
    const timeInSeconds = (minutes * 60) + parseInt(seconds);

    // Inputs
    console.log('Race Distance in meters: ' + distInMeters);
    console.log('Race time: ' + minutes + ':' + seconds);

    // How many seconds?
    console.log('total time in seconds: ' + timeInSeconds);

    // Seconds per/meter
    const secondsPerMeter = timeInSeconds / distInMeters;
    console.log('seconds per meter: ' + secondsPerMeter);

    // time for 100m
    const timeFor100 = secondsPerMeter * 100;
    console.log('time for 100M in seconds: ' + timeFor100);

    // time for 200m
    const timeFor200 = secondsPerMeter * 200;
    console.log('time for 200M in seconds: ' + timeFor200);

    // time for 400m
    const timeFor400 =  secondsPerMeter * 400;
    console.log('time for 400M in seconds: ' + timeFor400);
    // In minutes
    console.log('time for 400M in minutes: ' + timeInMinutes(timeFor400));

    // time for 800
    const timeFor800 =  secondsPerMeter * 800;
    console.log('time for 800M in seconds: ' + timeFor800);
    // In minutes
    console.log('time for 800M in minutes: ' + timeInMinutes(timeFor800));

    // time for 1KM
    const timeFor1000 = secondsPerMeter * 1000;
    console.log('time for 1000M in seconds: ' + timeFor1000);
    // In minutes
    console.log('time for 1000M in minutes: ' + timeInMinutes(timeFor1000));

}

pace100m(time,distInMeters);
