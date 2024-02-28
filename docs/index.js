/*document.addEventListener('DOMContentLoaded', ()=>{

    var cells=document.querySelectorAll(".value-column");
    cells.forEach(cell => {
        cell.textContent=Math.floor(Math.random()*201)-100;
        
    });

})*/
function changeColor(){
 
  document.querySelector("#p1").style.backgroundColor="blue";
  setTimeout(function(){
    document.querySelector("#p1").style.backgroundColor="";
    document.querySelector("#p2").style.backgroundColor="blue";

    setTimeout(function(){
      document.querySelector("#p2").style.backgroundColor="";
      document.querySelector("#p3").style.backgroundColor="blue";

      setTimeout(function(){
        document.querySelector("#p3").style.backgroundColor="";
      },2000)
    },2000)
  },2000)
}

class QTableAgentV1 {
    constructor(env, alpha = 0.1, gamma = 0.9, epsilon = 0.5,actionSpaceSize=4) {
        this.env = env;
        this.gridShape = [this.env.grid.length,this.env.grid[0].length];
        
        this.actionSpaceSize =actionSpaceSize;
        this.alpha = alpha;  // Learning rate
        this.gamma = gamma;  // Discount factor
        this.epsilon = epsilon;  // Exploration rate

        // Initialize Q-table
        this.Q = Array.from({ length: this.gridShape[0] }, () =>
            Array.from({ length: this.gridShape[1] }, () =>
                Array(this.actionSpaceSize).fill(0)
            )
        );
    }

    act(state, greedy = false) {
        if (Math.random() < this.epsilon && !greedy) {  // Explore with probability epsilon
            return Math.floor(Math.random() * this.actionSpaceSize);
        } else {  // Exploit using maximum Q-value
            const maxQ = Math.max(...this.Q[state[0]][state[1]]);
            const maxIndices = this.Q[state[0]][state[1]]
                .map((q, index) => q === maxQ ? index : null)
                .filter(index => index !== null);
            const action = maxIndices[Math.floor(Math.random() * maxIndices.length)];
            return action;
        }
    }

    learn(state, action, nextState, reward) {
        // Q-learning update rule
        const targetQ = reward + this.gamma * Math.max(...this.Q[nextState[0]][nextState[1]]);
        this.Q[state[0]][state[1]][action] =
            (1 - this.alpha) * this.Q[state[0]][state[1]][action] + this.alpha * targetQ;
    }

    train(episodes = 1000) {
        const episodeRewards = [];
        const stepsInEpisodes = [];

        for (let episode = 0; episode < episodes; episode++) {
            let state = this.env.reset();
            let done = false;

            let episodeReward = 0;
            let totalSteps = 0;
            while (!done) {
                const action = this.act(state);
                const [nextState, reward, done] = this.env.step(action);
                this.learn(state, action, nextState, reward);

                state = nextState;
                episodeReward += reward;
                totalSteps++;
            }

            episodeRewards.push(episodeReward);
            stepsInEpisodes.push(totalSteps);
        }
    }

    play(numEpisodes = 1, greedy = true) {
       
            let state = this.env.reset();
            let done = false;

            const allActions = [];
            while (!done) {
                const action = this.act(state, greedy);
                allActions.push(action);
                const [nextState, reward, done] = this.env.step(action);
                state = nextState;
            }
            document.write(allActions+"<br>");
          
        
    }
}


class GridWorldEnv {
    constructor(grid, rewardEnd = 1000, rewardStep = 0, rewardLost = -1000, rewardInvalidAction = -10, curiosityReward = 0) {
      this.grid = grid;
  
      // Find start and end positions
      this.startPos = null;
      this.endPos = null;
      for (let i = 0; i < this.grid.length; i++) {
        for (let j = 0; j < this.grid[i].length; j++) {
          if (this.grid[i][j] === 'S') {
            this.startPos = [i, j];
          } else if (this.grid[i][j] === 'E') {
            this.endPos = [i, j];
          }
        }
      }
  
      
      if (!this.startPos || !this.endPos) {
        throw new Error("Start position 'S' and end position 'E' must be present in the grid.");
      }
  
      this.rewardEnd = rewardEnd;
      this.rewardStep = rewardStep;
      this.rewardLost = rewardLost;
      this.rewardInvalidAction = rewardInvalidAction;
      this.curiosityReward = curiosityReward;
  
      // Action space: Left, right, up, down
      this.actionSpace = { 0: 'left', 1: 'right', 2: 'up', 3: 'down' };
  
      // Observation space: Row, col, reward
      this.observationSpace = { min: [0, 0, 0], max: [this.grid.length - 1, this.grid[0].length - 1, Infinity] };
  
      // Keep track of visited squares
      this.isVisited = new Array(this.grid.length).fill(null).map(() => new Array(this.grid[0].length).fill(false));
  
      this.reset();
    }
  
    reset() {
      this.currentPosition = this.startPos.slice(); // Clone to avoid mutation
      this.done = false;
      this.reward = 0;
      this.isVisited = new Array(this.grid.length).fill(null).map(() => new Array(this.grid[0].length).fill(false));
      return this.getObservation();
    }
  
    step(action) {
      const actionMap = {
        left: [0, -1],//0
        right: [0, 1],//1
        up: [-1, 0],//2
        down: [1, 0],//3
      };
  
      const moveDelta = actionMap[this.actionSpace[action]];
  
      // Check for out-of-bounds actions
      const newPos = [this.currentPosition[0] + moveDelta[0], this.currentPosition[1] + moveDelta[1]];
      if (newPos[0] < 0 || newPos[0] >= this.grid.length || newPos[1] < 0 || newPos[1] >= this.grid[0].length) {
        this.reward = this.rewardInvalidAction;
      } else {
        // Check for wall or end position
        if (this.grid[newPos[0]][newPos[1]] === 'W') {
          this.reward = this.rewardLost;
          this.done = true;
        } else if (this.grid[newPos[0]][newPos[1]] === 'E') {
          this.reward = this.rewardEnd;
          this.done = true;
        } else if (!this.isVisited[newPos[0]][newPos[1]]) {
          this.reward = this.curiosityReward;
          this.isVisited[newPos[0]][newPos[1]] = true;
        } else {
          this.reward = this.rewardStep;
        }
  
        this.currentPosition = newPos;
      }
  
      return [this.getObservation(), this.reward, this.done, {}];
    }
  
    getObservation() {
      return this.currentPosition;
    }
  
    render() {
        
            console.log('--- Grid World ---');
            for (let i = 0; i < this.grid.length; i++) {
              let row = '';
              for (let j = 0; j < this.grid[i].length; j++) {
                if (i === this.currentPosition[0] && j === this.currentPosition[1]) {
                  row += 'A '; // Agent symbol
                } else {
                  row += this.grid[i][j] + ' ';
                }
              }
              document.write(row+"<br>")
            }
          
    }
  }
function grid1(){

        const grid11=[["-", "-", "-", "W"],
                     ["-", "W", "-", "W"],
                    ["-", "-", "-", "-"],
                    ["S", "W", "-", "E"]];

        var g=new GridWorldEnv(grid11);
       
       setTimeout(()=>{
        g.render();
            },2000);
        setTimeout(() => {
            
            var r=g.step(2);
            
            document.write(r+"<br>");
            g.render();
        }, 2000);
       
         setTimeout(() => {
           var r= g.step(1);
           document.write(r+"<br>");
            g.render();
        }, 2000);
        setTimeout(() => {
            var r= g.step(1);
            document.write(r+"<br>");
             g.render();
         }, 2000);
         setTimeout(() => {
            var r= g.step(1);
            document.write(r+"<br>");
             g.render();
         }, 2000);
         setTimeout(() => {
            var r= g.step(3);
            document.write(r+"<br>");
             g.render();
         }, 2000);
}
function nothing(){

}
function play1(){
    const grid11=[["-", "-", "-", "W"],
                ["-", "W", "-", "W"],
                ["-", "-", "-", "-"],
                ["S", "W", "-", "E"]];

    var g=new GridWorldEnv(grid11);
    let a =new QTableAgentV1(env=g);
   
    setTimeout(()=>{
       a.play();
       
    },2000);
}
