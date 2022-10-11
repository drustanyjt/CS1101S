//part 1
//ev_speak("hello!");

const mot_a = ev3_motorA();
const mot_b = ev3_motorB();
const mot_c = ev3_motorC();
const mot_d = ev3_motorD();

const touch_sensor = ev3_touchSensor1();
const sensor_ultra = ev3_ultrasonicSensor();
const sensor_color = ev3_colorSensor();

const motors = list(mot_a, mot_b, mot_c, mot_d);
const motor_names = map(x => "Motor " + x + " ", list("A", "B", "C", "D"));


map(i => ev3_connected(list_ref(motors, i))
    ? display(list_ref(motor_names, i) + "is connected")
    : display(list_ref(motor_names, i) + "not connected")
    , enum_list(0,3));
 
//the above is just to show what motors are connected

let stopAction = "brake";
let speed = -100;
let time = 1500;
let CM_IN_TURNS = -90;

// const start = ev3_ultrasonicSensorDistance(sensor_ultra);
// display(ev3_ultrasonicSensorDistance(sensor_ultra));
// ev3_speak("Braking");
// ev3_runToRelativePosition(mot_a, 800, speed);
// ev3_runToRelativePosition(mot_b, 800, speed);
// ev3_pause(1000);

// ev3_speak("Finished Moving");
// display(ev3_motorGetPosition(mot_a));
// display(ev3_motorGetPosition(mot_b));
// const end = ev3_ultrasonicSensorDistance(sensor_ultra);
// display(ev3_ultrasonicSensorDistance(sensor_ultra));

// display(start - end);

// ev3_motorSetSpeed(mot_a, speed);
// ev3_motorSetSpeed(mot_b, speed);

// ev3_motorSetStopAction(mot_a, stopAction);
// ev3_motorSetStopAction(mot_b, stopAction);

// ev3_speak("Starting movement");
// ev3_motorStart(mot_a);
// ev3_motorStart(mot_b);

// ev3_pause(1500);
// ev3_motorStop(mot_a);
// ev3_motorStop(mot_b);

//turn 90deg counter clockwise mission qn 3
function turn(direction) {
    //1 for counter-clockwise, -1 for clockwise
    ev3_speak("turn");
    ev3_runForTime(mot_a, 1600, -speed * direction);
    ev3_runForTime(mot_d, 1600, speed * direction);

    ev3_pause(1500);
    ev3_motorStop(mot_a);
    ev3_motorStop(mot_b);
    return null;
}

//move forward
function roll_forward(dist){
    ev3_speak("Rolling");
    ev3_runToRelativePosition(mot_a, CM_IN_TURNS*dist, speed);
    ev3_runToRelativePosition(mot_d, CM_IN_TURNS*dist, speed);
    ev3_pause(300*dist);
    return null;
}

// roll_forward(1);
// turn(1);
// roll_forward(1);
// turn(-1);
// roll_forward(1);


function light_intensity(){
    display("Setting speed");
    ev3_motorSetSpeed(mot_a, speed);
    ev3_motorSetSpeed(mot_b, speed);
    
    let button = 0;

    while (button === 0) {
        if (ev3_touchSensorPressed(touch_sensor)) {
            button = 1;
            display("stop");
            break;
        }
        ev3_pause(1000);
        display(ev3_ambientLightIntensity(sensor_color));
    }
}

light_intensity();


