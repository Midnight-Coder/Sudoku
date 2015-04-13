# Sudoku

A 9*9 Sudoku puzzle. 

The app allows the user to:

1. Solve the puzzle and validate their answer with the correct answer
2. Get hints for each cell
3. Validate the value of each cell
4. A 'cheat option' to solve for 1 cell
5. Responsive grid for mobile-web, tablets, desktops and retina displays

Next steps:

1. Puzzle generator
2. Ability to select grid size (n*n upto 16)
3. Connect with FB
4. Ability to save session (once FB account is connected)


Next steps wrt tech stack:

1. Grunt, Jade, LESS (as can be seen on the configure branch)
2. .js refactoring -> Move to a slim framework like Backbone
3. MongoDB integration for user session storage
4. Karma and mocha for unit testing

Refs (lot of the solver was adopted from):

1. [Mantere & Koljonen paper](http://users.encs.concordia.ca/~kharma/coen6321/Papers/SudokuGA%20(1).pdf)
2. [Norvig's blog](http://norvig.com/sudoku.html)
3. [Some rudimentary ground work from here ](http://www.sudokuessentials.com/sudoku_tips.html)
4. Numerous Stackoverflow answers and Github repos


-------
#Screenshots

![app](https://cloud.githubusercontent.com/assets/2917027/7108172/af69f36c-e132-11e4-8b1e-9db7331b70a1.png)
The App


![validating your answer](https://cloud.githubusercontent.com/assets/2917027/7108173/b493098c-e132-11e4-8f36-6aa6a68abfc0.png)
Validate your puzzle


![validation on a per cell basis](https://cloud.githubusercontent.com/assets/2917027/7108175/b85b7068-e132-11e4-9a37-67a7a9148d29.png)
Validate on a per cell basis


![hints for a cell](https://cloud.githubusercontent.com/assets/2917027/7108176/b9e8712e-e132-11e4-851b-f980e1b1e029.png)
Hints for each cell


![mobile-web](https://cloud.githubusercontent.com/assets/2917027/7108184/3b0b4b00-e133-11e4-8c4c-193b601da6ed.png)
Mobile-web version
