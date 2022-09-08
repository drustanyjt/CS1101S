//Q1

function every_second(lst){
    
    function iter(lst, res, counter){
        return counter <= 0
            ? res
            : iter(lst, pair(list_ref(lst, counter), res), counter - 2);
    }
    
    return iter(lst, list(), length(lst) - (1 + length(lst) % 2));
}


every_second(list(1, 2, 3, 4));

//Q2

function sums(lst){
    
    function iter(lst, even, odd, counter){
        
        return counter >= length(lst)
            ? list(even, odd)
            : counter % 2 === 0
                ? iter(lst, even + list_ref(lst, counter), odd, counter + 1)
                : iter(lst, even, odd + list_ref(lst, counter), counter + 1);
    }
    
    return iter(lst, 0, 0, 0);
}

sums(list(1, 2, 3, 4, 5, 6));

// function sums_hof(lst){
    
//     function mod_iter(f, lst, res, counter){
//         function iter(lst, res, counter){
//             return counter >= length(lst)
//                 ? res
//                 : iter(lst, res + list_ref(lst, counter), counter + 2);
//         }
//     }
    
//     return list(iter(lst, 0, 0), iter(lst, 0, 1));
// }