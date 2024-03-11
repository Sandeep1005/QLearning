//Reset the environment , values are set to original state
function resetEnv(){ 
  var state=agent.env.getObservation();
  var row=state[0];
  var col=state[1];
  //calculates the cell id 
  var cellId=(row*4+col)*9+2;
  document.getElementsByClassName("inner-column")[cellId].textContent="";
  document.getElementById("tr").textContent="";
  agent.env.reset();

  //Reset the display elements  
  document.getElementById("Q").innerHTML = "Q<sub>old</sub>";
  var Sub=document.querySelectorAll(".sub");
  Sub.forEach(s=>{
     
    s.style.backgroundColor="";
   })

  //prepare the environment again
  prepareEnv(arr=grid11);
 
}

//Visualize the environment
function visualize(){
  //Clear the background color of the cells
  var Sub=document.querySelectorAll(".sub");
  Sub.forEach(s=>{
    s.style.backgroundColor="";
  })

  //Remove and set text context for the certain i
  document.getElementById("tr").textContent="R";
  document.getElementById("tr").style.color="";
  document.querySelector("#p1").style.backgroundColor="blueviolet";
  document.querySelector("#p1").style.color="antiquewhite";

  //Place the agent icon
  var cells=document.querySelectorAll(".inner-table");
 
  var state=agent.env.getObservation();
  var row=state[0];
  var col=state[1];
  var cellId=row*4+col;

  //remove play button and place agent icon at state
  document.getElementsByClassName("img")[cellId].textContent="🕵🏼‍♀️";
  cells[cellId].style.border="3px solid yellow";  
  var state=agent.env.getObservation();
  var row=state[0];
  var col=state[1];
  var cellId=row*4+col;

  //Highlighting the current state
  document.getElementsByClassName("img")[cellId].textContent="🕵🏼‍♀️";
  cells[cellId].style.border="3px solid yellow";

  //find the maximum value from the cells
  var max=Number.NEGATIVE_INFINITY;
  var innerCells=document.querySelectorAll(".value-column");
  innerCells=Array.from(innerCells);
  
  var innerCells2 =innerCells.slice(cellId*4,cellId*4+4);

  innerCells2.forEach(c=>{
    
      let v=Number(c.textContent) ;
      
      if(v>max){
        max=v;
       
      }
        
  })

    //assign the background color to maximum value after 1 second
    setTimeout(()=>{
        innerCells2.forEach(c=>{
        let v=Number(c.textContent) ;
        if(v==max){
    
          c.style.backgroundColor="gold";

                    }
                })
        },1000)

 //Step 1      
 setTimeout(function(){
  var action=agent.act(state=agent.env.getObservation(),greedy=true);
  var [newState,reward,done,info]=agent.env.step(action=action);
  
  document.getElementsByClassName("img")[cellId].textContent="";
  var row=state[0];
  var col=state[1];
  var oldRewardCellId=(row*4+col)*9+2;
  document.getElementsByClassName("inner-column")[oldRewardCellId].textContent="";

    //calculate new cell id each time agent moves and place agent icon in that cell
    var row=newState[0];
    var col=newState[1];
    var newCellId=row*4+col;
    let v=reward.toString();

    
    document.getElementsByClassName("img")[newCellId].innerHTML= "🕵";

    //place the reward in the particular cell
    var row=newState[0];
    var col=newState[1];
    var rewardCellId=(row*4+col)*9+2;
    document.getElementsByClassName("inner-column")[rewardCellId].textContent=v;
    
   
  //TABLE REWARD VALUE
   if(reward>0){
    document.getElementsByClassName("inner-column")[rewardCellId].style.color="green";//table reward
   
   }
   else{
    document.getElementsByClassName("inner-column")[rewardCellId].style.color="red";
   
   }
   //Removes the border and background color of cells
   cells[cellId].style.border="";
    innerCells2.forEach(c=>{

      c.style.backgroundColor="";

    })

    document.querySelector("#p1").style.backgroundColor="";
    document.querySelector("#p1").style.color="";
    document.querySelector("#p2").style.backgroundColor="blueviolet";
    document.querySelector("#p2").style.color="antiquewhite";
   
    //step 2
    setTimeout(function(){

    
      document.getElementById("tr").textContent=reward;
     //Equation REWARD value 
     if(reward>0){
      document.getElementById("Q").textContent=max;
      document.getElementById("tr").style.color="green"

     }
     else{
      document.getElementById("Q").textContent=max;
      document.getElementById("tr").style.color="red";
     }
      
    

      if(action==0){
        innerCells2[1].style.backgroundColor="gold";
      }
      if(action==1){
        innerCells2[2].style.backgroundColor="gold";
      }
      if(action==2){
        innerCells2[0].style.backgroundColor="gold";
      }
      if(action==3){
        innerCells2[3].style.backgroundColor="gold";
      }

      //To find the  index of the Q  table
      var row=newState[0];
      var col=newState[1];
      var I=(row*4+col)*4;

     //Insert the values of InnerValue class to the sub class 
     var InnerValue=document.querySelectorAll(".value-column");
     var Sub=document.querySelectorAll(".sub");
     InnerValue=Array.from(InnerValue);
       InnerValue=InnerValue.slice(I,I+4);
       InnerValue.forEach((C, index) => {
       C.style.backgroundColor="violet";
       Sub[index].innerHTML = C.textContent;
 
        });
      //assign the color to the Q values 
      Sub.forEach(s=>{
  
          s.style.color="violet";

      })
      
      document.getElementById("Q").style.color="gold";
      document.querySelector("#p2").style.backgroundColor="";
      document.querySelector("#p2").style.color="";
      document.querySelector("#p3").style.backgroundColor="blueviolet";
      document.querySelector("#p3").style.color="antiquewhite";

   

   // Step 3 in this all the values are set to the original state
   setTimeout(function(){
     
    document.getElementById("tr").textContent="R";
    document.getElementById("tr").style.color="";

    document.getElementById("Q").innerHTML = "Q<sub>old</sub>";
    innerCells2.forEach(c=>{

      c.style.backgroundColor="";

    })

    InnerValue.forEach((C) => {
      C.style.backgroundColor="";
       
      
   });

   //It assigns the default text and color
   Sub[0].innerHTML="Q<sub>u</sub>";
   Sub[1].innerHTML="Q<sub>l</sub>";
   Sub[2].innerHTML="Q<sub>r</sub>";
   Sub[3].innerHTML="Q<sub>d</sub>";
   Sub.forEach(s=>{

    s.style.color="";

   })
    
   document.getElementById("Q").style.color="";
   document.querySelector("#p3").style.backgroundColor="";
   document.querySelector("#p3").style.color="";
   
   //It updates the Q values and fill the updated values in the table
   agent.learn(state=state,action=action,nextState=newState,reward=reward);
   fillTable(Q=agent.Q);
   

  
   },2000)
 },2000)
},2000)
}
  
//Q Table Agent Class
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

  //Action Selection
  act(state, greedy = false) {
     
    if (Math.random() < this.epsilon && !greedy) {  // Explore with probability epsilon
        return Math.floor(Math.random() * this.actionSpaceSize);
      } 
      else {  // Exploit using maximum Q-value
        const maxQ = Math.max(...this.Q[state[0]][state[1]]);
        const maxIndices = this.Q[state[0]][state[1]]
            .map((q, index) => q === maxQ ? index : null)
            .filter(index => index !== null);
        const action = maxIndices[Math.floor(Math.random() * maxIndices.length)];
        return action;
      }
    }
    
    //Q learning update 
    learn(state, action, nextState, reward) {
        // Q-learning update rule
        var targetQ = reward + this.gamma * Math.max(...this.Q[nextState[0]][nextState[1]]);
        this.Q[state[0]][state[1]][action] =
            (1 - this.alpha) * this.Q[state[0]][state[1]][action] + this.alpha * targetQ;
  }
   
    //Training the agent by giving number of eposides as argument
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
    
    //Play the game
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

//Grid environment class
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

  //Reset the environment to its initial state
  reset() {
    this.currentPosition = this.startPos.slice(); // Clone to avoid mutation
    this.done = false;
    this.reward = 0;
    this.isVisited = new Array(this.grid.length).fill(null).map(() => new Array(this.grid[0].length).fill(false));
    return this.getObservation();
  }

  //It determines the direction of the agent  based on the values[0,1,2,3]
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

  //It gives the current state of the agent
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


var grid11=[["-", "-", "W", "-"],
          ["W", "-", "-", "-"],
          ["-", "-", "-", "-"],
          ["S", "W", "-", "E"]];
var gridWorld = new GridWorldEnv(grid11);
var agent = new QTableAgentV1(env=gridWorld);
window.addEventListener("load",silentTraining);

//It takes number of eposides as input and assign to the train method
function silentTraining(){
    var episodeInput =document.getElementById("no").value;
    let numberEpisode = parseInt(episodeInput);

    setTimeout(()=>{
        prepareEnv(arr=grid11);
        var [nextState, reward] = agent.train(episodes =numberEpisode );
        
        //The values are filled into the table by calling fillTable() method
        fillTable(agent.Q);
        agent.env.reset();
    },2000);

}

//Values are stored in the table
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
  i++;
});
}

//icons are pushed in to the table
function prepareEnv(arr){
var img=[];

for(let i=0;i<arr.length;i++){
  for(let j=0;j<arr[i].length;j++){
    if(arr[i][j]=="-"){
      img.push(" ");
    }
    else if(arr[i][j]=='W'){
      img.push("💣");
      // img.push("bomb");
    }
    else if(arr[i][j]=="S"){
      img.push("▶️");
      // img.push("s");
    }
    else if(arr[i][j]=="E"){
      img.push("🎯");
      // img.push("e");
    }
  }
}
var cells = document.querySelectorAll(".img");
let i=0 
cells.forEach(c => {
  c.textContent = img[i];
  i++
});
}


   
   
   

     
    

  
 
  
 

 
 

    
      

      
      
      

    
  
    
    


    
  

      
    
     
       
   


   







