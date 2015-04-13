$(document).ready(function() {
    var n = 9,
        correctClass = 'correct',
        wrongClass = 'wrong',
        hideElementClass = 'hidden',
        solvedArray = [],
        $hintText = $('.hint-text'),
        lastFocus;

    function hideSecondary(){
        $('.secondary-buttons').addClass(hideElementClass);
    };

    function showSecondary(){
        $('.secondary-buttons').removeClass(hideElementClass);
        $('.hint-text').empty();
    };

    $('.validate').on('click', letItRip);

    $('.clear').on('click', function(){
        $('.user-input')
        .val('')
        .attr('disabled', false)
        .removeClass(wrongClass)
        .removeClass(correctClass);

    });

    $('.user-input').on('click', function(){
        lastFocus = this;
        showSecondary();
    });
    $('.user-input').on('blur', function() {
        lastFocus = this;
    });

    $('.solve-cell').on('click', function(event){
        lastFocus.value = solveForLastCellSelected();
        hideSecondary();
    });

    $('.validate-cell').on('click', function(event){
        var message;
        if(lastFocus.value == solveForLastCellSelected()){
            message = 'Correct!';
            $hintText.removeClass(wrongClass);
            $hintText.addClass(correctClass);
        }
        else{
            message = 'Wrong.'
            $hintText.removeClass(correctClass);
            $hintText.addClass(wrongClass);
        }
        $hintText.text(message);
    });

    $('.hint').on('click', function(){
        var hintMatrix = populatingTheArray(),
            dimensions = lastFocus.dataset.index.split('-');
        $hintText.removeClass();
        $hintText.text(hintMatrix[dimensions[0]][dimensions[1]]);
    });

    function letItRip(){
        var jsPromise = Promise.resolve(fillSudoku());

        jsPromise.then(function(done) {
            hideSecondary();
            $('.user-input').attr('disabled', true);
        });
    }

    function solveForLastCellSelected(){
        if (!lastFocus) {
            return null;
        }
        var dimensions = lastFocus.dataset.index.split('-');
        return solveForACell(dimensions[0], dimensions[1]);
    }

    function fillSudoku(){
        $('.user-input').each(function(){
            var element = $(this),
                gridIndex = this.dataset.index.split('-'),
                row = gridIndex[0],
                column = gridIndex[1],
                inputValue = solveForACell(row, column);

            //Soft check for string input vs matrix rep
            if(element.val() == inputValue){
                element.addClass(correctClass);
            }else{
                element.val(inputValue);
                element.addClass(wrongClass);
            }
        });
    };

    function solveForACell(row, column){
        if(solvedArray.length === 0){
            solvedArray = populatingTheArray();
            solvingSudoku(solvedArray);
        }
        return solvedArray[row][column];
    };

    function populatingTheArray(){
        var matrix = [];
        for(var i = 0; i < n; i++){
            matrix[i] = [];
            $('.row[data-index=' + (i+1) + '] td').each(function(){
                var val = parseInt($(this).text()) || null;
                matrix[i].push(val);
            });
        }
        return eliminatingTheObvious(matrix);
    };

    function eliminatingTheObvious(matrix){
        var possibleValues = [1, 2, 3, 4, 5, 6, 7, 8, 9];

        for(var i = 0; i < matrix.length; i++){
            for(var j = 0; j < matrix[i].length; j++){
                var existingNumbers = matrix[i].filter(Boolean);
                if(matrix[i][j] === null){
                    var column = getColumn(matrix, j);
                    existingNumbers = existingNumbers.concat(column);
                    var mMatrix = getMatrix(matrix, i, j);
                    existingNumbers = existingNumbers.concat(mMatrix);
                    var difference = setDifference(possibleValues, existingNumbers);
                    matrix[i][j] = difference;
                }
            }
        }
        return matrix;
    };

    function solvingSudoku(matrix){
        //Solve the singles
        for(var i = 0; i < matrix.length; i++){
            for(var j = 0; j < matrix[i].length; j++){
                if(matrix[i][j].length === 1){
                    solveNakedSingles(matrix[i], matrix[i][j]);
                }
            }
        }
        //Recalculate the valid choices
        flattenMultipleNestedLists(matrix);
        //Remove the common choices
        for(var i = 0; i < matrix.length; i++){
            var alpha = getSelectedNumbers(matrix[i]);
            for(var j = 0; j < matrix[i].length; j++){
                if(matrix[i][j].length > 0){
                    var beta = setIntersection(alpha, matrix[i][j]);
                    if(beta.length > 0){
                        matrix[i][j] = removeCommons(beta, matrix[i][j]);
                    }
                }

            }
        }
        //Recalculate the valid choices
        flattenMultipleNestedLists(matrix);

        for(var i = 0; i < matrix.length; i++){
            var newColumns = getColumn(matrix, i);
            var alpha = getSelectedNumbers(newColumns);
            for(var j = 0; j < newColumns.length; j++){
                if(newColumns[j].length > 0){
                    var beta = setIntersection(alpha, newColumns[j]);
                    if(beta.length > 0){
                        newColumns[j] = removeCommons(beta, newColumns[j]);
                    }
                }
            }
        }

        var rowNo = 0, columnNo = 0;
        while(rowNo < 7){
            while(columnNo < 7){
                var matrixForCaln = getMatrix(matrix, rowNo, columnNo);
                var alpha = getSelectedNumbers(matrixForCaln);
                for(var i = 0; i < matrixForCaln.length; i++){
                    if(matrixForCaln[i].length > 0){
                        var beta = setIntersection(alpha, matrixForCaln[i]);
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

        for(var i = 0; i < matrix.length; i++){
            removingCommons(matrix[i]);
        }

        for(var a = 0; a < matrix.length; a++){
            var newColumns = getColumn(matrix, a);
            var resultColumn = removingCommons(newColumns);
            matrix = resultArray(a, resultColumn, matrix);
        }
        for(var i = 0; i < matrix.length; i++){
            removingCommons(matrix[i]);
        }
        return matrix;
    };

    function resultArray(column, arr, main){
        for(var i = 0; i < arr.length; i++){
            main[i][column] = arr[i];
        }
        return main;
    };

    function iterationDone(arr){
        var arrayTemp = [], nonArrayTemp = [];
        for(var i = 0; i < arr.length; i++){
            if(!Array.isArray(arr[i])){
                nonArrayTemp.push(arr[i]);
            }else{
                if(arr[i].length > 1){
                    for(var j = 0; j < arr[i].length; j++){
                        arrayTemp.push(arr[i][j]);
                    }
                }
            }
        }
        arrayTemp = arrayTemp.sort();
        var uniqueArrayTemp = gettingUniqueElement(arrayTemp);
        var areThereCommon = setIntersection(arrayTemp, nonArrayTemp);
        if(areThereCommon.length > 0 || uniqueArrayTemp.length > 0){
            return false;
        }else{
            return true;
        }
    };

    function flattenMultipleNestedLists(matrix){
        //Converts a matrix:[[1,[4]],..] -> [[1,4],...]
        for(var i = 0; i < matrix.length; i++){
            flattenListOf1Elems(matrix[i]);
        }
    };


    function flattenListOf1Elems(list){
        //Flattens a list of depth 1
        for(var i = 0; i < list.length; i++){
            if(list[i].length === 1){
                list[i] = Number(list[i]);
            }
        }
    };

    function removingCommons(list){
        var nonArrayTemp = [],
            arrayTemp = [],
            uniqueArrayTemp = [],
            removeCommons1,
            removeCommons2;

        flattenListOf1Elems(list);

        for(var i = 0; i < list.length; i++){
            //Separating selected Elements from multiple choice elements
            if(!Array.isArray(list[i])){
                nonArrayTemp.push(list[i]);
            }
            else{
                //Push the choices in a separate list
                for(var j = 0; j < list[i].length; j++){
                    arrayTemp.push(list[i][j]);
                }
            }
        }
        //TODO get lodash.js
        arrayTemp = arrayTemp.sort();
        uniqueArrayTemp = gettingUniqueElement(arrayTemp);
        var areThereCommon = setIntersection(arrayTemp, nonArrayTemp);

        if(areThereCommon.length > 0 || uniqueArrayTemp.length > 0){
            arrayTemp = [];
            uniqueArrayTemp = removeCommons(nonArrayTemp, uniqueArrayTemp);
            for(var i = 0; i < list.length; i++){
                if(list[i].length > 1){
                    removeCommons1 = setIntersection(nonArrayTemp, list[i]);
                    if(removeCommons1.length > 0){
                        for(var q = 0; q<removeCommons1.length; q++){
                            var index1 = list[i].indexOf(Number(removeCommons1[q]));
                            list[i].splice(index1, 1);
                        }
                    }
                    removeCommons2 = setIntersection(uniqueArrayTemp, list[i]);
                    if(removeCommons2.length > 0 && list[i].length > 1){
                        for(var w = 0; w<removeCommons2.length; w++){
                            var index2 = list[i].indexOf(Number(removeCommons2[w]));
                            list[i] = list[i].splice(index2, 1);
                        }
                    }
                }
            }
        }else{
            return list;
        }
        for(var i = 0; i < list.length; i++){
            if(list[i].length === 1){
                list[i] = list[i][0];
            }
        }
        if(!iterationDone(list)){
            removingCommons(list);
        }
        return list;
    };

    function gettingUniqueElement(arr){
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
    };

    function solveNakedSingles(row, number){
        for(var i = 0; i < row.length; i++){
            if(row[i].length && row[i].length > 1){
                var hi = row[i];
            }
            if(row[i].length && row[i].length > 1 && hi){
                var send = setIntersection(number, hi);
                var index = row[i].indexOf(send[0]);

                if (index > -1) {
                    row[i].splice(index, 1);
                }
            }
        }
    };

    function getSelectedNumbers(matrix){
        var newArray = [];
        for(var i = 0; i < matrix.length; i++){
            if(!Array.isArray(matrix[i])){
                newArray.push(matrix[i]);
            }
        }
        return newArray;
    };

    function removeCommons(common, arr){
        for(var i = 0; i < arr.length; i++){
            for(var j = 0; j < common.length; j++){
                if(arr[i] == common[j]){
                    arr.splice(i, 1);
                }
            }
        }
        return arr;
    };

    function setDifference(a, b){
        var difference = [];
        for (var j = 0; j < a.length; j++) {
            if (b.indexOf(a[j]) === -1) {
                difference.push(a[j]);
            }
        }
        return difference;
    }

    function setIntersection(a, b, type){
        var intersection = [];
        for (var j = 0; j < a.length; j++) {
            if (b.indexOf(a[j]) >= 0) {
                intersection.push(a[j]);
            }
        }
        return intersection;
    };

    function getColumn(matrix, column){
        var columnArray = [];
        for(var i = 0; i < matrix.length; i++){
            if(matrix[i][column] !== null){
                columnArray.push(matrix[i][column]);
            }
        }
        return columnArray;
    };

    function getMatrix(arr, row, column){
        var rowMatrix = [],
            columnMatrix = [],
            processedMatrix = [],
            flattenedMatrix = [], j;
        if(row < 3){
            row = 0;
        }else if(row < 6){
            row = 3;
        }else {
            row = 6;
        }

        if(column < 3){
            column  = 0;
        }else if(column < 6){
            column = 3;
        }else {
            column = 6;
        }

        for(var i = row; i < row+3; i++){
            rowMatrix.push(arr[i]);
            flattenedMatrix = [].concat.apply([],rowMatrix);
            j = column;
            while(j < column+3){
                columnMatrix.push(flattenedMatrix[j]);
                j++;
            }
            rowMatrix.length = 0;
            flattenedMatrix.length = 0;
        }

        for(var i = 0; i < columnMatrix.length; i++){
            if(columnMatrix[i] !== null){
                processedMatrix.push(columnMatrix[i]);
            }
        }
        return processedMatrix;
    };
});
