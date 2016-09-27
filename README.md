# PromiseChain
Light weight javascript library to handle promises control structures with ease.



This library is about structure control mechanisms to handle promises, like if/else, or while.

It work with a inside scope to save all the results of the multiple promises you can launch.



## How to use

The following example run multiple promises waiting until the end of the previous.


```js
PromiseChain = require('PromiseChain.js');

var doSomething = function(scope){
	return new Promise(function(resolve, reject) { setTimeout(function(){
		console.log("I have done something");
	 	resolve(true);
	
	} , 1000);});
}


var askPermision = function(scope){
	return new Promise(function(resolve, reject) { setTimeout(function(){

	 	resolve(true);
	
	} , 1000);});
}

var incrementCounter = function(scope){
	return new Promise(function(resolve, reject) { 	setTimeout(function(){
	 	  	scope.counter++;
	 	  	resolve(scope.counter);
	 	 } , 1000); 	
	 });
}

var scope = {contador :0};

new PromiseChain(sc)
	.continue(doSomething,"fisrtThingDone")
	.continue(doSomething,"secondThingDone")
	.continue(askPermision,"permision")
	.ifElse(function(sc){return sc.permision === true;},function(sc){
		return 'if';
	},function(sc){
		return 'else';
	},'ifelseResult')
	.if(function(sc){return sc.contador == 0},function(sc){
		return 'if';
	},'ifResult')
	.while(function(sc){return sc.contador <= 5;}, function(sc){
		console.log(sc.ifelseResult + " - " + sc.ifResult);
		console.log(sc.contador);
		return new Promise(function(resolve, reject) { 
	 	  		setTimeout(function(){
	 	  			sc.contador++;
	 	  			resolve(sc.contador);
	 	  		} , 1000); 	
	 	  });
		
	},'whileResults')
	
	.continue(function(sc){
		return new Promise(function(resolve, reject) { 
				console.log(sc.whileResults);
				console.log(sc);
	 	  		setTimeout(function(){
	 	  			resolve(sc.contador*3);
	 	  		} , 1000); 	
	 	  });
	})
	.end();

```