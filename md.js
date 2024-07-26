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

function putInCodeContainer(highlightedCode, rawCode, language){
  // message bot
    // div: text markdown
    // code-container; highlighted code
  const codeContainer = document.createElement('div');
  codeContainer.classList.add('code-container');

  const header = document.createElement('div');
  header.classList.add('header');

  const part1 = document.createElement('div');
  part1.innerHTML = `${language}`;
  

  // const part2 = document.createElement('div');
  // part2.classList.add('clipboard', 'non-editable');
  // part2.innerHTML = '<i class="fa-duotone fa-solid fa-copy"></i> Copy code';
  const part2 = document.createElement('button');
  part2.classList.add('clipboard');
  part2.innerHTML = '<i class="fa-duotone fa-solid fa-copy"></i> Copy code';

  header.appendChild(part1);
  header.appendChild(part2);

  const codeBlock = document.createElement('pre');
  
  codeBlock.innerHTML = `<code class="hljs">${highlightedCode}</code>`;

  codeContainer.appendChild(header);
  codeContainer.appendChild(codeBlock);
  
  // Add the copy functionality
  part2.addEventListener('click', () => {
    navigator.clipboard.writeText(rawCode).then(() => {
      console.log('Text copied to clipboard');
    }).catch(err => {
      console.error('Could not copy text: ', err);
    });
  });
  return codeContainer
};

function parseTextBlocks(text) {
  const blocks = [];
  const regex = /```(\w+)?\n([\s\S]*?)```|([\s\S]+?)(?=```|$)/g;
  let match;

  while ((match = regex.exec(text)) !== null) {
      if (match[1]) {
          // Code block
          blocks.push({
              language: match[1],
              text: match[2].trim()
          });
      } else {
          // Text block
          blocks.push({
              language: null,
              text: match[3].trim()
          });
      }
  }
  return blocks;
};

export function mdToHTML(fileText, botMessage){
  // to prevent uncaught errors
  if (!botMessage){
    return
  }
  let blocks = parseTextBlocks(fileText)
  let cleans = blocks.map(block => block.language ? putInCodeContainer(hljs.highlight(block.text, {language:block.language}).value, block.text, block.language) : md.render(block.text))    
  
  for (const el of cleans){
    if (typeof el === 'string'){
      let tempDiv = document.createElement('div')
      tempDiv.innerHTML = el.trim()
      botMessage.appendChild(tempDiv)
    } else {
      botMessage.appendChild(el)
    }
  }
};



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

// async function handleDOMContentLoaded() {

//     const log = console.log
//     const textBox1 = document.getElementById('bot-message1');
//     const textBox2 = document.getElementById('bot-message2');
//     const textBox3 = document.getElementById('bot-message3');
//     mdToHTML(fileText, textBox1)
//     mdToHTML(fileText, textBox2)
    
//     const htmlPlain = md.render(fileText);
//     // textBox2.innerHTML = htmlPlain
//     const js_text = `
//     const textBox1 = document.getElementById('bot-message1');
//     const textBox2 = document.getElementById('bot-message2');
//     const textBox3 = document.getElementById('bot-message3');

//     console.log("Hello world")
//     `.trim()
//     const htmlH = hljs.highlight(js_text, {language:'javascript'})
//     // const domPure = DOMPurify.sanitize(htmlHighlight);
//     log('htmlH')
//     log(htmlH)
//     log('*'.repeat(30))
//     const codeContainer = putInCodeContainer(htmlH.value, js_text, 'javascript')
//     textBox3.appendChild(codeContainer)

// };


// // Add event listener for DOMContentLoaded and call the async function
// document.addEventListener("DOMContentLoaded", handleDOMContentLoaded);