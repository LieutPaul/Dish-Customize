import fetch from 'node-fetch';
import express from 'express';
import bodyParser from "body-parser";

//const express = require('express');
//const https=require('https');
//const bodyParser = require('body-parser');
//const { get } = require('http');

const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public")); //Make a folder called public and put styles.css in it
app.set('view engine', 'ejs');

const listofcuisines=["ANY","African","American","British","Cajun","Caribbean","Chinese","Eastern European",
"European","French","German","Greek","Indian","Irish","Italian","Japanese","Jewish","Korean",
"Latin American", "Mediterranean","Mexican","Middle Eastern","Nordic","Southern","Spanish","Thai","Vietnamese"];

const listofdiets=["Ketogenic","Vegan","Vegetarian","Pescetarian"];

const listofintolerances=["Dairy","Egg","Gluten","Grain","Peanut","Seafood","Sesame","Shellfish","Soy","Sulfite","Tree Nut","Wheat"]

const types=["Main Course","Side Dish","Dessert","Appetizer","Salad", "Bread", "Breakfast","Soup","Beverage","Sauce",
"Marinade","Fingerfood","Snack","Drink"]

app.get("/",function(req,res){
    const vars_to_send={"cuisines":listofcuisines,"diets":listofdiets,"intolerances":listofintolerances,"types":types};
    res.render('index',vars_to_send);
 });

app.post("/",function(req,res){
    const body=req.body;
    var apiURL="https://api.spoonacular.com/recipes/complexSearch?apiKey=450c80ac25924fcabe976cb82e1dca53"
    //console.log(body);
    if(body.dish!=''){
        apiURL+="&query="+body.dish;
    }
    var apiCuisines=[],apiDiets=[],apiIntolerances=[],apiTypes=[];
    
    for(var i=0;i<listofcuisines.length;i++){
        if(body.hasOwnProperty(listofcuisines[i])){
            apiCuisines.push(listofcuisines[i]);
        }
    }
    for(var i=0;i<listofdiets.length;i++){
        if(body.hasOwnProperty(listofdiets[i])){
            apiDiets.push(listofdiets[i]);
        }
    }
    for(var i=0;i<listofintolerances.length;i++){
        if(body.hasOwnProperty(listofintolerances[i])){
            apiIntolerances.push(listofintolerances[i]);
        }
    }
    for(var i=0;i<types.length;i++){
        if(body.hasOwnProperty(types[i])){
            apiTypes.push(types[i].toLowerCase());
        }
    }
    
    if(apiCuisines.length!=0){
        apiURL+="&cuisine="+(apiCuisines.join(','));
    }
    if(apiDiets.length!=0){
        apiURL+="&diet="+(apiDiets.join(','));
    }
    if(apiIntolerances.length!=0){
        apiURL+="&intolerances="+(apiIntolerances.join(','));
    }
    if(apiTypes.length!=0){
        apiURL+="&type="+(apiTypes.join(','));
    }
    console.log(apiURL);

    // https.get(apiURL,function(response){
    //     if(response.statusCode==200){
    //         response.on("data",function(data){
    //             var dataObject=JSON.parse(data);
    //         });
    //     }
    // });

    async function getISS(){
        const response=await fetch(apiURL);
        const data=await response.json();
        res.render('index2',{"res":data.results});
    }
    getISS();
    
});

app.listen(3000,function(){
    console.log("Listening on port 3000");
});
