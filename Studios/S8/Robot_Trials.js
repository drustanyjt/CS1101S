const mot_a = ev3_motorA();
const mot_b = ev3_motorB();
const mot_c = ev3_motorC();
const mot_d = ev3_motorD();

const motors = list(mot_a, mot_b, mot_c, mot_d);
const motor_names = map(x => "Motor " + x + " ", list("A", "B", "B", "D"));


map(i => ev3_connected(list_ref(motors, i))
    ? display(list_ref(motor_names, i) + "is connected")
    : display(list_ref(motor_names, i) + "not connected")
    , enum_list(0,3));
    
let stopAction = "coast";
let speed = 1000;

ev3_motorSetSpeed(mot_a, speed);
ev3_motorSetSpeed(mot_b, speed);

ev3_motorSetStopAction(mot_a, stopAction);
ev3_motorSetStopAction(mot_b, stopAction);

ev3_speak("Starting movement");
ev3_motorStart(mot_a);
ev3_motorStart(mot_b);

ev3_pause(1500);
ev3_motorStop(mot_a);
ev3_motorStop(mot_b);

ev3_speak("Coasting");