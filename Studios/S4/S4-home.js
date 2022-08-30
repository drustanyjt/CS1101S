const pascal = (n, m) => n * m * (n - m) === 0 ? 1
    : pascal(n - 1, m  - 1) + pascal (n - 1, m);