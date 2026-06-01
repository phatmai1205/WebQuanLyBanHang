const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const posVars = `let posCart = [];
let posSelectedCustomer = null; 
let posViewMode = 'grid'; 
let posSearchTerm = '';
let posSelectedCategories = [];
`;

if (html.includes(posVars)) {
    html = html.replace(posVars, '');
    html = html.replace('/* 1. MOCK DATA && INITIALIZATION */', '/* 1. MOCK DATA && INITIALIZATION */\\n' + posVars);
    fs.writeFileSync('index.html', html);
    console.log('Fixed TDZ issue');
} else {
    console.log('Could not find posVars string to remove. Continuing.');
}
