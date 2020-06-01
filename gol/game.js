
import Square from './Square.js';
import planeShape from './shapes/plane.js';
import planesGunShape from './shapes/planesGun.js';
import oscilatorsShape from './shapes/oscialtors.js';
import spaceshipsShape from './shapes/spaceships.js';
import diehard1Shape from './shapes/diehard1.js';
import diehard2Shape from './shapes/diehard2.js';


function game(container, gWidth, gHeight, nxC, nyC){
    let squares = [];
    this.erasing = false;
    this.running = false;
    this.framesSteps = 100;
    this.currentState = [];
    let nextState = [];
    this.timeout = null;
    const dimSW = gWidth / nxC;
    const dimSH = gHeight / nyC;
    const velocityTag = document.getElementById('velocityTag');
    const generationsTag = document.getElementById('generations');
    velocityTag.innerText = this.framesSteps;
    this.operations = [
        [-1, -1],
        [-1, 0],
        [-1, 1],
        [0, -1],
        [0, 1],
        [1, -1],
        [1, 0],
        [1, 1],
    ];


    document.addEventListener('keydown', (ev) => {
        if(ev.keyCode === 18) {
            this.setErase(true);
        }
    });

    document.addEventListener('keyup', (ev) => {
        this.setErase(false);
    });

    this.setFramesStep = (framesXmseg) => {
        const fr = parseInt(framesXmseg);
        if(this.running) {
            this.stop();
            this.framesSteps = (200 - fr) % 200;
            this.start();
        } else {
            this.framesSteps = (200 - fr) % 200;
        }
        velocityTag.innerText = fr;
    };

    this.setErase = (flag) => {
        this.erasing = flag;
    };

    this.random = () => {
        const randomState = [];
        for(let i = 0; i < nyC; i++) {
            randomState.push(Array.from(Array(nxC), () => (Math.random() > 0.4) ? 1 : 0));
        }

        return randomState;
    };

    this.gen = (shape) => {
        generationsTag.innerText = 0;
        const shapeState = [];

        const shapes = {
            random: this.random(),
            plane: planeShape,
            planesgun: planesGunShape,
            oscilators: oscilatorsShape,
            spaceships: spaceshipsShape,
            diehard1: diehard1Shape,
            diehard2: diehard2Shape,
        };

        for(let i = 0; i < nyC; i++) {
            shapeState.push(Array.from(Array(nxC), () => 0));
        }

        if(shape !== '') {
            shapeState.forEach( (row, ndx) => {
                if(ndx < shapes[shape].length) {
                    row.splice(shapes[shape][0][ndx], shapes[shape].length, ...shapes[shape][ndx]);
                }
            });
        }

/*
        switch(shape) {
            case 'random':
                const randomState = this.random();
                shapeState.forEach( (row, ndx) => {
                    if(ndx < randomState.length) {
                        row.splice(randomState[0][ndx], randomState.length, ...randomState[ndx]);
                    }
                });
                break;
            case 'plane':
                shapeState.forEach( (row, ndx) => {
                    if(ndx < planeShape.length) {
                        row.splice(planeShape[0][ndx], planeShape.length, ...planeShape[ndx]);
                    }
                });
                break;
            case 'planesGun':
                shapeState.forEach( (row, ndx) => {
                    if(ndx < planesGunShape.length) {
                        row.splice(planesGunShape[0][ndx], planesGunShape.length, ...planesGunShape[ndx]);
                    }
                });
                break;
            case 'oscilators':
                shapeState.forEach( (row, ndx) => {
                    if(ndx < oscilatorsShape.length) {
                        row.splice(oscilatorsShape[0][ndx], oscilatorsShape.length, ...oscilatorsShape[ndx]);
                    }
                });
                break;
            case 'spaceships':
                shapeState.forEach( (row, ndx) => {
                    if(ndx < spaceshipsShape.length) {
                        row.splice(spaceshipsShape[0][ndx], spaceshipsShape.length, ...spaceshipsShape[ndx]);
                    }
                });
                break;
            case 'diehard1':
                shapeState.forEach( (row, ndx) => {
                    if(ndx < diehard1Shape.length) {
                        row.splice(diehard1Shape[0][ndx], diehard1Shape.length, ...diehard1Shape[ndx]);
                    }
                });
                break;
            case 'diehard2':
                shapeState.forEach( (row, ndx) => {
                    if(ndx < diehard2Shape.length) {
                        row.splice(diehard2Shape[0][ndx], diehard2Shape.length, ...diehard2Shape[ndx]);
                    }
                });
                break;
            default:
                break;
        }*/

        this.updateBoard(shapeState);
    };

    this.buildBoard = () => {
        const board = document.createElement('div');
        board.style.width = `${gWidth}px`;
        board.style.height = `${gHeight}px`;
        board.className = 'board';
        this.currentState = [];
        for(let i = 0; i < nyC; i++) {
            this.currentState.push(Array.from(Array(nxC), () => 0));
        }
    
        for(let y = 0; y < nyC; y++) {
            squares.push([]);
            for(let x = 0; x < nxC; x++) {
                const square = new Square(x, y, this.currentState, dimSW, dimSH , this.erasing);
                squares[y].push(square);
                board.appendChild(square.box);
            }
        }
    
        return board;
    };

    this.updateBoard = (state) => {
        squares.forEach( (row, x) => row.forEach( (box, y) => {
            if(state[x][y]) {
                box.toLive();
            } else {
                box.toDie();
            }
        }));

        nextState = this.currentState.map( row => [...row]);
    };

    this.render = async () => {
        nextState = this.currentState.map( (row, y) => row.map( (status, x) => {
            let willBealive = status;
            const nyC = this.currentState[0].length;
            const nxC = this.currentState.length;
            const yCoord = (y) => (y + nyC) % nyC;
            const xCoord = (x) => (x + nxC) % nxC;
    
            const neighbors =  this.operations.reduce((acum, [_y, _x]) => {
                const newY = yCoord(y + _y);
                const newX = xCoord(x + _x);
    
                return acum + this.currentState[newY][newX];
            }, 0);
    
            //a dead cell with 3 neighbors goto live
            if(!status && neighbors === 3) {
                willBealive = 1;
    
            //a alive cell with less than 2 or more than 3 go to die
            } else if (status && neighbors < 2 || neighbors > 3) {
                willBealive = 0;
            }

            return willBealive;
        }));

        this.updateBoard(nextState);
    };

    this.frameSet = () => {
        if(!this.running) {
            return;
        }
        this.render();
        generationsTag.innerText = parseInt(generationsTag.innerText) + 1;
        this.timeout = setTimeout(this.frameSet ,this.framesSteps);
    };

    this.start = () => {
        if(this.running) return;
        this.running = true;
        this.frameSet();
    };
    
    this.stop = () => {
        this.running = false;
        clearTimeout(this.timeout);
    };

    const board = this.buildBoard();
    container.appendChild(board);

    return this;
}

export default game;
