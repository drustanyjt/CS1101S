import {circle, show, stack, stack_frac, beside, beside_frac,
        ribbon, square, blank, scale} from "rune";

function moony_1(bottom_right){
    
    return beside(stack(circle, square), stack(blank, bottom_right));
    
}

show(moony_1(ribbon)); //Q1

function moony_2(n){
    
    return n === 1 ? circle
                   : moony_1(moony_2(n - 1));
}

show(moony_2(5)); //Q2

function moony_1_mod(bottom_right, n){
    
    const scaling_factor = 1 / n;
    
    return beside_frac(scaling_factor, 
                       stack_frac(scaling_factor, circle, square),
                       stack_frac(scaling_factor, blank, bottom_right));
    
}

/*
moony works the same way as moony_2, except it uses a modified version of
moony_1, which uses fractional stacking/beside to ensure the correct scaling.

This builds from bottom right --> outwards. This works because we assume
the scaling of moony(n-1) is correct, and we subsequently use that as the
bottom_right rune in the modified moony_1 with new scaling factor of 1/n.
*/
function moony(n){
    
    return n === 1 ? moony_1_mod(circle, n)
                   : moony_1_mod(moony(n - 1), n);
}

show(moony(5)); //Q3

/*
Q4:
Recursive process.
Time = Θ(n)
Space = Θ(n)
For time, we are assuming all primitive operations and functions have a
constant time.
For space, we are counting the growth of the maximum number of deferred
operations that is stored in memory with n. 
*/