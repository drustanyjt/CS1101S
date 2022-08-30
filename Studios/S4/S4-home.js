//Q1
//a. 1
//b. 1

//Q2
//2

//Q3
//27

const compose = (f, g) => x => f(g(x));
const repeated = (f, n) => n === 0 ? x => x
                                   : x => f(repeated(f, n - 1));
const thrice = f => repeated(f, 3);

//Q4
//a. 6 + 27
//b. this returns the compose function
//c. 1
//d. 2 ** (512 ** 3)

const square = x => x * x;

(thrice(thrice))(x => x + 1)(7);

thrice(x => x + 1);