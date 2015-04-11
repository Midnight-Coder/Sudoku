var puzzle = function(n){
    var matrix;
    if(!n){
        matrix = staticGen()
    }
    else{
        matrix = generateMatrix(n);
    }
    return{
        matrix: matrix
    };
}
function staticGen(){
    var n = 9,
        matrix =[];
    for(var i = 0; i<9; i++){
        matrix[i] = new Array(9);
    }
    matrix[0][0] = 5;
    matrix[0][1] = 2;
    matrix[0][4] = 7;

    matrix[1][0] = 6;
    matrix[1][3] = 1;
    matrix[1][4] = 9;
    matrix[1][5] = 5;

    matrix[2][1] = 9;
    matrix[2][2] = 8;
    matrix[2][7] = 6;


    matrix[3][0] = 8;
    matrix[3][4] = 6;
    matrix[3][8] = 3;


    matrix[4][0] = 4;
    matrix[4][3] = 8;
    matrix[4][5] = 3;
    matrix[4][8] = 1;


    matrix[5][0] = 7;
    matrix[5][4] = 2;
    matrix[5][8] = 6;


    matrix[6][1] = 6;
    matrix[6][6] = 2;
    matrix[6][7] = 8;


    matrix[7][3] = 4;
    matrix[7][4] = 1;
    matrix[7][5] = 9;
    matrix[7][8] = 5;


    matrix[8][4] = 8;
    matrix[8][7] = 7;
    matrix[8][8] = 9;

    return matrix;
}
