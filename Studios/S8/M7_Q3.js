const mot_a = ev3_motorA();
const mot_b = ev3_motorB();
const mot_c = ev3_motorC();
const mot_d = ev3_motorD();

const sensor_ultra = ev3_ultrasonicSensor();

const motors = list(mot_a, mot_b, mot_c, mot_d);
const motor_names = map(x => "Motor " + x + " ", list("A", "B", "C", "D"));


map(i => ev3_connected(list_ref(motors, i))
    ? display(list_ref(motor_names, i) + "is connected")
    : display(list_ref(motor_names, i) + "not connected")
    , enum_list(0,3));
 
//the above is just to show what motors are connected

let stopAction = "brake";
const speed = 1000;
const time = 1500;
let CM_IN_TURNS = 90;

function turn(direction) {
    //1 for counter-clockwise, -1 for clockwise
    ev3_speak("turn");
    ev3_runForTime(mot_a, 1600, -speed * direction);
    ev3_runForTime(mot_b, 1600, speed * direction);

    ev3_pause(1500);
    ev3_motorStop(mot_a);
    ev3_motorStop(mot_b);
    return null;
}

turn(1);



