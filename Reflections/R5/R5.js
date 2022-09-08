//Q1
const LoL = list(list(1,2), list(2,2), list(3,4));

// const xs = list(1,2);

// accumulate((p, q) => p + q, 0, xs);

function flatten_list(lst){
    
    function f(p, q){
        return is_list(p) ? accumulate(f, 0, p) + q : p + q;
    }
    
    return accumulate(f, 0, lst);
    
}
// flatten_list(LoL);

//Q2

const my_tree = list(1, list(1, list(2,3), 2), null);

//Q3