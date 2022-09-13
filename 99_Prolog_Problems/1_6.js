const test = list(5, 2, 6, 1, 8, 9);

//Q1
function last_elm(xs) {
    //find the last element
    return accumulate((val, acc_val) => is_null(acc_val) ? val : acc_val,
                      null, xs);
}

last_elm(test);

//Q2
function second_last_elm(xs) {
    //find the last element
    return accumulate((val, acc_val) => is_null(acc_val)
        ? false
        : is_boolean(acc_val)
        ? val
        : acc_val, null, xs);
}

second_last_elm(test);

//Q3
function k_1i_elm(xs, k){
    //find kth element in 1 indexed
    
    function iter(xs, i, pos){
        return i < pos
            ? iter(tail(xs), i + 1, pos)
            : head(xs);
    }
    
    return iter(xs, 1, k);
}

k_1i_elm(test, 2);

//Q4
function len(xs){
    //find length
    
    function iter(xs, count){
        return is_null(xs)
            ? count
            : iter(tail(xs), count + 1);
    }
    // using accumulate
    // return accumulate((h, t) => t + 1, 0, xs);
    
    return iter(xs, 0);
}

len(test);

//Q5
function reverse(xs){
    // reverse
    // with accum
    // return accumulate((h, t) => append(t, list(h)), null, xs);
    
    // without accum
    // function recur(xs){
    //     return is_null(xs)
    //         ? null
    //         : append(recur(tail(xs)), list(head(xs)));
    // }
    
    // return recur(xs);
    
    // iteratively
    function iter(xs, res){
        return is_null(xs)
            ? res
            : iter(tail(xs), pair(head(xs), res));
    }
    
    return iter(xs, null);
}

reverse(test);

//Q6
function is_palindrome(xs){
    const mid = math_floor(len(xs) / 2);
    const length = len(xs);
    function iter(i){
        
        if (i < mid) {
            return list_ref(xs, i) === list_ref(xs, length - 1 - i)
                ? iter(i + 1)
                : false;
        }
        else {
            return true;
        }
    }
    
    return iter(0);
}

is_palindrome(list(1,2,4,2,1));