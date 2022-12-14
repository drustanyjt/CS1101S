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
 
const sensor_gyro = ev3_gyroSensor();
const sensor_ultra = ev3_ultrasonicSensor();
const sensor_colour = ev3_colorSensor();
const sensor_touch = undefined;
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
const BLUE = 2;
const GREEN = 3;
const YELLOW = 4;
const RED = 5; //purple
const WHITE = 6;

const stopAction = "brake";
const speed = -1000;
const time = 1500;
const CM_IN_TURNS = -27.6;

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
    // ev3_speak("Turning");
    
    const speed = 300; // turn speed
    
    const sign = math_round(deg/math_abs(deg));
    
    let iter_cnt = 0;
    
    ev3_gyroSensorRate(sensor_gyro);
    
    function iter(deg_turned){
        if (sign * deg_turned >= sign * deg - (1 * speed / 70) || iter_cnt >= 10000 || ev3_touchSensorPressed(sensor_touch)){
            ev3_motorStop(mot_a);
            ev3_motorStop(mot_d);
            display("I turned ???");
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
    // ev3_speak("Rolling");
    ev3_runToRelativePosition(mot_a, CM_IN_TURNS*dist, speed);
    ev3_runToRelativePosition(mot_d, CM_IN_TURNS*dist, speed);
    ev3_pause(100*math_abs(dist));
    return null;
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
    
    // set_stop_all("brake");
    
    start_turn(speed, sign);
    
    while (!pred()) {
        ev3_pause(1);
        doing();
    }
    
    stop_all();
    ev3_pause(100);
    return ev3_gyroSensorAngle(sensor_gyro);
    
}

function move_until(speed, pred, doing){

    if (is_undefined(doing)){
        let counter = 0;
        doing = () => {
            display(counter);
            counter = counter + 1;
        };
    }
    
    // set_stop_all("brake");
    
    start_move(speed);
    
    while (!pred()) {
        ev3_pause(1);
        doing();
    }
    
    stop_all();
    ev3_pause(100);
}

function main(){
    const forward = 1;
    move_until(forward * speed, () => ev3_colorSensorGetColor(sensor_colour) === BLUE || ev3_colorSensorGetColor(sensor_colour) === WHITE, () => undefined);
    
    move_until(forward * speed, () => ev3_colorSensorGetColor(sensor_colour) === RED || ev3_colorSensorGetColor(sensor_colour) === WHITE, () => undefined);
    
    // move_until(forward * speed, () => ev3_colorSensorGetColor(sensor_colour) === BLUE || ev3_colorSensorGetColor(sensor_colour) === WHITE, () => undefined);
    
    turn_until(speed, 1,
        () => ev3_ultrasonicSensorDistance(sensor_ultra) <= 200, () => ev3_ultrasonicSensorDistance(sensor_ultra));
    
    while (true) {
        move_until(speed, () => (!(ev3_ultrasonicSensorDistance(sensor_ultra) <= 100) && ev3_colorSensorGetColor(sensor_colour) === YELLOW) || ev3_colorSensorGetColor(sensor_colour) === WHITE , () => undefined);
        // roll_forward(-4);
        
        move_until(-speed, () => ev3_colorSensorGetColor(sensor_colour) === BLUE || ev3_colorSensorGetColor(sensor_colour) === RED || ev3_colorSensorGetColor(sensor_colour) === WHITE, () => undefined);
        
        turn_until(speed, 1,
            () => ev3_ultrasonicSensorDistance(sensor_ultra) <= 200, () => ev3_ultrasonicSensorDistance(sensor_ultra));
    
    }
    return null;
}
// ev3_speak("HEllo`");
set_stop_all("hold");
main();

// ev3_speak("Hello!");

// ev3_ultrasonicSensorDistance(sensor_ultra);

// move_until(speed, () => ev3_ultrasonicSensorDistance(sensor_ultra) <= 200, () => undefined);

