import markdownIt from 'https://cdn.jsdelivr.net/npm/markdown-it@14.1.0/+esm'

const mdWrapped = markdownIt({
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
const md = markdownIt()

let fileText = `
The \`MLPClassifier\` from the \`scikit-learn\` library.
\`\`\`python
import numpy as np
from sklearn.datasets import make_classification

def train_mlp(hidden_layer_sizes=(100,), activation='relu', solver='adam', alpha=0.0001, batch_size='auto', learning_rate='constant', learning_rate_init=0.001, max_iter=200):
    
    # Split the dataset into training and test sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Standardize the features
    scaler = StandardScaler()
    
    # Print the results
    print(f'Accuracy: {accuracy}')
    
    return mlp

# Example usage
trained_mlp = train_mlp()
\`\`\`

1. **Data Generation**: Uses \`make_classification\` to create a synthetic dataset.
2. **Data Splitting**: Splits the data into training and testing sets.

\`\`\`javascript
async function handleDOMContentLoaded() {
    
    const log = console.log
    const textBox1 = document.getElementById('bot-message1');
    const textBox2 = document.getElementById('bot-message2');
    const textBox3 = document.getElementById('bot-message3');
}
\`\`\`


### Explanation:
1. **Data Generation**: Uses \`make_classification\` to create a synthetic dataset.
2. **Data Splitting**: Splits the data into training and testing sets.
3. **Data Standardization**: Standardizes the features to have zero mean and unit variance.
4. **Model Creation**: Creates an instance of \`MLPClassifier\` with specified hyperparameters.
5. **Model Training**: Fits the MLP model to the training data.
6. **Prediction and Evaluation**: Predicts the labels for the test data and evaluates the performance using accuracy and classification report.

You can customize the parameters of the \`MLPClassifier\` to suit your specific needs. The function returns the trained MLP model for further use or evaluation.

`.trim()

async function handleDOMContentLoaded() {
    
    const log = console.log
    const textBox1 = document.getElementById('bot-message1');
    const textBox2 = document.getElementById('bot-message2');
    const textBox3 = document.getElementById('bot-message3');

    //
    const codeBlockRegex = /```(\w+)\n([\s\S]*?)```/g;
    let match;
    const codeBlocks = [];

    while ((match = codeBlockRegex.exec(fileText)) !== null) {
        const language = match[1];
        const codeBlock = match[2];
        codeBlocks.push({ language, codeBlock });
    }
    // console.log(codeBlocks);
    //

    // const htmlWrapped = mdWrapped.render(fileText);
    // textBox2.innerHTML = htmlWrapped
    // log('htmlWrapped')
    // log(htmlWrapped)
    // log('*'.repeat(30))

    const htmlPlain = md.render(fileText);
    // textBox2.innerHTML = htmlPlain
    // log('htmlPlain')
    // log(htmlPlain)
    // log('*'.repeat(30))
    // const htmlHighlight = hljs.highlightAuto(htmlPlain).value
    // const htmlHighlight = hljs.highlightAuto(htmlPlain).value
    const js_text = `
    const textBox1 = document.getElementById('bot-message1');
    const textBox2 = document.getElementById('bot-message2');
    const textBox3 = document.getElementById('bot-message3');

    console.log("Hello world")
    `.trim()
    const htmlH = hljs.highlight(js_text, {language:'javascript'})
    // const domPure = DOMPurify.sanitize(htmlHighlight);
    log('htmlH')
    log(htmlH)
    log('*'.repeat(30))
    const codeContainer = document.createElement('div')
    codeContainer.classList.add('code-container')

    const part1 = document.createElement('div')
    part1.textContent = 'JS'
    const part2 = document.createElement('div')
    part2.classList.add('clipboard')
    part2.textContent = 'copy'
    
    codeContainer.appendChild(part1)
    codeContainer.appendChild(part2)
    
    textBox3.code = js_text
    // textBox3Parent.appendChild(codeContainer)
    log('codeContainer.outerHTML')
    log(codeContainer.outerHTML)
    textBox3.innerHTML = `${codeContainer.outerHTML}<pre><code id="jscode" class="hljs">${htmlH.value}</code></pre>`;
    log('textBox3.textContent')
    log(textBox3.textContent)
    log('textBox3.innerHTML')
    log(textBox3.innerHTML)
    const jsCodeBlock = document.getElementById('jscode')
    // log(jsCodeBlock)

    // document.getElementById('fileInput').addEventListener('change', function(event) {
    //     const file = event.target.files[0]; // Get the selected file
    //     if (file) {
    //         const reader = new FileReader(); // Create a FileReader object

    //         reader.onload = function(e) {
    //             const text = e.target.result; // Get the text from the file

    //             fileText = text; // Display the text in the <pre> element
      
    //             const htmlWrapped = mdWrapped.render(fileText);
    //             textBox1.innerHTML = htmlWrapped
    //             log('htmlWrapped')
    //             log(htmlWrapped)
    //             log('*'.repeat(30))

    //             const htmlPlain = md.render(fileText);
    //             textBox2.innerHTML = htmlPlain
    //             log('htmlPlain')
    //             log(htmlPlain)
    //             log('*'.repeat(30))
    //             // const htmlHighlight = hljs.highlightAuto(htmlPlain).value
    //             const htmlHighlight = hljs.highlightAuto(htmlPlain).value
    //             const domPure = DOMPurify.sanitize(htmlHighlight);
    //             log('domPure')
    //             log(domPure)
    //             log('*'.repeat(30))
    //             textBox3.innerHTML = domPure
              
                
    //         };

    //         reader.onerror = function(e) {
    //             console.error('Error reading file', e);
    //         };

    //         reader.readAsText(file); // Read the file as text
    //     } else {
    //         console.log('No file selected');
    //     }
    // });
    
    
    
};


// Add event listener for DOMContentLoaded and call the async function
document.addEventListener("DOMContentLoaded", handleDOMContentLoaded);