const time = 20.0;
const distInMeters = 5000;

function timeInMinutes(timeInSeconds) {
    const min = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds - (min * 60);
    return min + ':' + seconds;
}

function pace100m(time, distInMeters) {

    // How many seconds?
    const timeInSeconds = time * 60;
    console.log(timeInSeconds);

    // Seconds per/meter
    const secondsPerMeter = timeInSeconds / distInMeters;
    console.log(secondsPerMeter);

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

    // time for 1KM
    const timeFor1000 = secondsPerMeter * 1000;
    console.log('time for 1000M in seconds: ' + timeFor1000);
    // In minutes
    console.log('time for 1000M in minutes: ' + timeFor1000 / 60);
    console.log('time for 1000M in minutes: ' + timeInMinutes(timeFor1000));

}

pace100m(time,distInMeters);
