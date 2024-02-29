


function changeColor(){
 
  document.querySelector("#p1").style.backgroundColor="blue";
  setTimeout(function(){
    document.querySelector("#p1").style.backgroundColor="";
    document.querySelector("#p2").style.backgroundColor="blue";


    setTimeout(function(){
      document.querySelector("#p2").style.backgroundColor="";
      document.querySelector("#p3").style.backgroundColor="blue";


    setTimeout(function(){
      document.querySelector("#p2").style.backgroundColor="";
    


     
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

            let episodeReward = 0;
            let totalSteps = 0;
            while (true) {
                var action = this.act(state);
                var [nextState, reward, done, info] = this.env.step(action);
                this.learn(state, action, nextState, reward);

                state = nextState;
                episodeReward += reward;
                totalSteps++;

                //Episode end condition
                if (done){break;}
            }

            episodeRewards.push(episodeReward);
            stepsInEpisodes.push(totalSteps);
        }
        return [episodeRewards, stepsInEpisodes]
    }


    play(greedy = true, max_iterations=20) {
      
      var state = this.env.reset();
      var done = false;

      const allActions = [];
      var steps = 0;
 
      while (true) {
        
        const action = this.act(state, greedy);
       
        allActions.push(this.env.actionSpace[action]);
        var [nextState, reward, done, info] = this.env.step(action);
        // allActions.push(done)
        // allActions.push(nextState)
        state = nextState;
       
        steps = steps+1;
        if (done || steps>=max_iterations){
          break
        }
        }
      return allActions;
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
        
            document.write('--- Grid World ---<br>');
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
function testenv(){

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

function testagentplay(){
    const grid11=[["-", "-", "-", "W"],
                  ["-", "W", "-", "W"],
                  ["-", "-", "-", "-"],
                  ["S", "W", "-", "E"]];

    var g=new GridWorldEnv(grid11);
    // document.write("chkp0 <br>")
    var a =new QTableAgentV1(env=g);
    printQmatrix(a.Q)
   
    setTimeout(()=>{
      // document.write("Here we go <br>")
      all_actions = a.play();
      document.write("total actions: " + all_actions.length + "<br>")
      document.write(all_actions)
    },2000);
}

function playgame(a){
  setTimeout(()=>{
  // document.write("Here we go <br>")
  all_actions = a.play();
  document.write("total actions: " + all_actions.length + "<br>")
  document.write(all_actions)
},2000);
}

function testagenttrain(){
 /* const grid11=[["-", "-", "- ", "W"],
                ["-", "W", "-", "W"],
                ["-", "-", "-", "-"],
                ["S", "W", "-", "E"]];

  var g=new GridWorldEnv(grid11);
  // document.write("chkp0 <br>")
  var a =new QTableAgentV1(env=g);*/
  setTimeout(()=>{
    document.write("Before training <br>")
    printQmatrix(a.Q)
    var [rewards, steps] = a.train(episodes=50);
    document.write("After training <br>")
    printQmatrix(a.Q)
    playgame(a)
  },5000);
  
}
function printQmatrix(Q){
  for (let i=0;i<Q.length;i++){
    for (let j=0;j<Q[0].length;j++){
      for (let k=0;k<Q[i][j].length;k++){
        document.write(formatDecimal(Q[i][j][k]))
        document.write("*")
      }
      document.write("||*")
    }
    document.write("<br>")
  }
}

function formatDecimal(number) {
  // Ensure number is a valid number
  if (isNaN(number)) {
    return "Invalid number";
  }

  // Determine the minimum integer digits based on sign
  const minIntegerDigits = number < 0 ? 3 : 4;

  // Use Intl.NumberFormat for formatting
  const formatter = new Intl.NumberFormat('en-US', {
    minimumIntegerDigits: minIntegerDigits,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return formatter.format(number);
}
function silentTraining(){
  const grid11=[["-", "-",  "W"],
                ["-", "W",  "W"],
                ["-", "-",  "-"],
                ["S", "W",  "E"]];

  var gridWorld=new GridWorldEnv(grid11);
 
  var agent =new QTableAgentV1(env=gridWorld);
 
  var episodeInput =document.getElementById("no").value;
  let numberEpisode = parseInt(episodeInput);
  
 

  prepareEnv(arr=grid11);
 setTimeout(()=>{
  var [nextState, reward] = agent.train(episodes =numberEpisode );
  
  fillTable(agent.Q);
 },2000);

 // fillTable(agent.Q);  






}
function fillTable(Q){
  
   


        let a= [];
        for(let i=0;i<Q.length;i++){
          for(let j=0;j<Q[0].length;j++){
            a.push(Q[i][j][2]);
            a.push(Q[i][j][0]);
            a.push(Q[i][j][1]);
            a.push(Q[i][j][3]);

           /*  a.push(toString(i)+toString(j)+"U") ;
             a.push(toString(i)+toString(j)+"L") ;
             a.push(toString(i)+toString(j)+"R") ;
             a.push(toString(i)+toString(j)+"D") ;*/
            /* a.push(100*i+10*j+2);
             a.push(100*i+10*j+0);
             a.push(100*i+10*j+1);
             a.push(100*i+10*j+3);*/

          }
        }
       
        var cells = document.querySelectorAll(".value-column");
        let i=0 
        cells.forEach(c => {
          
          c.textContent = Math.round(a[i]);
          i++
        
      
      });
 

}
function prepareEnv(arr){

       
            let img=[];
            
            for(let i=0;i<arr.length;i++){
              
              for(let j=0;j<arr[i].length;j++){
                
                if(arr[i][j]=="_"){
                  document.write("0");
                      img.push(" ");
                }
                else if(arr[i][j]=='W'){
                //img.push("💣");
                img.push("bomb");
                }
                else if(arr[i][j]=="S"){
                  //img.push("▶️");
                  img.push("s");
                }
                else if(arr[i][j]=="E"){
                 // img.push("🎯");
                  img.push("e");
                }
                
              
            }
          
            var cells = document.querySelectorAll(".img");
        let i=0 
        cells.forEach(c => {
          
          c.textContent = img[i];
          i++
        
      
      });


}

}