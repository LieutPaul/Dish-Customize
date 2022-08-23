import fetch from 'node-fetch';
import express from 'express';
import bodyParser from "body-parser";
const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public")); //styles.css is in /public
app.set('view engine', 'ejs');

//The four arrays below are for rendering the checkbox content in index.ejs
const listofcuisines=["ANY","African","American","British","Cajun","Caribbean","Chinese","Eastern European",
"European","French","German","Greek","Indian","Irish","Italian","Japanese","Jewish","Korean",
"Latin American", "Mediterranean","Mexican","Middle Eastern","Nordic","Southern","Spanish","Thai","Vietnamese"];

const listofdiets=["Ketogenic","Vegan","Vegetarian","Pescetarian"];

const listofintolerances=["Dairy","Egg","Gluten","Grain","Peanut","Seafood","Sesame","Shellfish","Soy","Sulfite","Tree Nut","Wheat"]

const types=["Main Course","Side Dish","Dessert","Appetizer","Salad", "Bread", "Breakfast","Soup","Beverage","Sauce",
"Marinade","Fingerfood","Snack","Drink"]

app.get("/",function(req,res){
    const vars_to_send={"cuisines":listofcuisines,"diets":listofdiets,"intolerances":listofintolerances,"types":types};
    res.render('index',vars_to_send); //index.ejs is the first page that should open
 });

app.post("/",function(req,res){
    const body=req.body;
    var apiURL="https://api.spoonacular.com/recipes/complexSearch?apiKey=450c80ac25924fcabe976cb82e1dca53"

    if(body.dish!=''){ //checking if a dish name was entered
        apiURL+="&query="+body.dish;
    }
    var apiCuisines=[],apiDiets=[],apiIntolerances=[],apiTypes=[]; //arrays that store the fields that were entered
    
    for(var i=0;i<listofcuisines.length;i++){ //iterating through all cuisines and checking one by one
        if(body.hasOwnProperty(listofcuisines[i])){ //checking if that field was checked
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
    //adding the fields to the apiURL
    if(apiCuisines.length!=0){
        apiURL+="&cuisine="+(apiCuisines.join(',')); //the api format wanted commas in between multiple fields
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
    async function getISS(){ //Function to fetch (GET) the data from spoonacular using their API
        const response=await fetch(apiURL);
        const data=await response.json();
        res.render('index2',{"res":data.results}); // index2.ejs is the page that contains the list of dishes
    }
    getISS();
    
});

app.listen(process.env.PORT || 3000,function(){
    console.log("Listening on port 3000");
});
