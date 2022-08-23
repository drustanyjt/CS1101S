import {circle, show, stack, stack_frac, beside, beside_frac,
        ribbon, square, blank, scale} from "rune";

function moony_1(bottom_right){
    
    return beside(stack(circle, square), stack(blank, bottom_right));
    
}

//show(moony_1(ribbon)); //Q1

function moony_2(n){
    
    return n === 1 ? moony_1(circle)
                   : moony_1(moony_2(n - 1));
}

// show(moony_2(5)); //Q2

function moony_1_mod(bottom_right, n){
    
    return beside_frac(1/n ,stack(circle, square), stack(blank, bottom_right));
    
}

function moony(n){
    
    return n === 3 ? moony_1_mod(circle, n)
                   : moony_1_mod(moony_2(n - 1), n);
}

show(moony(4)); //Q3