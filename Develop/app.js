const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const Employee = require("./lib/Employee");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const util = require("util");

const OUTPUT_DIR = path.resolve(__dirname, "output")
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

const employee = []
const employeeQuestions = [
    {
        type: "input",
        message: "Name of individual?",
        name: "name"
    },
    {
        type: "input",
        message: "ID of individual?",
        name: "id"
    },
    {
        type: "input",
        message: "Email of individual?",
        name: "email"
    },
]

function askForRole() {
    console.log('-----------------')
    console.log('Add a new employee.');
    console.log('-----------------')
    inquirer
    .prompt(
        {
            message: "What is the employee role?",
            type: "list",
            choices: ["Engineer", "Intern"],
            name: "role",
        }
    )
    .then(response => {
        if (response.role === "Engineer"){
            engineerRole();
        }
        else if (response.role === "Intern"){
            internRole();
        }
    }) 
}


function promptManager() {
    console.log('-----------------')
    console.log('Greeting Manager');
    console.log('-----------------')
    inquirer
     .prompt([
         ...employeeQuestions,
       {
           type: "input",
           message: "What is the office number (ex: 0001234567)",
           name: "officeNumber"
       },
   ])
    .then( ({name, id, email, officeNumber}) => {
        employee.push(new Manager(name, id, email, officeNumber));
        askForRole();         
    })
}

function engineerRole() {
    console.log('-----------------')
    console.log('Add a new engineer.');
    console.log('-----------------')
    inquirer
     .prompt([
         ...employeeQuestions,
       {
           type: "input",
           message: "Github username of engineer?",
           name: "github"
       },
   ])
    .then(({name, id, email, github}) => {
        const engineer = new Engineer(name, id, email, github) 
        employee.push(engineer);
        askToContinue();
    })
}

function internRole() {
    console.log('-----------------')
    console.log('Add a new intern.');
    console.log('-----------------')
    inquirer
     .prompt([
         ...employeeQuestions,
       {
           type: "input",
           message: "School of intern?",
           name: "school"
       },
   ])
   .then( ({name, id, email, school}) => {
       const intern = new Intern(name, id, email, school)
       employee.push(intern)
       askToContinue();
   })
}

function askToContinue() {
    inquirer
        .prompt({
            message: "Do you want to add another team member?",
            name: "addNew",
            type: "list",
            choices: ["Yes", "No"]
        })
        .then( ({ addNew}) => {
            if (addNew === "Yes") {
                askForRole();
            }
            else if (addNew === "No") {
                console.log(employee)
                createHTMLFile();
            }
        })
    }


function createHTMLFile(){
    const html = render(employee);

    if ( !fs.existsSync(OUTPUT_DIR) ) {
        fs.mkdirSync(OUTPUT_DIR)
    }

    fs.writeFile(outputPath, html, (err) => {
        if (err) {
            console.log(err)
        }
        else {
            console.log("HTML created.")
        }
    })
}

promptManager();