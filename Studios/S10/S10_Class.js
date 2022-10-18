function swap(A, i_1, j_1, i_2, j_2) {
    const temp = A[i_1][j_1];
    A[i_1][j_1] = A[i_2][j_2];
    A[i_2][j_2] = temp;
}


let test = [[1, 2, 3, 4],[12, 13, 14, 5],[11, 16, 15, 6],[10, 9, 8, 7]];

function calculate_swap(i, j, height, width){
    return null;
}

function rotate_matrix(A) {
    
    let wid = array_length(A) - 1;
    let j = 0;
    for (let j = 0; j < math_ceil(wid/2); j = j + 1) {
        for (let i = j; i < wid - j; i = i + 1){
            swap(A, j, i, i, wid - j);
            swap(A, j, i, wid - j, wid - i);
            swap(A, j, i, wid - i, j);
        }
        // print(A);
        // display("");
        // wid = wid;
    }
    
    /*
    swap(A, 0, 0, 0, 3)
    swap(A, 0, 0, 3, 3)
    swap(A, 0, 0, 3, 0)
    
    swap(A, 0, 1, 1, 3)
    swap(A, 0, 1, 3, 3 - 1)
    swap(A, 0, 1, 3 - 1, 0)
    
    swap(A, 1, 1, 1, 2)
    swap(A, 1, 1, 2, 2)
    swap(A, 1, 1, 2, 1)
    
    swap(A, 1, 1, 1, 4)
    swap(A, 1, 1, 4, 4)
    swap(A, 1, 1, 4, 1)
    
    swap(A, 1, 2, i, 4)
    swap(A, 1, 2, 4, 4 - (i - j))
    swap(A, 1, 2, 4 - (i - j), 1)
    */
}

function print(A){
    for (let i = 0; i < array_length(A); i = i + 1) {
        display(A[i]);
    }
}

test = [[1, 2, 3], [8, 0, 4], [7, 6, 5]];
// test = [
//     [1, 2, 3, 4, 5, 6],
//     [20, 21, 22, 23, 24, 7],
//     [19, 32, 33, 34, 25, 8],
//     [18, 31, 36, 35, 26, 9],
//     [17, 30, 29, 28, 27, 10],
//     [16, 15, 14, 13, 12, 11]];

print(test);
display("");
rotate_matrix(test);
print(test);