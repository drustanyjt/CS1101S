function my_map(f, xs){
    return accumulate((p, q) => pair(f(p), q), null, xs);
}

function remove_duplicates(xs) {
    return accumulate((p, q) => pair(p, filter(x => x !== p, q)), null, xs);
}

function makeup_amount(x, coins) {
    if (x === 0) {
        return list(null);
            } else if (x < 0 || is_null(coins)) {
                return null;
            } else {
                // Combinations that do not use the head coin.
                const combi_A = ...
                // Combinations that do not use the head coin
                // for the remaining amount.
                const combi_B = ...
                // Combinations that use the head coin.
                const combi_C = ...
        return append(combi_A, combi_C);
    }
}