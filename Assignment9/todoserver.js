const express = require('express');
const app = express();
const fs = require('fs');   


app.use(express.json());//middleware to parse json data from request body to req.body object 
app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/public/todo.html');
});
app.post('/todo',(req,res)=>{
   
    saveTaskInFile(req.body,function(err){
        if(err){
            res.status(500).send("Error");
            return;
        }
      
            res.status(200).send("Success");

    });  
});
app.get('/onRefreshSavedTodoData',(req,res)=>{
   
    readDataFromFile(function(err,data){
        if(err){
            res.status(500).send("Error");
            return;
        }
        console.log(data);
        res.status(200).json(data);
    });
})
app.delete('/todoDelete/:id',(req,res)=>{
    let id=req.params.id;
    readDataFromFile(function(err,data){
        if(err){
            res.status(500).send("Error");
            return;
        }
        const updatedTodos = data.filter((todo) => todo.id !== id);
        fs.writeFile('task.txt',JSON.stringify(updatedTodos),function(err){
            if(err){
                res.status(500).send("Error");
                return;
            }
          
        })
        res.status(200).json(updatedTodos);
    }
    )

})
app.patch('/updateTaskCompletion/:id',(req,res)=>{

    let id=req.params.id;
    console.log(req.body,id);
    readDataFromFile(function(err,data){
        if(err){
            res.status(500).send("Error");
            return;
        }
        console.log(data);
        let updatedTodos = data.map((todo) => {
            if (todo.id === id) {
              todo.completed = req.body.completed;
            }
            return todo;
          });
        fs.writeFile('task.txt',JSON.stringify(updatedTodos),function(err){
            if(err){
                res.status(500).send("Error");
                return;
            }
          
        })
        res.status(200).send("Success");
    }
    )
});
app.post('/todoDelete',(req,res)=>{
    let task=parseInt(req.body.todoDeleteTaskValue);//convert string to number
    console.log("delete");
    console.log(req.body);
    readDataFromFile(function(err,data){
        if(err){
            res.status(500).send("Error");
            return;
        }
    //    for(let i=0;i<task;i++){
    //     data.shift();//remove first element
    //    }
    data.splice(task-1,1);
       console.log(data);
        fs.writeFile('task.txt',JSON.stringify(data),function(err){
            if(err){
                console.log("hey error");
                res.status(500).send("Error");
                return;
            }
            console.log("hey success");
            
        })
    

        res.status(200).json(data);
    });
})

app.get('/todo.js',(req,res)=>{
    res.sendFile(__dirname+'/public/script/todo.js');
})

app.listen(
    50001,()=>{
        console.log('Server started at port 50001');
    }
)
function readDataFromFile(callback){
    fs.readFile('task.txt',(err,data)=>{
        if(err){
           callback(err);
        }
       
            if(data.length==0){
                data="[]"
            }
            try{
                data=JSON.parse(data);// convert string to object
                callback(null,data);
            }
            catch(err){
                callback(err);
            }
    });

}


function saveTaskInFile(todoData,callback){
    let fileData=readDataFromFile(function(err,data){
        if(err){
            callback(err);
        }
        data.push(todoData);
        fs.writeFile('task.txt',JSON.stringify(data),function(err){
            if(err){
                callback(err);
                return;
            }
            callback(null);
        })
    });
}


