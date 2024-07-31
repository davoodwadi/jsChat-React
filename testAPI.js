const apiUrl = 'http://localhost:4000/api/gpt/completions/stream' 
// import { ChatCompletionStream } from 'node_modules/openai/lib/ChatCompletionStream';
const log = console.log
document.addEventListener('DOMContentLoaded', (globalEvent) => {
    log('Hello world')
    const textBox = document.getElementById('output')

    

    const messages = [
        {role:"user", content: 'count to 10'}
    ]
    async function setText(){
        const decoder = new TextDecoder();
        textBox.textContent = ''
        
        for await (const t of getResponse(messages)) {
            log(t)
    }
}
    setText();
    





})
// contact API
export async function getResponse(messages){
    const res = await fetch(apiUrl, {
        method: 'POST',
        body: JSON.stringify({
            messages: messages,
            max_tokens: 100,
        }), 
        headers: { 'Content-Type': 'application/json' },   
    })
    // console.log('chunk')
    // console.log(chunk.body)
    textBox.textContent = ''
    // const decoder = new TextDecoder();
    // for await (const chunk of res.body) {
    //     return decoder.decode(chunk)
        // log('*'.repeat(100))
        // console.log(decoder.decode(chunk));
        // textBox.textContent += decoder.decode(chunk)
        // log('*'.repeat(100))
    // }
        
};