import { createClient } from 'redis';

const client = createClient({
    url: 'redis://127.0.0.1:6379' 
});

client.on('error', err => console.log('Redis Client Error', err));

await client.connect();

console.log(`connected to db: ${client.isReady}`)


const htmlContent = await client.get('message')

// client.json.set(json name, $.... name of key exists or not, value for key); 
// pass a dict to overwrite; pass a value to change
// client.json.get(json name, {path: $.key}) returns a list even if there's one dict inside; path: is mandatory




async function saveMessages(username, html){
    const userExists = await client.exists(username)
    // if exists: 1 else 0; 
    const now = new Date();
    console.log(userExists==1)
    if (userExists===0){ // new user
        console.log('new user: ', username)
        // set counter
        let resp = await client.json.set(username, '$', {counter: 1})

        resp = await client.json.set(username, '$.1', { // set content at the counter
            'time': now,
            'saveContainer': html}
        )
    } else { // old user
        console.log('old user: ', username)
        // get counter
        const counter = await client.json.get(username, {
            path: '$.counter'
        })
        
        const counterNext = counter[0] + 1;
        
        let resp = await client.json.set(username, '$.'+counterNext, { // set content at the counter
            'time': now,
            'saveContainer': html}
        )
        
        // increment the counter
        resp = await client.json.numIncrBy(username, '$.counter', 1);
        console.log('***saved successfully***')
        return resp
    }
}

async function loadLatestMessages(username){
    // return undefined if user not exists
    const counter = await client.json.get(username, {path: '$.counter'})
    if (!counter){
        console.log('undefined counter')
        return undefined
    } else{
        const path = '$.{counter}.saveContainer'.replace('{counter}', counter[0])
        const html = await client.json.get(username, {'path': path})
        console.log('***loaded successfully***')
        return html[0]
    }
}

let username = 'davoodwadi'

// saveMessages(username, htmlContent);
const resp = await saveMessages(username, '1000');
console.log('saved', resp)
let messages = await loadLatestMessages(username)
console.log(messages)
