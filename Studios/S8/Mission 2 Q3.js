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

function ultrasonic_dist(){
    let dist_to_box = ev3_ultrasonicSensorDistance(sensor_ultra)/10;
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
            function direction() {
                return math_random() <= 0.5 ? -1 : 1;
            }
            
            const dir = direction();
            
            function inner_iter(dir){
                turn(dir);
                roll_forward(15);
                turn(-dir);
                dist_to_box = ev3_ultrasonicSensorDistance(sensor_ultra)/10;
                if (dist_to_box <= 10){
                    return inner_iter(dir);
                } else {
                    turn(dir);
                    roll_forward(15);
                    turn(-dir);
                    roll_forward(25);
                    return null;
                }
            }
            inner_iter(dir);
        }
        else {
            ev3_pause(1000);
            dist_to_box = ev3_ultrasonicSensorDistance(sensor_ultra)/10;
            return iter(dist_to_box);
        }
    
    }
    
    ev3_motorSetStopAction(mot_a, stopAction);
    ev3_motorSetStopAction(mot_b, stopAction);
    
    return iter(dist_to_box);
}

//Run code
ultrasonic_dist();

function random_direction(){
    return math_random() < 0.5
            ? 1
            : -1;
}