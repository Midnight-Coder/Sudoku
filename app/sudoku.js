$(document).ready(function() {
	$('.solve').hide();
	$('.hint').hide();
	$('.check').hide();
	$('.hintText').hide();
	var lastFocus;

	$('.typehere').on('keypress', function(event){
	    var key = window.event ? event.keyCode : event.which;

	    if (event.keyCode == 8 || event.keyCode == 46
	     || event.keyCode == 37 || event.keyCode == 39) {
	        return true;
	    }
	    else if ( key < 49 || key > 57 ) {
	        return false;
	    }
	    else {
	    	return true;
	    }
	}),
	$('.done').on('click', function(){
		var jsPromise = Promise.resolve(fillSudoku('done'));

		jsPromise.then(function(done) {
			$('.solve').hide();
			$('.hint').hide();
			$('.check').hide();
			$('.hintText').hide();	
		});	
	}),
	$('.finish').on('click', function(){
		var jsPromise = Promise.resolve(fillSudoku());

		jsPromise.then(function(done) {
			$('.solve').hide();
			$('.hint').hide();
			$('.check').hide();
			$('.hintText').hide();
		});
	}),
	fillSudoku = function(action){
		$('.typehere').each(function(){
			var elementSelector = $(this),
				idName = this.id,
				exisitingValue = this.value,
				dimensions = idName.split("-"),
				row = dimensions[0],
				column = dimensions[1],
				inputValue;
			inputValue = findInputValue(row, column);
			if(action === 'done'){
				if(exisitingValue == inputValue){
					elementSelector.addClass('correct');
				}else{
					this.value = inputValue;
					elementSelector.addClass('wrong');
				}
			}else{
				this.value = inputValue;
				elementSelector.removeClass('correct');
				elementSelector.removeClass('wrong');
			}
		});
	}
	findInputValue = function(row, column, arr){
		var value,
			finalArr,
			mainArray = populatingTheArray();

		finalArr = solvingSudoku(mainArray);
		if(!arr){
			arr = finalArr;
		}

		for(var i=0; i<arr.length; i++){
			for(var j=0; j<arr[i].length; j++){
				if(row == i & column == j){
					value = arr[i][j];
					return value;
				}
			}
		}
	},
	$('.typehere').on('click', function(){
		lastFocus = this;
		$('.solve').show();
		$('.hint').show();
		$('.check').show();
		$('.hintText').hide();
	}),
	$('.typehere').on('blur', function() {
	    lastFocus = this;
	}),
	$('.solve').on('click', function(event){
		event.preventDefault();
    	event.stopPropagation();
    	var idName,
    		dimensions,
    		row,
    		column,
    		solvedValue;

    	if (lastFocus) {
			idName = lastFocus.id;
			dimensions = idName.split("-");
			row = dimensions[0];
			column = dimensions[1];
			solvedValue = findInputValue(row, column);
			lastFocus.value = solvedValue;
	    }
	    $('.solve').hide();
	    $('.hint').hide();
	    $('.check').hide();
	    $('.hintText').hide();
	}),    

	$('.hint').on('click', function(event){
		event.preventDefault();
    	event.stopPropagation();
    	var hintMatrix,
    		idName,
    		dimensions,
    		row,
    		column,
    		hintValues = [],
    		text;

    	if (lastFocus) {
			idName = lastFocus.id;
			dimensions = idName.split("-");
			row = dimensions[0];
			column = dimensions[1];
			hintMatrix = populatingTheArray();
			hintValues = findInputValue(row, column, hintMatrix),
			text = hintValues.length>1 ? 'values are ' : 'value is ';
			text = 'The possible ' + text + hintValues;
			$('.hintText').text(text);
			$('.hintText').show();
	    }
	    $('.hint').hide();
	}),

	$('.check').on('click', function(event){
		event.preventDefault();
    	event.stopPropagation();
    	var idName,
    		dimensions,
    		row,
    		column,
    		actualValue,
    		existingValue;

    	if (lastFocus) {
			idName = lastFocus.id;
			dimensions = idName.split("-");
			row = dimensions[0];
			column = dimensions[1];
			actualValue = findInputValue(row, column),
			existingValue = lastFocus.value;
			if(existingValue){
				$('.hintText').show();
				if(existingValue == actualValue){
					$('.hintText').text('Yaay, You are right!');
				}else{
					$('.hintText').text('Hmm, you are wrong!');
				}
			}
		}
	}),

	$('.clear').on('click', function(){
		$('.typehere').val('');
		$('.solve').hide();
		$('.hint').hide();
		$('.check').hide();
	    $('.hintText').hide();
	}),

	populatingTheArray = function(){		
		var row1 = [],
			row2 = [],
			row3 = [],
			row4 = [],
			row5 = [],
			row6 = [],
			row7 = [],
			row8 = [],
			row9 = [],
			mainArray = [row1, row2, row3, row4, row5, row6, row7, row8, row9];

		$('.row.1-1 td').each(function(){
			document.all ? row1.push(this.innerText) : row1.push(this.textContent);
		});

		$('.row.2-1 td').each(function(){
			document.all ? row2.push(this.innerText) : row2.push(this.textContent);
		});

		$('.row.3-1 td').each(function(){
			document.all ? row3.push(this.innerText) : row3.push(this.textContent);
		});

		$('.row.1-2 td').each(function(){
			document.all ? row4.push(this.innerText) : row4.push(this.textContent);
		});
		$('.row.2-2 td').each(function(){
			document.all ? row5.push(this.innerText) : row5.push(this.textContent);
		});

		$('.row.3-2 td').each(function(){
			document.all ? row6.push(this.innerText) : row6.push(this.textContent);
		});

		$('.row.1-3 td').each(function(){
			document.all ? row7.push(this.innerText) : row7.push(this.textContent);
		});
		$('.row.2-3 td').each(function(){
			document.all ? row8.push(this.innerText) : row8.push(this.textContent);
		});

		$('.row.3-3 td').each(function(){
			document.all ? row9.push(this.innerText) : row9.push(this.textContent);
		});
		mainArray = eliminatingTheObvious(mainArray);
		return mainArray;
	},
	eliminatingTheObvious = function(mainArray){
		var possibleValues = [1, 2, 3, 4, 5, 6, 7, 8, 9];

		for(var i=0; i<mainArray.length; i++){
			for(var j=0; j<mainArray[i].length; j++){
				var existingNumbers = mainArray[i].filter(Boolean);
				if(mainArray[i][j] === ''){
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
		var temp = [];
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