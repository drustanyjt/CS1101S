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

const stopAction = "brake";
const speed = 1000;
const time = 1500;
const CM_IN_TURNS = 90;

function roll_forward(dist){
    ev3_speak("Rolling");
    ev3_runToRelativePosition(mot_a, CM_IN_TURNS*dist, speed);
    ev3_runToRelativePosition(mot_b, CM_IN_TURNS*dist, speed);
    ev3_pause(300*math_abs(dist));
    return null;
}

function ultrasonic_dist(){
    const dist_to_box = ev3_ultrasonicSensorDistance(sensor_ultra)/10;
    display("Setting speed");
    ev3_motorSetSpeed(mot_a, speed);
    ev3_motorSetSpeed(mot_b, speed);
    
    display(dist_to_box);
    ev3_motorStart(mot_a);
    ev3_motorStart(mot_b);
    ev3_pause(1000);
    
    function iter(dist){
        if (dist <= 10){
            ev3_motorStop(mot_a);
            ev3_motorStop(mot_b);
            roll_forward(-30);
            return null;
        }
        else {
            ev3_pause(1000);
            return iter(display(ev3_ultrasonicSensorDistance(sensor_ultra)/10));
        }
    
    }
    
    ev3_motorSetStopAction(mot_a, stopAction);
    ev3_motorSetStopAction(mot_b, stopAction);
    
    return iter(dist_to_box);
}

ultrasonic_dist();