const test = list(5, 3, 3, 2, 6, 1, 1, 1, 8, 9);

//Q7
function my_flatten(xs, res) {
    if (is_null(xs)) {
        return(res);
    }
    else if (is_list(head(xs))){
        return my_flatten(tail(xs), append(res, my_flatten(head(xs), list())));
    }
    else {
        return my_flatten(tail(xs), append(res, list(head(xs))));
    }
}
display(my_flatten(list(1,2,list(3,4,list(5,6))), list()));

//Q8
function compress(xs, res) {
    return accumulate((p, q) => !is_null(q)
        ? head(q) === p
            ? q
            : pair(p, q)
        : pair(p, q), list(), xs);
}
compress(test, "doesnt matter");

function pack(xs, res) {
    return accumulate((p, q) => !is_null(q)
        ? head(head(q)) === p
            ? pair(pair(p, head(q)), tail(q)) // pairs new elm with head of accum res, then continues the tail behind
            : pair(list(p), q) // pairs a list of just 1 new elm with the whole accum res
        : pair(list(p), q), list(), xs);
}

display_list(pack(test, "empty"));