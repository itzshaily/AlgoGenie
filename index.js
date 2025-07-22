const express = require('express');
const app = express();
const main = require('./aichat');

app.use(express.json());
// json to object

const chattingHistory = {};
// Store chat history in memory(here we are using an object, but you can use a database for persistence)
// store in key-value pair, where key is the user id and value is an array of messages

app.post('/chat',async(req,res) =>{

    const{id,msg} = req.body;

    if(!chattingHistory[id]){
        chattingHistory[id] = [];
    }
    
    const history = chattingHistory[id];

    const promtmsg = [...history,
         {role: 'user',
         parts:[{text: msg}]}
    ];

    const ans = await main(promtmsg);
    
    history.push({role:'user',parts:[{text:msg}]});
    history.push({role:'model',parts:[{text:ans}]})

    res.send(ans);

    if (!msg) {
        return res.status(400).json({error: 'Message is required'});
    }
})

app.listen(3000 , () => {
    console.log('Server is running on port 3000');
})