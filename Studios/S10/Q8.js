// NEW CODE STARTS AT LINE 175

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
const RED = 5; //purple also is 5
const WHITE = 6;

const stopAction = "brake";
const speed = 500;
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
    
    start_move(speed);
    
    while (!pred()) {
        ev3_pause(1);
        doing();
    }
    
    stop_all();
    ev3_pause(100);
}

// above are helper functions from previous missions
// NEW CODE STARTS HERE

const BASELINE_INTENSITY = 7 + 7 + 6;

function get_error(){
    
    const error_red = ev3_colorSensorRed(sensor_colour);
    const error_gre = ev3_colorSensorGreen(sensor_colour);
    const error_blu = ev3_colorSensorBlue(sensor_colour);
    
    const current_intensity = error_red + error_gre +  error_blu;
    
    return BASELINE_INTENSITY - current_intensity;
}

function main(){
    // tune hyperparameters
    let P_K = 2;
    let I_K = 0; // integration is usually not needed
    let D_K = 0.00005;
    
    let P = 0;
    let I = 0;
    let D = 0;
    
    const iter_time = 1;
    
    let old_error = get_error();
    
    set_speed_all(speed); //set motors to baseline speed
    start_all();
    
    while (ev3_colorSensorGetColor(sensor_colour) !== RED) {
        ev3_pause(iter_time);
        
        let error = get_error();
        display("Error:");
        display(error);
        
        P = P_K * error;
        display("P");
        display(P);
        
        I = I_K * (I + error*(iter_time / 1000));
        display("I");
        display(I);
        
        D = D_K * (error - old_error) / (iter_time / 1000);
        display("D");
        display(D);

        let thrust = P + I - D;
        if (math_abs(error) < 10) {
            thrust = 0;
        }
        display("Thrust");
        display(thrust);
        display("\n");
        
        old_error = error;
        
        // turn left wheel in reverse, duration based on PID
        ev3_motorStop(mot_a);
        ev3_motorSetSpeed(mot_a,-speed * 0.8);
        ev3_motorStart(mot_a);
        ev3_pause(math_abs(thrust));
        
        // reset left wheel to normal speed
        ev3_motorStop(mot_a);
        ev3_motorSetSpeed(mot_a,speed);
        ev3_motorStart(mot_a);
        
    }
    
    return null;
}

main();
