function bubblesort_list(xs) {
    const len = length(xs);
    
    for (let i = len - 1; i >= 1; i = i - 1) {
        let slow = xs;
        let fast = xs;
        for (let j = 0; j < i; j = j + 1) {
            slow = fast;
            fast = tail(fast);
            
            if (head(slow) > head(fast)) {
                const temp = head(slow);
                set_head(slow, head(fast));
                set_head(fast, temp);
            }
        }
    }
    return xs;
}

bubblesort_list(list(10, 10, 10, 11, 13, 5, 3, 4, 2, 1));
