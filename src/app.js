const express=require('express');

const app=express();


//Playing with code:
//all requests(get,post,put,patch,delete) to all the paths are handled in app.use() when no path is passed in use()
//all requests(get,post,put,patch,delete) to a specific path are handled in app.use("the specific path")

//therefore sequence of code matters

//to handle all methods requests separately:
// app.post()
// app.get()
// app.put()
// app.patch()
// app.delete() 


app.listen(7777,()=>{
    console.log("server running successfully on port 7777");
})
// //all the requests will be handled by:
// app.use((req,res)=>{
//     res.send("Hi this is server running on port 7777");
// })
// //following lines of code are of no use
// app.use("/test",(req,res)=>{
//     res.send("you requested to localhost:7777/test.")
// })
// app.use("/getid",(req,res)=>{
//     res.send("you requested to localhost:7777/getid.")
// })
// app.get("/",(req,res)=>{
//     res.send("you sent a get request to localhost:7777")
// })
//changing the sequence of code will change the output.try to play with code


//multiple request handlers for same route

//method1
// app.use(path,requestHandler1,requestHandler2,...,requestHandlerN)
//method2
//app.use(path,requestHanlder1);
//app.use(path,requestHandler2);
// .
// .
// .
// .
//app.use(path,requestHandlerN);


//the first route handler will be executed and response will be - RESPONSE 1
// ⤵
// app.use((req,res)=>{
//     console.log("inside 1st request handler");
//     res.send("RESPONSE 1!!")
// },(req,res)=>{
//     console.log("inside 2nd request handler");
//     res.send("RESPONSE 2!!")
// })

//what if the first route handler doesnt send any response back?
// ⤵
// app.use((req,res)=>{
//     console.log("inside 1st request handler");
// },(req,res)=>{
//     console.log("inside 2nd request handler");
//     res.send("RESPONSE 2!!")
// })
//the control will get into first route handler but since it will not get any response back so 
// 1.postman will hang and we will have to cancel the request ✔
// 2.2nd route handler will be executed and we will get the response as RESPONSE 2!!    ✖

//to send the control to next handler, we get parameter other than req and res i.e. next

// ⤵ working: 1st handler->next()->2nd handler->response(RESPONSE 2!!)
// app.use((req,res,next)=>{
//     console.log("inside 1st request handler");
//     next();
// },(req,res)=>{
//     console.log("inside 2nd request handler");
//     res.send("RESPONSE 2!!")
// })
//what if 2nd route handler doesn't send response
// app.use((req,res,next)=>{
//     console.log("inside 1st request handler");
//     next();
// },(req,res)=>{
//     console.log("inside 2nd request handler");
// })
// ⤴ postman will hang and we will have to manually cancel the request

//what if there is no route handler corresponding to a next
// app.use((req,res,next)=>{
//         console.log("inside 1st request handler");
//         next();
//     },(req,res,next)=>{
//         console.log("inside 2nd request handler");
//         next();
//     })
//the response will be an error on postman -> Cannot GET /

//next() before sending response ⚠ 

app.get("/responseAfterNext",(req,res,next)=>{
    next();
    res.send("Hi this is handler 1 ")
})
app.get("/responseAfterNext",(req,res)=>{
    res.send("hi this is handler 2 for route /responseAfternext")
})
//the repsonse on postman is received but it gives an error in the console because once the response is sent the connection between the server and the client(here,postman) is closed and no more response can be sent.ERROR:-"Cannot set headers after they are sent to the client"


//⤵ matches /ab,/b
app.get("/a?b",(req,res)=>{
    res.send("hi this is a request to '/a?b ");
})
//⤵ matches /ab , /aab ,/aaab ,...
app.get("/a+b",(req,res)=>{
    res.send("hi this is a request to '/a+b ");
})
// ⤵ matches /ab, /aANYTHINGb 
app.get("/a*b",(req,res)=>{
    res.send("hi this is a request to '/a*b ");
})

//receiving user info from url
app.use("/sendData/:userid",(req,res)=>{
    res.send("received what you sent in the url. check the console.")
    console.log("userId= ",req.params.userid);
    console.log("username= ",req.query.username);
    console.log("password= ",req.query.password);

})

//at last- to handle all the random routes
app.use("/",(req,res)=>{
    res.send("To handle all the random routes")
})









