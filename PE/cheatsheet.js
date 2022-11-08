// converts list to array and array length
function xs_2_arr(xs) {
    let arrlen = 0;
    let arr = [];
    function helper(xs) {
        if(is_null(xs)) {
            return pair(arr, arrlen);
        }
        arr[arrlen] = head(xs);
        arrlen = arrlen + 1;
        return helper(tail(xs));
    }
    return helper(xs);
}

const xs_to_change = list(1, 2, 3, 4);

const arr_arrlen = xs_2_arr(xs_to_change);
const arr = head(arr_arrlen);
const arrlen = tail(arr_arrlen);

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
