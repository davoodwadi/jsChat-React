import markdownIt from 'https://cdn.jsdelivr.net/npm/markdown-it@14.1.0/+esm'
import { getResponseServer } from "./apiModule.js";
import { mdToHTML } from './md.js';

const apiUrlGPT = 'https://jschatapi.onrender.com/api/gpt/completions/stream' 
// const apiUrlGPT = 'http://localhost:4000/api/gpt/completions/stream' 
const decoder = new TextDecoder();
let bot_default_message = `To load a CSV file using Python, you can use the \`pandas\` library, which is a powerful tool for data manipulation and analysis. Here's a basic example:

\`\`\`python
import pandas as pd

# Load the CSV file
df = pd.read_csv('your_file.csv')

# Display the first few rows of the DataFrame
print(df.head())
\`\`\`

In this code:
- \`pandas\` is imported and abbreviated as \`pd\`.
- The \`pd.read_csv()\` function is used to read the CSV file. You need to replace \`'your_file.csv'\` with the actual path to your CSV file.
- \`df.head()\` shows the first five rows of the DataFrame by default.

Make sure you have the \`pandas\` library installed. You can install it using pip if you haven't already:

\`\`\`bash
pip install pandas
\`\`\`

Let me know if you need help with anything else!`
const systemTemplate = `<|start_header_id|>system<|end_header_id|>\n{text}<|eot_id|>\n\n`;
// const systemMessage = `You are a helpful assistant. You respond to my questions with brief, to the point, and useful responses. My questions are in triple backtics`;
const systemMessage = ""
const systemPrompt = systemTemplate.replace('{text}', systemMessage);
const userTemplateWithTicks = `<|start_header_id|>user<|end_header_id|>\n\`\`\`{text}\`\`\`<|eot_id|>\n\n`;
const userTemplateNoTicks = `<|start_header_id|>user<|end_header_id|>\n{text}<|eot_id|>\n\n`;
const assistantTag = `<|start_header_id|>assistant<|end_header_id|>\n`
const assistantEOT = `<|eot_id|>\n\n`
const assistantPrompt = `${assistantTag}{text}${assistantEOT}`
const log = console.log

const md = markdownIt({
    highlight: function (str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return '<pre><code class="hljs">' +
                 hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
                 '</code></pre>';
        } catch (__) {}
      }
  
      return '<pre><code class="hljs">' + md.utils.escapeHtml(str) + '</code></pre>';
    }
  });

let saveContainer = ''

let singedIn = false
let saveButton
let loadButton
let loginButton
let signupButton
const username = 'davoodwadi'

const chatBox = document.getElementById('chat-box')
if (singedIn) {
    const buttonBox = document.createElement('div')
    buttonBox.classList.add('button-box')
    const saveButton = document.createElement('button')
    saveButton.id = 'save'
    saveButton.textContent = 'Save'
    const loadButton = document.createElement('button')
    loadButton.id = 'load'
    loadButton.textContent = 'Load'
    buttonBox.appendChild(loadButton)
    buttonBox.appendChild(saveButton)
    
    chatBox.appendChild(buttonBox)

    const greetings = document.createElement('div')
    const greetingP = document.createElement('p')
    greetingP.textContent = `Welcome, ${username}.`
    greetingP.id = 'greeting'
    greetings.appendChild(greetingP)
    chatBox.prepend(greetings)
} else {
    // <div class="button-box" id="authenticate">
    //             <button id="login">Login</button> 
    //             <button id="signup">Signup</button> 
    //         </div>
    const buttonBox = document.createElement('div')
    buttonBox.classList.add('button-box')

    loginButton = document.createElement('button')
    signupButton = document.createElement('button')
    loginButton.id = 'login'
    signupButton.id = 'signup'
    loginButton.textContent = 'Login'
    signupButton.textContent = 'Signup'

    buttonBox.appendChild(loginButton)
    buttonBox.appendChild(signupButton)
    
    chatBox.prepend(buttonBox)

}

async function handleDOMContentLoaded() {


    const gpt = true;
    const max_tokens = 2000;
    // test different prompts:
    const systemMessageFull = `You are a helpful assistant. You respond to my questions with brief, to the point, and useful responses.`;
    
    const dots = createDots();

    let messageElements = document.getElementsByClassName('message')
    
    let idCounter = 0;
    

    // branch-container logic:
    // branch
    //  user
    //  bot
    //  branch-container
    //      branch
    //          user
    //          bot        
    // event listener for first-message  
    for (const messageElement of messageElements){
        if (messageElement.classList.contains('user')){
            messageElement.role = 'user'
            const old = messageElement.textContent==='' ?  'no' : 'yes'
            messageElement.setAttribute('old', old)
            // log(messageElement.old)
            messageElement.addEventListener('keydown', handleKeydown);
        } else {
            messageElement.role = 'bot'
        }
        log(messageElement.role)

    }
    //
    // save the intial layout
    // saveDOM();
    
    if (saveButton){
        saveButton.onclick = saveDOM
    }
    if (loadButton){
        loadButton.onclick = loadDOMnew
    }
    

    async function saveDOM(){
        const allMessages = document.getElementById('messages')
        
        saveContainer = allMessages.innerHTML
        log('*'.repeat(50))
        log('saved snapshot')
        const response = await saveAsJSON(saveContainer);
        log('*'.repeat(50))
    }
    async function saveAsJSON(container){
        const saveBody = {
            'username': 'davoodwadi',
            'saveContainer': container
        }
        try {
            // Making the POST request
            const response = await fetch('http://127.0.0.1:4000/api/redis/save', {
            method: 'POST', // HTTP method
            headers: {
                'Content-Type': 'application/json', // Indicates the body format
            },
            body: JSON.stringify(saveBody), // Converting the JavaScript object to a JSON string
            });

            // Check if the response was successful
            if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
            }
            // Parse the JSON response
            const data = await response.json();
            console.log(data)
            // console.log('Response data:', data); // Handling the response data
        } catch (error) {
            // Handling any errors
            console.error('There was a problem with the fetch operation:', error);
        }
        };

    // const loadButton = document.getElementById('load')
    
    async function loadDOMnew() {
        const loadBody = {'username': username}
        try {
            // Making the POST request
            const response = await fetch('http://127.0.0.1:4000/api/redis/load', {
            method: 'POST', // HTTP method
            headers: {
                'Content-Type': 'application/json', // Indicates the body format
            },
            body: JSON.stringify(loadBody), // Converting the JavaScript object to a JSON string
            });
            // Check if the response was successful
            if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
            }
            // Parse the JSON response
            const data = await response.json();
            console.log(data)
            const html = data['saveContainer']
            if (!html){
                console.log(`No entry found for ${username}`)
            } else {
                log('*'.repeat(50))
                console.log(`loading ${username}...`);
                const allMessages = document.getElementById('messages');
                allMessages.innerHTML = html; // Load saved content
                console.log('loaded snapshot');
                log(allMessages.innerHTML)
                log('*'.repeat(50))
                // Reattach event listeners
                const messageElements = allMessages.getElementsByClassName('user');
                for (const messageElement of messageElements) {
                    // Clear any existing listeners (if using removeEventListener)
                    messageElement.removeEventListener('keydown', handleKeydown); // Clear previous listeners
                    // Reattach the listener
                    messageElement.addEventListener('keydown', handleKeydown);
                }


            }
            
            // console.log('Response data:', data); // Handling the response data
        } catch (error) {
            // Handling any errors
            console.error('There was a problem with the fetch operation:', error);
        }
    }
    // new load
    async function loadDOM() {
        if (!saveContainer) {
            console.warn('No saved container found. Please save first.');
            return; // Exit if nothing is saved to avoid issues
        }
        log('*'.repeat(50))
        console.log('loading');
        const allMessages = document.getElementById('messages');
        allMessages.innerHTML = saveContainer; // Load saved content
        console.log('loaded snapshot');
        log(allMessages.innerHTML)
        log('*'.repeat(50))
    
        // Reattach event listeners
        const messageElements = allMessages.getElementsByClassName('user');
        for (const messageElement of messageElements) {
            // Clear any existing listeners (if using removeEventListener)
            messageElement.removeEventListener('keydown', handleKeydown); // Clear previous listeners
            // Reattach the listener
            messageElement.addEventListener('keydown', handleKeydown);
        }
    }
    
    // Function to handle keydown events
    function handleKeydown(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault(); // Prevent the default behavior of adding a new line
            logEvent(event); // Assuming this function exists to log events
            log('event.target.textContent')
            log(event.target.textContent)
            event.target.setAttribute('oldContent', event.target.textContent); // Store old content
            event.target.blur(); // Lose focus
        }
    }

    async function logEvent(event){
        let target = event.target
        let branch = target.parentElement
        let branchContainer = branch.parentElement
        let elementToFocus
        let messageElement
        
        // const oldContent = target.oldContent
        const oldContent = target.getAttribute('oldContent')
        log('oldContent')
        log(oldContent)

        if ((target.getAttribute('old')==='yes') && target.role==='user'){//old and user
            log('old message')
            // add new branch
            branch = document.createElement('div')
            branch.classList.add('branch')
            branchContainer.appendChild(branch)
            // add modified target
            messageElement = await createMessageElement('user');
            messageElement.textContent = target.textContent;
            // messageElement.oldContent = messageElement.textContent
            messageElement.setAttribute('oldContent', messageElement.textContent) 
            messageElement.setAttribute('old', 'yes')
            // messageElement.triggeredBefore = true;
            branch.appendChild(messageElement);
            // set element to focus to
            elementToFocus = messageElement;
            elementToFocus.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'center'})
            // set the old content
            target.textContent = oldContent


            // add dots
            branch.appendChild(dots)

            // get llm messages
            const elementArray = createElementArray(messageElement)
            
            if (gpt){
                let messages = createMessageChainGPT(elementArray)
                // console.log(JSON.stringify(messages))
                messageElement = await createMessageElement('bot', messages, branch);
                
            } else {
                let messages = createMessageChain(elementArray)
                messages += assistantTag
                // console.log(messages)
    
                // add bot and empty user 
                messageElement = await createMessageElement('bot', messages);
                branch.replaceChild(messageElement, dots)
            }
            
            
            // create branch-container within branch.        
            let newBranchContainer = document.createElement('div');
            newBranchContainer.classList.add('branch-container');
            branch.appendChild(newBranchContainer);
            // create branch within newcontainer
            let newBranch = document.createElement('div');
            newBranch.classList.add('branch');
            newBranchContainer.appendChild(newBranch)

            messageElement = await createMessageElement('user');
            messageElement.setAttribute('old', 'no')
            newBranch.appendChild(messageElement);

            
        } else if ( target.role==='user') { // latest and user
            log('new message')
            
            // add branch
            // branch = document.createElement('div')
            // branch.classList.add('branch')
            // branchContainer.appendChild(branch)
            //
            // branch.appendChild(target)
            // add dots to the branch
            branch.appendChild(dots)
            
            // get llm messages
            const elementArray = createElementArray(target)
            
            if (gpt){
                let messages = createMessageChainGPT(elementArray)
                // console.log(JSON.stringify(messages))
                messageElement = await createMessageElement('bot', messages, branch);
                
            } else {
                let messages = createMessageChain(elementArray)
                messages += assistantTag
                // console.log(messages)
    
                // add bot message and followup user message
                messageElement = await createMessageElement('bot');
                branch.replaceChild(messageElement, dots)
            }
            
            // set element to focus to
            elementToFocus = messageElement;


            // create branch-container within branch.        
            let newBranchContainer = document.createElement('div');
            newBranchContainer.classList.add('branch-container');
            branch.appendChild(newBranchContainer);
            // create branch within newcontainer
            let newBranch = document.createElement('div');
            newBranch.classList.add('branch');
            newBranchContainer.appendChild(newBranch)

            messageElement = await createMessageElement('user');
            messageElement.setAttribute('old', 'no')
            newBranch.appendChild(messageElement);

        }
        // target.triggeredBefore = true
        target.setAttribute('old', 'yes')
        
        if(elementToFocus.role==='bot'){
            elementToFocus.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'center'})
        } else {
            elementToFocus.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'center'})
        }
    
    };

    
    function getBranchContainer(el){
        for (let child of el.children){
            if (child.classList.contains('branch-container')){
                return child
            }
        }
        return false
    }

    async function createMessageElement(role, pretext, branch){
        let messageElement = document.createElement('div');
        if (role==='bot'){
            messageElement.classList.add('editable', 'message', role);
            messageElement.contentEditable = true;
            // messageElement.textContent = pretext + '\n\n' + (await getDummyMessage())
            if (gpt){
                // let textDecoded = '' 
                // console.log(`await fetch(apiUrlGPT`)
                // const res = await fetch(apiUrlGPT, {
                //     method: 'POST',
                //     body: JSON.stringify({
                //         messages: pretext,
                //         max_tokens: max_tokens,
                //     }), 
                //     headers: { 'Content-Type': 'application/json' },   
                // })

                
                // if (!res.ok) {
                //     console.error('API call failed with status:', res.status);
                //     return; // Handle the error accordingly
                // }

                
                
                
                
                messageElement.textContent = ''
                
                messageElement.oldOutput = undefined
                messageElement.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'center'})
                messageElement.text = ''
                
                console.log('got stream response => reading it chunk by chunk.')
                
                
                try {
                    
                    const textDecoded  = await getDummyMessage()
                    mdToHTML(textDecoded, messageElement);
                    branch.replaceChild(messageElement, dots)
                    // const reader = res.body.getReader();
                    // let result;
                    // while (!(result = await reader.read()).done) {
                        
                    //     // replace dots
                    //     if (branch.contains(dots)){
                    //         branch.replaceChild(messageElement, dots)
                    //     } 
                    //     const chunk = result.value; // This is a Uint8Array   
                    //     const textDecoded = new TextDecoder("utf-8").decode(chunk); // Decode chunk to text
                    //     messageElement.text = messageElement.text + textDecoded;

                    //     mdToHTML(messageElement.text, messageElement);
                    //     messageElement.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'center'})
                    // }
                    // reader.releaseLock();
                }
                catch (error) {
                    console.error('Error reading stream:', error)
                }

            } else {
                const llmResponse = await getResponseServer(pretext)
                log(llmResponse)
                mdToHTML(llmResponse, messageElement);
            }
            
            // parse llmResponse from md to html 
            // const html = md.render(llmResponse);
            // const cleanHTML = DOMPurify.sanitize(html);
            // log(cleanHTML)
            // //
            // messageElement.innerHTML = cleanHTML


        } else {
            messageElement.classList.add('editable', 'message', role);
            messageElement.contentEditable = true;
            messageElement.setAttribute('data-placeholder', 'New message')
            // event listener
            messageElement.addEventListener('keydown', handleKeydown);
            //
        }
        messageElement.role = role;
        messageElement.name = `${messageElement.role}-${idCounter}`
        messageElement.counter = idCounter;
        idCounter++
        
        return messageElement
    }


    async function getDummyMessage() {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(bot_default_message);
            }, 1000); // 0.5 second delay
        });
    }

    function createDots(){
        const dots = document.createElement('div');
        dots.classList.add('message', 'bot', 'dots-message');
        const dotsContainer = document.createElement('div');
        dotsContainer.classList.add('dots-container');
        
        const singleDot1 = document.createElement('div')
        singleDot1.classList.add('dot')
        const singleDot2 = document.createElement('div')
        singleDot2.classList.add('dot')
        const singleDot3 = document.createElement('div')
        singleDot3.classList.add('dot')
        
        //connect them together
        dots.appendChild(dotsContainer)
        dotsContainer.appendChild(singleDot1)
        dotsContainer.appendChild(singleDot2)
        dotsContainer.appendChild(singleDot3)    
        return dots
    };
    
    

    function addMessageElementToArrayReverse(el, messageElementArray){
        for (let i = el.children.length - 1; i >= 0; i--) {
            const child = el.children[i];
            if (child.classList.contains('message') && (!child.classList.contains('dots-message'))){
                messageElementArray.push(child)
            }
            
    }};

    function createElementArray(lastElement){
        let messageElementArray = []
        let element = lastElement;
        while (element.id!=="chat-container"){
            
            addMessageElementToArrayReverse(element, messageElementArray);
            element = element.parentElement;
        }
        messageElementArray = messageElementArray.reverse()
        // each element from top to bottom
        
        return messageElementArray
    }
    
    

    // create message from chain elements 
    function createMessageChainGPT(messageElementArray){
        // let chainMessages = systemPrompt
        let chainMessages = [{
            role:'system', content:systemMessageFull
        }]
        for (let el of messageElementArray){
            if (el.classList.contains('user')){
                chainMessages.push({
                    role : 'user', 
                    content : el.textContent
                })
                
            } else {
                chainMessages.push({
                    role : 'assistant',
                    content : el.textContent
                })
            
        }}
        return chainMessages
    }
    function createMessageChain(messageElementArray){
        // let chainMessages = systemPrompt
        let chainMessages = ''
        for (let el of messageElementArray){
            if (el.classList.contains('user')){
                
                chainMessages += userTemplateNoTicks.replace('{text}', el.textContent);
            } else {
                
                chainMessages += assistantPrompt.replace('{text}', el.textContent);
        }}
        return chainMessages
    }

    
    
    
};

// Add event listener for DOMContentLoaded and call the async function
document.addEventListener("DOMContentLoaded", handleDOMContentLoaded);