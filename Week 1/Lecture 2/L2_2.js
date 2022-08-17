import {show, stack, stack_frac, stackn, heart, sail} from "rune";

show(stack_frac(1/3, heart, (stack_frac(1/2,heart,heart))));


function rec_stack(n,rune){
    return n === 1 ? rune : stack_frac(1/n,heart,rec_stack(n-1,rune));
}

show(rec_stack(5,heart));

