const mot_a = ev3_motorA();
const mot_b = ev3_motorB();
const mot_c = ev3_motorC();
const mot_d = ev3_motorD();
const motors = list(mot_a, mot_b, mot_c, mot_d);
const motor_names = map(x => "Motor " + x + " ", list("A", "B", "C", "D"));

map(i => ev3_connected(list_ref(motors, i))
    ? display(list_ref(motor_names, i) + "IS connected!")
    : display(list_ref(motor_names, i) + "not connected")
    , enum_list(0,3));
 
function get_touchSensor(){
    let res = undefined;
    const possible_sensors = list(ev3_touchSensor1, ev3_touchSensor2, ev3_touchSensor3, ev3_touchSensor4);
    function inner(xs){
        if (is_undefined(res) && !is_null(xs)){
            res = head(xs)();
            inner(tail(xs));
        } else {
            return res;
        }
    }
    return inner(possible_sensors);
}

const sensor_gyro = ev3_gyroSensor();
const sensor_ultra = ev3_ultrasonicSensor();
const sensor_colour = ev3_colorSensor();
const sensor_touch = ev3_touchSensor3();
const sensors = list(sensor_gyro, sensor_ultra, sensor_colour, sensor_touch);
const sensor_names = map(x =>"sensor_" + x + " ", list("gyro", "ultra", "colour", "touch"));

map(i => ev3_connected(list_ref(sensors, i))
    ? display(list_ref(sensor_names, i) + "IS connected!")
    : display(list_ref(sensor_names, i) + "not connected")
    , enum_list(0,3));

//the above is just to show what is connected

// colours
const NONE = 0;
const BLACK = 1;
const WHITE = 6;

const stopAction = "brake";
const speed = 200;
const time = 1500;
const CM_IN_TURNS = -90;

const do_all = f => map(x => f(x), motors);
const start_all = () => do_all(ev3_motorStart);
const stop_all = () => do_all(ev3_motorStop);
const set_speed_all = speed => do_all(mot => ev3_motorSetSpeed(mot, speed));
const set_stop_all = stop => do_all(mot => ev3_motorSetSpeed(mot, stop));
function start_turn(speed, sign){
    
    const stopAction = "brake";
    
    if (is_undefined(speed)){
        speed = 200;
    }
    
    if (is_undefined(sign)){
        sign = 1; // clockwise
    }
    
    ev3_motorSetSpeed(mot_a, -sign * speed);
    ev3_motorSetSpeed(mot_d, sign * speed);

    ev3_motorSetStopAction(mot_a, stopAction);
    ev3_motorSetStopAction(mot_d, stopAction);

    ev3_motorStart(mot_a);
    ev3_motorStart(mot_d);
    
    return null;
}

function start_move(speed){
    
    if (is_undefined(speed)){
        speed = 200;
    }

    ev3_motorSetSpeed(mot_a, speed);
    ev3_motorSetSpeed(mot_d, speed);
    
    ev3_motorStart(mot_a);
    ev3_motorStart(mot_d);
}

function turn_deg(deg){ // positive deg for clockwise
    ev3_speak("Turning");
    
    const speed = 300; // turn speed
    
    const sign = math_round(deg/math_abs(deg));
    
    let iter_cnt = 0;
    
    ev3_gyroSensorRate(sensor_gyro);
    
    function iter(deg_turned){
        if (sign * deg_turned >= sign * deg - (1 * speed / 70) || iter_cnt >= 10000){
            ev3_motorStop(mot_a);
            ev3_motorStop(mot_d);
            display("I turned ↓");
            display(deg_turned);
            
            return deg_turned;
        } else {
            ev3_pause(1);
            const turned = ev3_gyroSensorAngle(sensor_gyro);
            
            // iter_cnt % 250 !== 1 ? display(turned) : null; // uncomment to debug
            
            iter_cnt = iter_cnt + 1;
            return iter(ev3_gyroSensorAngle(sensor_gyro));
        }
    }
    
    start_turn(speed, sign);
    
    return iter(0);
}

function roll_forward(dist){
    ev3_speak("Rolling");
    ev3_runToRelativePosition(mot_a, CM_IN_TURNS*dist, speed);
    ev3_runToRelativePosition(mot_d, CM_IN_TURNS*dist, speed);
    ev3_pause(300*dist);
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

function turn_until(speed, sign, pred, doing){
    
    ev3_gyroSensorRate(sensor_gyro);
    
    if (is_undefined(doing)){
        let counter = 0;
        doing = () => {
            display(counter);
            counter = counter + 1;
        };
    }
    
    set_stop_all("brake");
    
    start_turn(speed, sign);
    

    
    while (!pred()) {
        ev3_pause(1);
        doing();
    }
    
    stop_all();
    
}

function move_until(speed, pred, doing){

    if (is_undefined(doing)){
        let counter = 0;
        doing = () => {
            display(counter);
            counter = counter + 1;
        };
    }
    
    set_stop_all("brake");
    
    start_move(speed);
    
    while (!pred()) {
        ev3_pause(1);
        doing();
    }
    
    stop_all();
}

function main(){
    display("\n");
    ev3_speak("Hello! Starting the run.");
    
    // display(ev3_colorSensorGetColor(sensor_colour)); // COLOUR SENSOR
    // display(ev3_gyroSensorAngle(sensor_gyro)); // GYRO SENSOR
    
    while (ev3_colorSensorGetColor(sensor_colour) === BLACK) {
        move_until(-200, () => ev3_colorSensorGetColor(sensor_colour) === WHITE,
            () => null);
        
        roll_forward(0.2);
        ev3_pause(5);
        turn_deg(-135);

        turn_until(undefined, 1,
            () => ev3_colorSensorGetColor(sensor_colour) === BLACK || ev3_gyroSensorAngle(sensor_gyro) >= 270,
            () => null);
        
        ev3_speak("compensating");
        turn_deg(10);
    }
    


    // turn_deg(180);
    // ev3_pause(1);
    // set_speed_all(500);
    // set_stop_all("brake");
    // start_all();
    // ev3_pause(1000);
    // stop_all();
    
    // turn_deg(180);
    // set_speed_all(500);
    // set_stop_all("brake");
    // start_all();
    // ev3_pause(1000);
    // stop_all();
    
    // display(ev3_colorSensorGetColor(sensor_colour));
    
    ev3_pause(1);
    ev3_speak("Mission complete!");
    display("\n");
    return 1;
}


main();

//Run code
// ultrasonic_dist();

// roll_forward(15);
// ev3_motorSetSpeed(mot_a, speed);
// ev3_motorSetSpeed(mot_d, speed);
// ev3_motorSetStopAction(mot_a, stopAction);
// ev3_motorSetStopAction(mot_d, stopAction);
// ev3_motorStart(mot_a);
// ev3_motorStart(mot_d);
// ev3_pause(4000);
// ev3_motorStop(mot_a);
// ev3_motorStop(mot_d);
// ev3_gyroSensorRate(sensor_gyro);
// ev3_gyroSensorAngle(sensor_gyro);