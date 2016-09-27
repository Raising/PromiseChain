PromiseChain = function (scope,functionPropietary){
		var me = this;
		me.functionPropietary = functionPropietary || false;
		me.scope = scope || {} ;	

		me.currentLink = new Promise(function(resolve, reject) { 
			resolve(me.scope);
		});

		me.bindToPropietary = function(fun){
			if (me.functionPropietary){
				return fun.bind(me.functionPropietary);
			}
			return fun;
		};

		me.execute = function(fun,resultName,nextLinkResolve){
			Promise.resolve(fun(me.scope)).then(function(result){
				me.scope[resultName] = result;
				nextLinkResolve(result);
			}).catch(console.log.bind(console));
		};

		me.continue = function(fun,resultName){
			resultName = resultName || '[[lastResult]]';
			fun = me.bindToPropietary(fun);
			
			var nextLinkResolve = null;
			var nextLink = new Promise(function(resolve, reject) { 	nextLinkResolve = resolve;	});

			me.currentLink.then(function (){
				me.execute(fun,resultName,nextLinkResolve); 
			}).catch(console.log.bind(console)); 

			me.currentLink = nextLink;
			return me;
		};

		me.ifElse = function(condition,iffun,elsefun,resultName){
			resultName = resultName || '[[lastResult]]';
			condition = me.bindToPropietary(condition);
			iffun = me.bindToPropietary(iffun);
			elsefun = me.bindToPropietary(elsefun);

			var nextLinkResolve = null;
			var nextLink = new Promise(function(resolve, reject) { 	nextLinkResolve = resolve; });

			me.currentLink.then(function (){
				if (condition(me.scope) === true){
					me.execute(iffun,resultName,nextLinkResolve); 
				}else{
					me.execute(elsefun,resultName,nextLinkResolve); 
				}
			}).catch(console.log.bind(console)); 

			me.currentLink = nextLink;
			return me;

		};

		me.if = function(condition,fun,resultName){
			return me.ifElse(condition,fun,function(){},resultName);
		};
		me.while = function(condition,fun,resultName){
			resultName = resultName || '[[lastResult]]';
			fun = me.bindToPropietary(fun);
			condition = me.bindToPropietary(condition);

			var nextLinkResolve = null;
			var nextLink = new Promise(function(resolve, reject) { 	nextLinkResolve = resolve;	});

			me.currentLink.then(function (){
				me.scope[resultName] = [];
				me.continueWhile(condition,fun,resultName,nextLinkResolve);	
			}).catch(console.log.bind(console)); 

			me.currentLink = nextLink;
			return me;
		};

		me.continueWhile = function(condition,fun,resultName,nextLinkResolve){
			if (condition(me.scope) === true){
		 		Promise.resolve(fun(me.scope)).then(function(result){
					me.scope[resultName].push(result);
					me.continueWhile(condition,fun,resultName,nextLinkResolve);	 
				}).catch(console.log.bind(console));
			}else{
				nextLinkResolve(me.scope[resultName]);
			}	
		 };


		me.continueAll = function(diffTerms,fun,resultName){
			resultName = resultName || '[[lastResult]]';
			fun = me.bindToPropietary(fun);
			
			var nextLinkResolve = null;
			var nextLink = new Promise(function(resolve, reject) { nextLinkResolve = resolve;	});
			var tempArray = [];
	
			if (!Array.isArray(diffTerms)){for (var term in diffTerms){tempArray.push(term);}diffTerms = tempArray;}
			

            me.currentLink.then(function (){
            	var promises = [];
	            for (var i = 0; i < diffTerms.length; i++) {
	            	promises.push(Promise.resolve(fun(me.scope,diffTerms[i])));
	            }
	            Promise.all(promises).then(function(result){
	            	var hashedResult = {};
	            	for (var i = 0; i < diffTerms.length; i++) {
	            		hashedResult[diffTerms[i]] = result[i];
	            	}
					me.scope[resultName] = hashedResult;
					nextLinkResolve(hashedResult);
				}).catch(console.log.bind(console)); 
			}).catch(console.log.bind(console)); 

			me.currentLink = nextLink;
			return me;
		};

		me.end = function(){

			return me.currentLink;
		};
	};