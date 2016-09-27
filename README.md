# PromiseChain
Light weight javascript library to handle promises control structures with ease.



This library is about structure control mechanisms to handle promises, like if/else, or while.

It work with a inside scope to save all the results of the multiple promises you can launch.



## How to use

The following example run multiple promises waiting until the end of the previous.


```js
PromiseChain = require('PromiseChain.js');   // Not necesary in client version

var dwarf = {
	gold:3,
	money:0,
	digSomeGold: function(scope){
		var me = this;
		return new Promise(function(resolve, reject) { setTimeout(function(){
			var goldExtracted = Math.floor(Math.random() * 4);
			me.gold += goldExtracted;
			console.log(me);
			console.log("I got "+goldExtracted+" gold");
		 	resolve(goldExtracted);
		} , 1000);});
	},
	askPermisionToSell: function(scope){
		var me = this;
		return new Promise(function(resolve, reject) { setTimeout(function(){

		 	resolve(true);
		
		} , 1000);});
	},
	sellGold: function(scope){
		var me = this;
		return new Promise(function(resolve, reject) { 	setTimeout(function(){
		 	  	me.gold -= 1;
		 	  	me.money += 100;
		 	  	console.log(me);
		 	  	resolve(me.gold);
		 	 } , 1000); 	
		 });
	},
	hasPermision: function(scope){
		var me = this;
		return scope.permision === true;
	},
	hasGold: function(scope){
		var me = this;
		console.log("hasGold" + me.gold);
		return me.gold > 0 ;
	},
	countMoney: function(scope){
		var me = this;
		return new Promise(function(resolve, reject) { 
	 	  	setTimeout(function(){
				console.log("you have earned "+ me.money +" of money");
				console.log(scope);
	 	  		resolve(me.money);
	 	  	} , 1000); 	
	 	});
	}
}



new PromiseChain({},dwarf)
	.continue(dwarf.digSomeGold,"fisrtMiningDone")
	.continue(dwarf.digSomeGold,"secondMiningDone")
	.continue(dwarf.askPermisionToSell,"permision")
	.ifElse(dwarf.hasPermision,function(sc){
		return new PromiseChain(sc,dwarf)	
			.while(dwarf.hasGold, dwarf.sellGold ,'whileResults') // results are stored in an array in the scope if no need you can omit the parameter
		.end();	
	},function(sc){return 'go sell your dirty gold anywhere else!';},'ifelseResult')
	.continue(dwarf.countMoney)
.end();
	
	

```
