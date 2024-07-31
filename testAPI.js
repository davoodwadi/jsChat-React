const log = console.log
document.addEventListener('DOMContentLoaded', (globalEvent) => {
    log('Hello world')

    const apiUrl = 'http://localhost:4000/api/gpt/completions'
    // contact API
    async function getResponse(text){
        const response = await fetch(apiUrl, {
            method: 'POST',
            body: JSON.stringify('Tell me why dogs are better than cats'),
            headers: { 'Content-Type': 'application/json' },   
        })
        const result = await response.json()
        console.log(result)
    };
    getResponse();





})