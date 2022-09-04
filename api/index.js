const express = require('express');
const bodyParser = require("body-parser");
const cors = require('cors');
const api = express.Router();

const db = require(`./store-db`);

api.use(cors());
api.use(express.json());


//API Get request
api.get('/api/:name', bodyParser.text(), async(request, response) => {
    try{
        let db = await ds.exportDatastore(request.params.name) //Check the database for a specific name
        if(db.length == 0){//if the database is empty respond with a 0
            response.send('0') 
    
        }else{// else give the name and the number
            response.send(db[0].val)
             
        }
    }catch(err){ //else send an error
        response.sendStatus(400)
    }
    
});

//API POST request
api.post('/api/:name', bodyParser.text(), async(request, response) => {
    try{
        let db = await ds.exportDatastore(request.params.name)//Check the database for a specific name

        
        if (!isNaN(parseFloat(request.body))){ //Check if the exported number is a number else send an error
            let number = parseFloat(request.body)
            if(db.length == 0){ //Check if the databse is empty
                await ds.put({
                    name: request.params.name,
                    val: JSON.stringify(number)
                })
                response.send(JSON.stringify(number)) 
                
            }else{//If the database is not empty then delete the last one and send the new one
                let data = {
                    name: request.params.name,
                    val: JSON.stringify(JSON.parse(db[0].val) + number)
                }
                await ds.delete(request.params.name)
                await ds.put(data)
                response.send(data.val)
            }
        }else{//else send an error
            response.sendStatus(400)
        }
    }catch(err){//else send an error
        response.sendStatus(400)
    }
    
});

//API PUT request
api.put('/api/:name', bodyParser.text(), async(request, response) => {//Send data to be save in the database
    try{
        if (!isNaN(parseFloat(request.body))){ //Check if the exported number is a number else send an error
                    let number = parseFloat(request.body)
                    let data = {
                        name: request.params.name,
                        val: JSON.stringify(number)
                    }
                    await ds.put(data)
                    response.send(data.val)
                }else{//else send an error
                    response.sendStatus(400)
                }
    }catch(err){
        response.sendStatus(400)
    }
});

//API DELETE request
api.delete('/api/:name', async(request, response) => {//delete data if exist
    try{
        let db = await ds.exportDatastore(request.params.name) //Check the database for a specific name

        if(db.length == 0){
            response.sendStatus(204)
        }else{
            await ds.delete(request.params.name)
            response.sendStatus(204)
        }
    }catch(err){
        response.sendStatus(400)
    }
});