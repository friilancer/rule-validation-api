const http = require('http');

const server = http.createServer((req, res) => {
	const {headers, method, url} = req;
	
	if(method == 'POST' && url == "/validate-rule"){
		let buffer = "";
		req.on('data', chunk =>{
			buffer += chunk.toString();
		}).on('end', () => {
			try{
				const { rule, data } = JSON.parse(buffer);
			if(!rule){
				res.writeHead(400, {'content-type' : 'application/json'});
				res.write(JSON.stringify({
					"message": "rule is required.",
					"status": "error",
					"data": null
				}));
				return res.end();
			}
			if(!data){
				res.writeHead(400, {'content-type' : 'application/json'});
				res.write(JSON.stringify({
					"message": "data is required.",
					"status": "error",
	  				"data": null
				}));
				return res.end();
			}
			if(!rule.field || !rule.condition || !rule.condition_value || !["eq", "neq", "gt", "gte", "contains"].includes(rule.condition)){
				res.writeHead(400, {'content-type' : 'application/json'});
				res.write(JSON.stringify({
					"message": "Invalid JSON payload passed.",
					"status": "error",
	  				"data": null
				}));
				return res.end();			
			}
			if ( typeof rule != 'object' ) {
				res.writeHead(400, {'content-type' : 'application/json'});
				res.write(JSON.stringify({
					"message": "rule should be an object.",
					"status": "error",
	  				"data": null
				}));
				return res.end();
			}

			if(!["object", "array", "string"].includes(typeof data)){
				res.writeHead(400, {'content-type' : 'application/json'});
				res.write(JSON.stringify({
					"message": "data should be a string, object or array.",
					"status": "error",
	  				"data": null
				}));
				return res.end();
			}

			if(!data[rule.field]){
				res.writeHead(400, {'content-type' : 'application/json'});
				res.write(JSON.stringify({
					"message": `field ${rule.field} is missing from data.`,
					"status": "error",
	  				"data": null
				}));
				return res.end();
			}

			switch (rule.condition){
				case 'eq': {
					if(data[rule.field] == rule.condition_value ){
						res.writeHead(200, {'content-type' : 'application/json'});
						res.write(JSON.stringify({
							"message": `field ${rule.field} successfully validated.`,
							"status": "success",
							"data": {
							  "validation": {
							    "error": false,
							    "field_value" : `${data[rule.field]}`,
							    ...rule
							  }
							} 
						}));
						return res.end()
					}else{
						res.writeHead(400, {'content-type' : 'application/json'});
						res.write(JSON.stringify({
							"message": `field ${rule.field} failed validation.`,
							"status": "error",
							"data": {
							  "validation": {
							    "error": true,
							    "field_value" : `${data[rule.field]}`,
							    ...rule
							  }
							} 
						}));
						return res.end()						
					}
				}
				case 'contains': {
					if(data[rule.field].includes(rule.condition_value)){
						res.writeHead(200, {'content-type' : 'application/json'});
						res.write(JSON.stringify({
							"message": `field ${rule.field} successfully validated.`,
							"status": "success",
							"data": {
							  "validation": {
							    "error": false,
							    "field_value" : `${data[rule.field]}`,
							    ...rule
							  }
							} 
						}));
						return res.end()
					}else{
						res.writeHead(400, {'content-type' : 'application/json'});
						res.write(JSON.stringify({
							"message": `field ${rule.field} failed validation.`,
							"status": "error",
							"data": {
							  "validation": {
							    "error": true,
							    "field_value" : `${data[rule.field]}`,
							    ...rule
							  }
							} 
						}));
						return res.end()						
					}					
				}
				case 'neq': {
					if(data[rule.field] != rule.condition_value ){
						res.writeHead(200, {'content-type' : 'application/json'});
						res.write(JSON.stringify({
							"message": `field ${rule.field} successfully validated.`,
							"status": "success",
							"data": {
							  "validation": {
							    "error": false,
							    "field_value" : `${data[rule.field]}`,
							    ...rule
							  }
							} 
						}));
						return res.end()
					}else{
						res.writeHead(400, {'content-type' : 'application/json'});
						res.write(JSON.stringify({
							"message": `field ${rule.field} failed validation.`,
							"status": "error",
							"data": {
							  "validation": {
							    "error": true,
							    "field_value" : `${data[rule.field]}`,
							    ...rule
							  }
							} 
						}));
						return res.end()						
					}
				}
				case 'gt': {
					if(typeof data[rule.field] == 'number' && data[rule.field] > rule.condition_value ){
						res.writeHead(200, {'content-type' : 'application/json'});
						res.write(JSON.stringify({
							"message": `field ${rule.field} successfully validated.`,
							"status": "success",
							"data": {
							  "validation": {
							    "error": false,
							    "field_value" : `${data[rule.field]}`,
							    ...rule
							  }
							} 
						}));
						return res.end()
					}else{
						res.writeHead(400, {'content-type' : 'application/json'});
						res.write(JSON.stringify({
							"message": `field ${rule.field} failed validation.`,
							"status": "error",
							"data": {
							  "validation": {
							    "error": true,
							    "field_value" : `${data[rule.field]}`,
							    ...rule
							  }
							} 
						}));
						return res.end()						
					}
				}
				case 'gte': {
					if(typeof data[rule.field] == 'number' && data[rule.field] >= rule.condition_value ){
						res.writeHead(200, {'content-type' : 'application/json'});
						res.write(JSON.stringify({
							"message": `field ${rule.field} successfully validated.`,
							"status": "success",
							"data": {
							  "validation": {
							    "error": false,
							    "field_value" : `${data[rule.field]}`,
							    ...rule
							  }
							} 
						}));
						return res.end()
					}else{
						res.writeHead(400, {'content-type' : 'application/json'});
						res.write(JSON.stringify({
							"message": `field ${rule.field} failed validation.`,
							"status": "error",
							"data": {
							  "validation": {
							    "error": true,
							    "field_value" : `${data[rule.field]}`,
							    ...rule
							  }
							} 
						}));
						return res.end()						
					}
				}
			}
			}catch(error){
				res.writeHead(400, {'content-type' : 'application/json'});
				res.write(JSON.stringify({
					"message": "Invalid JSON payload passed.",
					"status": "error",
				    "data": null
				}));
				return res.end();
			}
		})

	}else if(method == "GET" && url=="/"){
		res.writeHead(200, {'content-type' : 'application/json'});
		res.write(JSON.stringify({
		  "message": "My Rule-Validation API",
		  "status": "success",
		  "data": {
		    "name": "Aniediabasi Unanaifonke Etukudo",
		    "github": "@friilancer",
		    "email": "aniediabasi.etukudo@gmail.com",
		    "mobile": "07047119370",
		    "twitter": "@anietukudo"
		  }
		}));
		res.end();
	}else{
		res.writeHead(404);
		res.write(JSON.stringify({
			"message": "Invalid request.",
			"status": "error",
			"data": null
		}));
		return res.end();
	}

})

const PORT  = process.env.PORT || 5000;

server.listen(PORT, () => {
	console.log('running');
})