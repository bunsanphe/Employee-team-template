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

// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

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
    // {
    //     type: "input",
    //     message: "Enter your office number.",
    //     when: function(answers){
    //         return (answers.role === "manager")
    //     },
    //     name: "officeNumber",
    // },
]

function askForRole() {
    console.log('-----------------')
    console.log('Add a new employee');
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
           message: "What is the office number?",
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
    console.log('Add a new engineer');
    console.log('-----------------')
    inquirer
     .prompt([
         ...employeeQuestions,
       {
           type: "input",
           message: "what is your github username?",
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
    console.log('Add a new intern');
    console.log('-----------------')
    inquirer
     .prompt([
         ...employeeQuestions,
       {
           type: "input",
           message: "what school do you attend?",
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


// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an 
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work!```