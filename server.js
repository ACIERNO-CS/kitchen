import express from 'express';
import logger from 'morgan';
import * as path from 'path';
import { database } from './database.js';
//import { readFile, writeFile } from 'fs/promises';



const port = 3000;
const JSONfile = "client.js";
const route = path.resolve(path.dirname("client"), "client", "index.html");

const app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/client', express.static('client'));

//page
app.post('/client/saveUser', async (req, res) => {
    try {
        if (await database.saveUser(req.query.username, req.query.password)) {
            res.status(200);
            res.send({"status": "success"});
        } else {
            res.status(200);
            res.send({"status": "preexists"});
        }
    } catch (err) {
        console.log(err);
    }
});

app.post('/client/saveRecipe', async (req, res) => {
    try {
        if (await database.saveRecipe(req.query.username, req.query.recipe)) {
            res.status(200);
            res.send({"status": "success"});
        } else {
            res.status(200);
            res.send({"status": "preexists"});
        }
    } catch (err) {
        console.log(err);
    }
});

app.post('/client/deleteRecipe', async (req, res) => {
    try {
        if (await database.deleteRecipe(req.query.username, req.query.recipe)) {
            res.status(200);
            res.send({"status": "success"});
        } else {
            res.status(200);
            res.send({"status": "preexists"});
        }
    } catch (err) {
        console.log(err);
    }
});

app.get('/client/getUser', async (req, res) => {
    try {
        res.send(await database.getUser(req.query.username));
        res.status(200);
    } catch (err) {
        console.log(err);
    }
});

app.get('/client/getPalette', async (req, res) => {
    try {
        res.send(await database.getPalette(req.query.username));
        res.status(200);
    } catch (err) {
        console.log(err);
    }
});

app.post('/client/deleteUser', async (req, res) => {
    try {
        if (await database.deleteUser(req.query.username)) {
            res.status(200);
            res.send({"status": "success"});
        } else {
            res.status(200);
            res.send({"status": "failure"});
        }
    } catch (err) {
        console.log(err);
    }
});

app.get('/client/login', async (req, res) => {
    try {
        if (await database.login(req.query.username, req.query.password)) {
            res.status(200);
            res.send({"status": "success"});
        } else {
            res.status(200);
            res.send({"status": "failure"});
        }
    } catch (err) {
        console.log(err);
    }
});

app.post('/client/login', async (req, res) => {
    try {
        await database.saveUser(req.query.username, req.query.password);
        res.status(200);
        res.send({"status": "success"});
    } catch (err) {
        console.log(err);
    }
});

app.post('/client/changePalette', async (req, res) => {
    try {
        await database.changePalette(req.query.username, req.query.palette);
        res.status(200);
        res.send({"status": "success"});
    } catch (err) {
        console.log(err);
    }
});


//recipe
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '94190be96emshda107d33f12dc1dp12a340jsn580d6407f83a',
		'X-RapidAPI-Host': 'tasty.p.rapidapi.com'
	}
};

app.get('/client/recipes', async (req, res) => {
    try {
        console.log("searching for " + req.query.term + " recipes...");/*
        await fetch(`https://tasty.p.rapidapi.com/recipes/auto-complete?prefix=${req.query.term}`, options)
                                .then((response) => response.json()).then(async (results) => {
                                    //have to hardcap requests because limited to 500 pulls per month
                                    const length = Math.min(results.results.length, 10);
                                    var recipes = [];
                                    for(let i = 0; i < length; i++) {
                                        console.log(results.results[i % length + 1]);
                                        recipes.push(await fetch(`https://tasty.p.rapidapi.com/recipes/auto-complete?prefix=${results.results[i % length + 1].display}`, options)
                                                            .then((response) => response.json())
                                                            .then(results => results.results)
                                                            .catch((err) => console.log(err)));
                                    }
                                    
                                    res.status(200);
                                    res.send({"status": "success", "terms": results.results, "recipes": recipes});
                                })
                                .catch((err) => console.log(err));*/
        await fetch(`https://tasty.p.rapidapi.com/recipes/list?q=${req.query.term}`, options)
                                                            .then((response) => response.json())
                                                            .then((recipes) => {
                                                                res.status(200);
                                                                res.send({"status": "success", "recipes": recipes});
                                                            })
                                                            .catch((err) => console.log(err));
    } catch (err) {
        console.log(err);
        res.status(200);
        res.send({"status": "failure"});
    }
    
});

app.get('/favicon.ico', (req, res) => res.status(204));
app.get('*', async (request, response) => {
    response.sendFile(route);
});

app.listen(port, () => console.log("server running..."));