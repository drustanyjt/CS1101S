// converts list to array and array length
function xs_2_arr(xs) {
    let arrlen = 0;
    let arr = [];
    function helper(xs) {
        if(is_null(xs)) {
            return [arr, arrlen];
        }
        arr[arrlen] = head(xs);
        arrlen = arrlen + 1;
        return helper(tail(xs));
    }
    return helper(xs);
}

const xs_to_change = list(1, 2, 3, 4);

const arr_arrlen = xs_2_arr(xs_to_change);
const arr = arr_arrlen[0];
const arrlen = arr_arrlen[1];

function arr_2_xs(arr) {
    let xs = list();
    let arrlen = array_length(arr);
    for (let i = arrlen - 1; i >= 0; i = i - 1){
        xs = pair(arr[i], xs);
    }
    return [xs, arrlen];
}

function array_append(a, b) {
    const len_b = array_length(b);
    const len_a = array_length(a);
    const c = [];
    let i = 0;
    while(i < len_b) {
        c[i] = a[i];
        c[len_a + i] = b[i];
        i = i + 1;
        
    }
    return c; // A COPY
}

array_append(arr, arr);


// stack
function make_stack(){
    let stack = list();
    
    function pop() {
        const res = head(stack);
        stack = tail(stack);
        return res;
    }
    function push(n) {
        stack = pair(n, stack);
    }
    
    return [() => stack, pop, push];
}
const s_p_p = make_stack();
s_p_p[2](2);
s_p_p[1]();

// queue
function make_Q(){
    let queue = list();
    
    function enqueue(n){
        queue = append(queue, list(n));
    }
    function dequeue(){
        const res = head(queue);
        queue = tail(queue);
        return res;
    }
    
    return [() => queue, dequeue, enqueue];
}

const q_d_e = make_Q();
q_d_e[2](2);
display(q_d_e[0]());
q_d_e[1]();

arr_2_xs(xs_2_arr(list(1, 2, 3))[0]);

















