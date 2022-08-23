import {circle, show, stack, stack_frac, beside, beside_frac,
        ribbon, square} from "rune";

function moony_1(bottom_right){
    
    return beside(stack(circle, square), bottom_right);
    
}

show(moony_1);