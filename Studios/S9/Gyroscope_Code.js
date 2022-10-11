const mot_a = ev3_motorA();
const mot_b = ev3_motorB();
const mot_c = ev3_motorC();
const mot_d = ev3_motorD();
const sensor_gyro = ev3_gyroSensor();

const sensor_ultra = ev3_ultrasonicSensor();

const motors = list(mot_a, mot_b, mot_c, mot_d);
const motor_names = map(x => "Motor " + x + " ", list("A", "B", "C", "D"));


map(i => ev3_connected(list_ref(motors, i))
    ? display(list_ref(motor_names, i) + "is connected")
    : display(list_ref(motor_names, i) + "not connected")
    , enum_list(0,3));
 
//the above is just to show what motors are connected

const stopAction = "brake";
const speed = -500;
const time = 1500;
const CM_IN_TURNS = 90;

function roll_forward(dist){
    ev3_speak("Rolling");
    ev3_runToRelativePosition(mot_a, CM_IN_TURNS*dist, speed);
    ev3_runToRelativePosition(mot_d, CM_IN_TURNS*dist, speed);
    ev3_pause(200*math_abs(dist));
    // ev3_speak("I should not be moving");
    return null;
}

function turn_deg(deg){
    ev3_speak("Turning");
    
    const sign = math_round(deg/math_abs(deg));
    
    ev3_motorSetSpeed(mot_a, sign * speed);
    ev3_motorSetSpeed(mot_d, -sign * speed);

    ev3_motorSetStopAction(mot_a, stopAction);
    ev3_motorSetStopAction(mot_d, stopAction);

    ev3_gyroSensorRate(sensor_gyro);
    let iter_cnt = 0;
    function iter(deg_turned){
        if (sign * deg_turned >= sign * deg -2 || iter_cnt >= 400){
            ev3_motorStop(mot_a);
            ev3_motorStop(mot_d);
            display(deg_turned);
            
            return deg_turned;
        } else {
            ev3_pause(10);
            
            const turned = ev3_gyroSensorAngle(sensor_gyro);
            // display("Crashed here");
            iter_cnt % 10 !== 0-1 ? display(turned)
            : null;
            iter_cnt = iter_cnt + 1;
            return iter(ev3_gyroSensorAngle(sensor_gyro));
        }
    }
    
    ev3_motorStart(mot_a);
    ev3_motorStart(mot_d);
    return iter(0);
}

function turn(direction) {
    //1 for counter-clockwise, -1 for clockwise
    ev3_speak("turn");
    ev3_runForTime(mot_a, 1600, -speed * direction);
    ev3_runForTime(mot_d, 1600, speed * direction);

    ev3_pause(1500);
    ev3_motorStop(mot_a);
    ev3_motorStop(mot_d);
    return null;
}

function ultrasonic_dist(){
    let dist_to_box = ev3_ultrasonicSensorDistance(sensor_ultra)/10;
    display("Setting speed");
    ev3_motorSetSpeed(mot_a, speed);
    ev3_motorSetSpeed(mot_d, speed);

    ev3_motorSetStopAction(mot_a, stopAction);
    ev3_motorSetStopAction(mot_d, stopAction);
    
    display(dist_to_box);
    ev3_motorStart(mot_a);
    ev3_motorStart(mot_d);
    

    
    ev3_pause(2000);
    
    function iter(dist){
        if (dist <= 10){
            ev3_motorStop(mot_a);
            ev3_motorStop(mot_d);
            function direction() {
                return math_random() <= 0.5 ? -1 : 1;
            }
            
            const dir = direction();
            
            function inner_iter(dir){
                turn_deg(90*dir);
                roll_forward(15);
                turn_deg(-dir*90);
                dist_to_box = ev3_ultrasonicSensorDistance(sensor_ultra)/10;
                if (dist_to_box <= 10){
                    return inner_iter(dir);
                } else {
                    turn_deg(90*dir);
                    roll_forward(15);
                    turn_deg(-dir*90);
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
    

    
    return iter(dist_to_box);
}

//Run code
// ultrasonic_dist();

// roll_forward(15);
ev3_speak("Hello!");

turn_deg(180);
ev3_motorSetSpeed(mot_a, speed);
ev3_motorSetSpeed(mot_d, speed);
ev3_motorSetStopAction(mot_a, stopAction);
ev3_motorSetStopAction(mot_d, stopAction);
ev3_motorStart(mot_a);
ev3_motorStart(mot_d);
ev3_pause(4000);
ev3_motorStop(mot_a);
ev3_motorStop(mot_d);

ev3_speak("Ending!");
// ev3_gyroSensorRate(sensor_gyro);
// ev3_gyroSensorAngle(sensor_gyro);