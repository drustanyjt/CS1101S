function my_map(f, xs){
    return accumulate((p, q) => pair(f(p), q), null, xs);
}

function remove_duplicates(xs) {
    
    return accumulate((p, q) => is_null(member(p, q))
        ? pair(p, q)
        : q, null, xs);
}

// remove_duplicates(null);

function subsets(xs) {
    if (is_null(xs)) {
        return list(null);
    }
    else {
        const subset_tail = subsets(tail(xs));
        
        const subset_head = map(x => append(x, list(head(xs))), subset_tail);
        
        return append(subset_tail, subset_head);
    }
}


// display_list(subsets(list(1,2, 3, 4)));

function permutations(xs) {
    
    if (is_null(xs)) {
        return list(null);
    }
    else {
         const perm_head = accumulate(append, null, map(x =>
            map(p => pair(x, p), permutations(remove(x, xs))), xs));
        
        
        return perm_head;
    }
}

display_list(permutations(list(1,2,3)));

