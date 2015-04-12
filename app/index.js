$(document).ready(function() {
    var n = 9,
        correctClass = 'correct',
        wrongClass = 'wrong',
        solvedArray = [];

    $('.done').on('click', function(){
        var jsPromise = Promise.resolve(fillSudoku());

        jsPromise.then(function(done) {
            console.log(done);
        });
    });

    $('.clear').on('click', function(){
        $('.user-input').val('');
    });

    fillSudoku = function(){
        $('.user-input').each(function(){
            var element = $(this),
                gridIndex = this.dataset.index.split('-'),
                row = gridIndex[0],
                column = gridIndex[1],
                inputValue = solveForACell(row, column);

            if(element.val() === inputValue){
                element.addClass(correctClass);
            }else{
                element.val(inputValue);
                element.addClass(wrongClass);
            }
        });
    }
    solveForACell = function(row, column){
        if(solvedArray.length === 0){
            solvedArray = populatingTheArray();
            solvingSudoku(solvedArray);
        }
        return solvedArray[row][column];
    };


    populatingTheArray = function(){
        var matrix = [];
        for(var i=0; i<n; i++){
            matrix[i] = [];
            $('.row[data-index=' + (i+1) + '] td').each(function(){
                var val = parseInt($(this).text()) || null;
                matrix[i].push(val);
            });
        }
        return eliminatingTheObvious(matrix);
    },
    eliminatingTheObvious = function(mainArray){
        var possibleValues = [1, 2, 3, 4, 5, 6, 7, 8, 9];

        for(var i=0; i<mainArray.length; i++){
            for(var j=0; j<mainArray[i].length; j++){
                var existingNumbers = mainArray[i].filter(Boolean);
                if(mainArray[i][j] === null){
                    var column = getColumn(mainArray, j);
                    existingNumbers = concatArray(existingNumbers, column);
                    var mMatrix = getMatrix(mainArray, i, j);
                    existingNumbers = concatArray(existingNumbers, mMatrix);
                    var difference = getCommon(possibleValues, existingNumbers, 'diff');
                    mainArray[i][j] = difference;
                }
            }
        }
        return mainArray;
    },
    singleArraystoNumbers = function(mainArray){
        for(var i=0; i<mainArray.length; i++){
            for(var j=0; j<mainArray[i].length; j++){
                if(Array.isArray(mainArray[i][j]) && mainArray[i][j].length === 1){
                    mainArray[i][j] = makeSingleValueArraytoNumber(mainArray[i][j]);
                }
            }
        }
        return mainArray;
    },
    solvingSudoku = function(mainArray){
        for(var i=0; i<mainArray.length; i++){
            for(var j=0; j<mainArray[i].length; j++){
                if(Array.isArray(mainArray[i][j]) && mainArray[i][j].length === 1){
                    solveNakedSingles(mainArray[i], mainArray[i][j]);
                }
            }
        }

        singleArraystoNumbers(mainArray);

        for(var i=0; i<mainArray.length; i++){
            var alpha = makeSinglesasArray(mainArray[i]);
            for(var j=0; j<mainArray[i].length; j++){
                if(Array.isArray(mainArray[i][j]) && mainArray[i][j].length > 0){
                    var beta = getCommon(alpha, mainArray[i][j]);
                    if(beta.length > 0){
                        mainArray[i][j] = removeCommons(beta, mainArray[i][j]);
                    }
                }

            }
        }

        singleArraystoNumbers(mainArray);

        for(var i=0; i<mainArray.length; i++){
            var newColumns = getColumn(mainArray, i);
            var alpha = makeSinglesasArray(newColumns);
            for(var j=0; j<newColumns.length; j++){
                if(Array.isArray(newColumns[j]) && newColumns[j].length > 0){
                    var beta = getCommon(alpha, newColumns[j]);
                    if(beta.length > 0){
                        newColumns[j] = removeCommons(beta, newColumns[j]);
                    }
                }
            }
        }

        var rowNo = 0, columnNo = 0;
        while(rowNo < 7){
            while(columnNo < 7){
                var matrixForCaln = getMatrix(mainArray, rowNo, columnNo);
                var alpha = makeSinglesasArray(matrixForCaln);
                for(var i=0; i<matrixForCaln.length; i++){
                    if(Array.isArray(matrixForCaln[i]) && matrixForCaln[i].length > 0){
                        var beta = getCommon(alpha, matrixForCaln[i]);
                        if(beta.length > 0){
                            matrixForCaln[i] = removeCommons(beta, matrixForCaln[i]);
                        }
                    }
                }
                columnNo = columnNo + 3;
            }
            rowNo = rowNo + 3;
            columnNo = 0;
        }

        for(var i=0; i<mainArray.length; i++){
            removingCommons(mainArray[i]);
        }

        for(var a=0; a<mainArray.length; a++){
            var newColumns = getColumn(mainArray, a);
            var resultColumn = removingCommons(newColumns);
            mainArray = resultArray(a, resultColumn, mainArray);
        }
        for(var i=0; i<mainArray.length; i++){
            removingCommons(mainArray[i]);
        }
        return mainArray;
    },
    resultArray = function(column, arr, main){
        for(var i=0; i<arr.length; i++){
            main[i][column] = arr[i];
        }
        return main;
    },
    iterationDone = function(arr){
        var arrayTemp = [], nonArrayTemp = [];
        for(var i=0; i<arr.length; i++){
            if(!Array.isArray(arr[i])){
                nonArrayTemp.push(arr[i]);
            }else{
                if(arr[i].length > 1){
                    for(var j=0; j<arr[i].length; j++){
                        arrayTemp.push(arr[i][j]);
                    }
                }
            }
        }
        arrayTemp = arrayTemp.sort();
        var uniqueArrayTemp = gettingUniqueElement(arrayTemp);
        var areThereCommon = getCommon(arrayTemp, nonArrayTemp);
        if(areThereCommon.length > 0 || uniqueArrayTemp.length > 0){
            return false;
        }else{
            return true;
        }
    },
    makeSingleArraytoValue = function(arr){
        for(var i=0; i<arr.length; i++){
            if(Array.isArray(arr[i])){
                if(arr[i].length == 1){
                    arr[i] = Number(arr[i]);
                }
            }else{
                arr[i] = Number(arr[i]);
            }
        }
        return arr;
    }
    removingCommons = function(arr){
        var nonArrayTemp = [],
            arrayTemp = [],
            uniqueArrayTemp = [],
            removeCommons1,
            removeCommons2;
        arr = makeSingleArraytoValue(arr);
        for(var i=0; i<arr.length; i++){
            if(Array.isArray(arr[i]) && arr[i].length == 1){
                arr[i] = arr[i][0];
            }
        }
        for(var i=0; i<arr.length; i++){
            if(!Array.isArray(arr[i])){
                nonArrayTemp.push(arr[i]);
            }else{
                if(arr[i].length > 1){
                    for(var j=0; j<arr[i].length; j++){
                        arrayTemp.push(arr[i][j]);
                    }
                }
            }
        }
        arrayTemp = arrayTemp.sort();
        uniqueArrayTemp = gettingUniqueElement(arrayTemp);
        var areThereCommon = getCommon(arrayTemp, nonArrayTemp);
        if(areThereCommon.length > 0 || uniqueArrayTemp.length > 0){
            arrayTemp = [];
            uniqueArrayTemp = removeCommons(nonArrayTemp, uniqueArrayTemp);
            for(var i=0; i<arr.length; i++){
                if(Array.isArray(arr[i]) && arr[i].length > 1){
                    removeCommons1 = getCommon(nonArrayTemp, arr[i]);
                    if(removeCommons1.length > 0){
                        for(var q=0; q<removeCommons1.length; q++){
                            var index1 = arr[i].indexOf(Number(removeCommons1[q]));
                            arr[i].splice(index1, 1);
                        }
                    }
                    removeCommons2 = getCommon(uniqueArrayTemp, arr[i]);
                    if(removeCommons2.length > 0 && arr[i].length > 1){
                        for(var w=0; w<removeCommons2.length; w++){
                            var index2 = arr[i].indexOf(Number(removeCommons2[w]));
                            arr[i] = arr[i].splice(index2, 1);
                        }
                    }
                }
            }
        }else{
            return arr;
        }
        for(var i=0; i<arr.length; i++){
            if(Array.isArray(arr[i]) && arr[i].length == 1){
                arr[i] = arr[i][0];
            }
        }
        if(!iterationDone(arr)){
            removingCommons(arr);
        }
        return arr;
    },
    gettingUniqueElement = function(arr){
        var tmp = [], repeating = [];
        for(var i = 0; i < arr.length; i++){
            var index = tmp.indexOf(arr[i]),
                repeatIndex = repeating.indexOf(arr[i]);
            if(index == -1 && repeatIndex == -1){
                tmp.push(arr[i]);
            }else if(index == -1 && repeatIndex !== -1){
                repeating.push(arr[i]);
            }else{
                repeating.push(arr[i]);
                tmp.splice(index, 1);
            }
        }
        return tmp;
    },
    solveNakedSingles = function(row, number){
        for(var i=0; i<row.length; i++){
            if(row[i].length && row[i].length > 1){
                var hi = row[i];
            }
            if(row[i].length && row[i].length > 1 && hi){
                var send = getCommon(number, hi);
                var index = row[i].indexOf(send[0]);

                if (index > -1) {
                    row[i].splice(index, 1);
                }
            }
        }
    },
    makeSingleValueArraytoNumber =  function(arr){
        return Number(arr);
    },
    makeSinglesasArray = function(arr){
        var newArray = [];
        for(var i=0; i<arr.length; i++){
            if(!Array.isArray(arr[i])){
                newArray.push(arr[i]);
            }
        }
        return newArray;
    },
    removeCommons = function(common, arr){
        for(var i=0; i<arr.length; i++){
            for(var j=0; j<common.length; j++){
                if(arr[i] == common[j]){
                    arr.splice(i, 1);
                }
            }
        }
        return arr;
    },
    concatArray = function(array1, array2){
        for(var i=0; i<array2.length; i++){
            array1.push(array2[i]);
        }
        return array1;
    },
    getCommon = function(a, b, type){
        var d = {};
        var results = [], newResults = [];
        for (var i = 0; i < b.length; i++) {
            d[b[i]] = true;
        }
        for (var j = 0; j < a.length; j++) {
            if (d[a[j]]) {
                results.push(a[j]);
            }else{
                newResults.push(a[j]);
            }
        }
        if(type === 'diff'){
            return newResults
        }else{
            return results;
        }
    },
    getColumn = function(arr, column){
        var columnArray = [];
        for(var i=0; i<arr.length; i++){
            if(arr[i][column] !== ''){
                columnArray.push(arr[i][column]);
            }
        }
        return columnArray;
    },
    getMatrix = function(arr, row, column){
        var matrix = [],
            newMatrix = [],
            finalMatrix = [],
            flattenedMatrix = [], j;
        if(row < 3){
            row = 0;
        }else if(row = 3 && row < 6){
            row = 3;
        }else {
            row = 6;
        }

        if(column < 3){
            column =0;
        }else if(column = 3 && column < 6){
            column = 3;
        }else {
            column = 6;
        }

        for(var i=row; i<row+3; i++){
            matrix.push(arr[i]);
            flattenedMatrix = [].concat.apply([],matrix);
            j = column;
            while(j<column+3){
                newMatrix.push(flattenedMatrix[j]);
                j++;
            }
            matrix.length = 0;
            flattenedMatrix.length = 0;
        }

        for(var i=0; i<newMatrix.length; i++){
            if(newMatrix[i] !== ''){
                finalMatrix.push(newMatrix[i]);
            }
        }
        return finalMatrix;
    };
});
