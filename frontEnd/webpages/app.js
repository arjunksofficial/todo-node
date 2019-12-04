"use strict";

// Strict mode

// Variable Hoisting for modals working
var btn, modal, span;

var i, j;

/*
 * Creating a protoype for tasks
 * Variable Hoisting
 */


var assignees = [];

var todoMaxPrio = 0;
var progressMaxPrio = 0;
var doneMaxPrio = 0;

var Task = {
    id: 0,
    name: "This is the task",
    description: "Task is as follows",
    assignee: "user",
    priority: 0,
    status: "todo",
    date: 0,
    // To initialize task
    setTask(id, name, description, assignee, priority, status, date) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.assignee = assignee;
        addassignee(assignee);
        this.priority = priority;
        this.status = status;
        var d = new Date();
        this.date = date || d;
    },
    // To generate HTML div content corresponding to task to view on Webpage
    createHTMLtask() {
        const htmlstring = '<div class="task" draggable="true" id="' + this.id + '" ondragstart="drag(event)" ondrop="drop(event)" ondragover="allowDrop(event)">' +
            '<big><strong>' + this.name + " " + '</strong></big>' +
            this.date.replace('T', ' ').substring(0, 19) +
            '<button id="' + this.id + '" onClick="viewTask(this.id)"' + ' class="view" type="button">&#128065;</button>' +
            this.priorityButton() + '<br><br>' +
            "<p>" + this.minimizeDescription() +
            this.changePhaseButton() +
            '<p>Assignee:  ' + this.assignee + '..........Priority: ' + this.priority + '</p>' +
            '</div><br><br><br><br><br>';

        return htmlstring;
    },
    // To generate a minimized version of description that fits on div of task in webpage.
    minimizeDescription() {
        var shortdescription = "";
        for (var i = 0; i < 28 && this.description[i] !== '\n'; i++) {
            shortdescription += this.description.charAt(i);
        }
        shortdescription += "...";

        return shortdescription;
    },
    // To create a changePhase button in case needs a button to change the phase
    changePhaseButton() {
        if (this.status === "todo" || this.status === "progress") {
            var htmlstring = '<button id="' + this.id + '" onClick="moveTask(this.id)" class="mov" type="button">Move&rarr;</button><br></p>';

            return htmlstring;
        }

        return "";
    },
    // To check whether to give increment decrement buttons to the div of task (To avoid giving these buttons for done phase)
    priorityButton() {
        var htmlstring = "";
        if (this.status === "todo" || this.status === "progress") {
            htmlstring = htmlstring + '<button id="' + this.id + '" onClick="incrementPriority(this.id)" class="incr" type="button"><big><strong>+</strong></big></button>' +
                '<button id="' + this.id + '" onClick="decrementPriority(this.id)" class="decr" type="button"><big><strong>-</strong></big></button>';
        }

        return htmlstring;
    },
    // To create HTML part for viewTask Modal
    createViewModal() {
        const htmlstring = '<div class="modal-content">' +
            '<div class="modal-header">' +
            '    <span id="closeview" class="closeview">&times;</span>' +
            '   <h2>' + this.name + '</h2>' +
            '</div>' +
            '<div class="modal-body">' +
            '   <h2>Description</h2>' +
            '   <p>' + this.description + '</p>' +
            '   <h2>Current Status : ' + this.status + '</h2>' +
            '   <h2>Assigned to ' + this.assignee + '</h2>' +
            '   <h2>Priority : ' + this.priority + '</h2>' +
            '   <h2>Created on : ' + this.date + '</h2>' +
            '</div>' +
            '</div>';

        return htmlstring;
    }
};


/*
 * For storing Task objects
 * Arrays , Hoisting
 */
var array = [];

/*
 * To initialize 3 phases with preloaded tasks on startup
 * Function Hoisting
 */
function initializeTodo(callback) {

    var resobj = [];
    var req = new XMLHttpRequest();
    req.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            resobj = JSON.parse(this.responseText);

            for (i = 0; i < resobj.length; i++) {
                // Pure prototypal inheritance
                array[i] = Object.create(Task);
                array[i].setTask(resobj[i].id, resobj[i].name, resobj[i].description, resobj[i].assignee, resobj[i].priority, resobj[i].status, resobj[i].date);

            }

            for (i = 0; i < array.length; i++) {
                // Pure prototypal inheritance
                if (array[i].status === "todo") {
                    if (array[i].priority > todoMaxPrio) {
                        todoMaxPrio = array[i].priority;
                    }
                } else if (array[i].status === "progress") {
                    if (array[i].priority > progressMaxPrio) {
                        progressMaxPrio = array[i].priority;
                    }
                } else if (array[i].status === "done") {
                    if (array[i].priority > doneMaxPrio) {
                        doneMaxPrio = array[i].priority;
                    }
                }
            }
            callback();
        }
    };
    // Req.setRequestHeader('Content-Type', 'application/blahblah');
    req.open("GET", "http://localhost:9000/task", true);
    req.setRequestHeader("Authorization", localStorage.getItem("key"));
    req.send();
}


/*
 * To increment priority of a task over the next one above
 * Function Hoisting
 */
function incrementPriority(taskid) {
    var task = {};
    task = array[taskid - 1];
    var oldp = task.priority;
    var oldstatus = task.status;

    if (task.priority === 1 && numberOfPrioStatus(task.status, 1) === 1) {
        alert("Already maximum priority");
    } else if (task.priority === 1) {
        for (i = 0; i < array.length; i++) {
            if (array[i].status === array[taskid - 1].status && i !== taskid - 1) {
                if (array[i].priority >= oldp) {
                    array[i].priority = array[i].priority + 1;

                }
            }
        }
        incrementmaxPrio(task.status);
    } else {
        array[taskid - 1].priority = oldp - 1;
        if (numberOfPrioStatus(oldstatus, oldp) >= 1) {
            var notchange;
            for (i = 0; i < array.length; i++) {
                if (array[i].status === array[taskid - 1].status && array[i].priority === oldp - 1 && i !== taskid - 1) {
                    array[i].priority = oldp;
                    notchange = i;
                    break;
                }
            }
            for (i = 0; i < array.length; i++) {
                if (array[i].status === array[taskid - 1].status && i !== notchange && i !== taskid - 1) {
                    if (array[i].priority >= oldp) {
                        array[i].priority = array[i].priority + 1;

                    }
                }
            }
            incrementmaxPrio(task.status);
        } else {
            for (i = 0; i < array.length; i++) {
                if (array[i].status === array[taskid - 1].status && array[i].priority === oldp - 1 && i !== taskid - 1) {
                    array[i].priority = oldp;
                }
            }
        }
    }
    patchUpdatePrio(function () {
        initializePage();
    });
}


/*
 *No decrement if already lowest priority && number of task with same priority is = 1
 *Decrement value of priority of task with task id if maxPrio and more than one task exist with same prio
 */


/*
 * To decrement priority of a task over the next one below
 * Function Hoisting
 */
function decrementPriority(taskid) {
    var task = {};
    task = array[taskid - 1];
    var oldp = task.priority;
    var oldstatus = task.status;
    var maxPriorityOfStatus = maxPrio(taskid);

    if (oldp === maxPriorityOfStatus && numberOfPrioStatus(oldstatus, oldp) === 1) {
        alert("Already lowest priority and only one task exist");
    } else if (oldp === maxPriorityOfStatus && numberOfPrioStatus(oldstatus, oldp) > 1) {
        array[taskid - 1].priority = array[taskid - 1].priority + 1;
        incrementmaxPrio(oldstatus);
    } else {
        array[taskid - 1].priority = oldp + 1;
        if (numberOfPrioStatus(oldstatus, oldp) >= 1) {
            var notchange;
            for (i = 0; i < array.length; i++) {
                if (array[i].status === oldstatus && array[i].priority === oldp && i !== taskid - 1) {
                    array[i].priority = oldp;
                    notchange = i;
                    break;
                }
            }
            for (i = 0; i < array.length; i++) {
                if (array[i].status === oldstatus && i !== notchange && i !== taskid - 1) {
                    if (array[i].priority >= oldp) {
                        array[i].priority = array[i].priority + 1;

                    }
                }
            }
            incrementmaxPrio(task.status);
        } else {
            for (i = 0; i < array.length; i++) {
                if (array[i].status === array[taskid - 1].status && array[i].priority === oldp + 1 && i !== taskid - 1) {
                    array[i].priority = oldp;
                }
            }
        }
    }
    patchUpdatePrio(function () {
        initializePage();
    });
}

/*
 * To make changes on screen after changing priority s=using buttons based on priority
 * Function Hoisting
 */
function updatePageWithPrio() {
    var todo = "";
    var progress = "";
    var done = "";

    for (i = 1; i <= todoMaxPrio; i++) {
        for (j = 0; j < array.length; j++) {
            if (array[j].status === "todo" && array[j].priority === i) {
                todo += array[j].createHTMLtask();
            }
        }
    }
    for (i = 1; i <= progressMaxPrio; i++) {
        for (j = 0; j < array.length; j++) {
            if (array[j].status === "progress" && array[j].priority === i) {
                progress += array[j].createHTMLtask();
            }
        }
    }
    for (i = doneMaxPrio; i >= 1; i--) {
        for (j = array.length - 1; j >= 0; j--) {
            if (array[j].status === "done" && array[j].priority === i) {
                done += array[j].createHTMLtask();
            }
        }
    }
    document.getElementById("progressmain").innerHTML = '<h2>IN PROGRESS</h2>' +
        '<div id= "progress" class="todo" ondrop="drop(event)" ondragover="allowDrop(event)" >' +
        '</div>';
    document.getElementById("donemain").innerHTML = '<h2>DONE</h2>' +
        '<div id= "done" class="todo" ondrop="drop(event)" ondragover="allowDrop(event)" >' +
        '</div>';
    document.getElementById("todo").innerHTML = todo;
    document.getElementById("progress").innerHTML = progress;
    document.getElementById("done").innerHTML = done;
    createTaskModal();
}

/*
 * To get the maximum priority value existing in each phase or the task's status
 * Function Hoisting
 */
function maxPrio(taskid) {
    var taskstatus = "";
    taskstatus = array[taskid - 1].status;
    if (taskstatus === "todo") {
        return todoMaxPrio;
    } else if (taskstatus === "progress") {
        return progressMaxPrio;
    } else if (taskstatus === "done") {
        return doneMaxPrio;
    }
}

/*
 * To get the number of tasks with same priority in a specific phase with specific priority
 * Function Hoisting
 */
function numberOfPrioStatus(status, prio) {
    var number = 0;
    for (var i = 0; i < array.length; i++) {
        if (array[i].status === status && array[i].priority === prio) {
            number += 1;
        }
    }

    return number;
}

/*
 * To icrement maximum Priority values of each phase whenver required
 * Function Hoisting
 */
function incrementmaxPrio(taskstatus) {
    if (taskstatus === "todo") {
        todoMaxPrio++;
    } else if (taskstatus === "progress") {
        progressMaxPrio++;
    } else if (taskstatus === "done") {
        doneMaxPrio++;
    }
}

/*
 * To create a new task from popup form
 * Function Hoisting
 */

function createNewTask() {
    document.getElementById("namecheck").innerHTML = "";
    document.getElementById("descriptioncheck").innerHTML = "";
    document.getElementById("assigneecheck").innerHTML = "";
    document.getElementById("prioritycheck").innerHTML = "";

    var lastPos = array.length;
    var name = document.forms.popupform.name.value;
    var description = document.forms.popupform.description.value;
    var assignee = document.forms.popupform.assignee.value;
    var priority = Number(document.forms.popupform.priority.value);
    var date = new Date().toISOString().
        slice(0, 19).
        replace('T', ' ');
    if (name !== "") {
        if (description !== "") {
            if (assignee !== "") {
                if (priority >= 1 && typeof priority === 'number') {
                    array[lastPos] = Object.create(Task);
                    array[lastPos].setTask(lastPos + 1, name, description, assignee, priority, "todo", date);

                    postTask(array[lastPos], function () {
                        initializePage();
                    });


                    if (priority > todoMaxPrio) {
                        todoMaxPrio = priority;
                    }
                    updatePageWithPrio();
                    document.getElementById("modalcreation").innerHTML = "Creation Success";
                    setTimeout(function () {
                        document.getElementById("modalcreation").innerHTML = "";
                        document.forms.popupform.name.value = "";
                        document.forms.popupform.description.value = "";
                        document.forms.popupform.assignee.value = "";
                        document.forms.popupform.priority.value = 0;
                        document.getElementById('myModal').style.display = "none";
                    }, 1000);
                } else {
                    document.getElementById("prioritycheck").innerHTML = "Please enter a valid priority greater than zero";
                }
            } else {
                document.getElementById("assigneecheck").innerHTML = "Please enter a valid assignee";
            }
        } else {
            document.getElementById("descriptioncheck").innerHTML = "Please enter a valid description";
        }
    } else {
        document.getElementById("namecheck").innerHTML = "Please enter a valid name";
    }
}

/*
 * To move a task to next Phase
 * Function Hoisting
 */

function moveTask(taskid) {
    var postobj = array[taskid - 1];

    patchmoveTask(postobj, function () {
        initializePage();
    });

}


function createTaskModal() {
    autocomplete(document.getElementById("assignee"), assignees);
    // Get the modal
    modal = document.getElementById('myModal');

    // Get the button that opens the modal
    btn = document.getElementById("myBtn");

    // Get the <span> element that closes the modal
    span = document.getElementsByClassName("close")[0];
    // Modals functions

    // When the user clicks the button, open the modal
    btn.onclick = function () {
        modal.style.display = "block";
    };

    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
        modal.style.display = "none";
    };


}

function viewTask(taskid) {
    var viewmodal = document.getElementById('viewTaskModal');
    viewmodal.innerHTML = array[taskid - 1].createViewModal();


    // Get the <span> element that closes the modal
    var viewspan = document.getElementById("closeview");

    // When the user clicks on <span> (x), close the modal
    viewspan.onclick = function () {
        viewmodal.style.display = "none";
    };
    viewmodal.style.display = "block";
}

function viewTaskModal() {
    // Get the modal
    var viewmodal = document.getElementById('viewTaskModal');
    var modal = document.getElementById('myModal');

    // Get the <span> element that closes the modal
    var viewspan = document.getElementsByClassName("closeview");

    // When the user clicks on <span> (x), close the modal
    viewspan.onclick = function () {
        viewmodal.style.display = "none";
    };

    // When the user clicks anywhere outside of the modal, and the create Task modal close it
    window.onclick = function (event) {
        if (event.target == viewmodal) {
            viewmodal.style.display = "none";
        } else if (event.target == modal) {
            modal.style.display = "none";
        }
    };
}


function initializePage() {
    if (localStorage.getItem("key")) {
        todoMaxPrio = 0;
        progressMaxPrio = 0;
        doneMaxPrio = 0;
        initializeTodo(function () {
            updatePageWithPrio();
            createTaskModal();
            viewTaskModal();
            autocomplete(document.getElementById("assignee"), assignees);
        });
    } else {
        window.open("http://localhost:8000/webpagessecure/notLogged.html","_self");
    }

}

function addassignee(assignee) {
    var flag = 0;
    for (var i = 0; i < assignees.length; i++) {
        if (assignee === assignees[i]) {
            flag = 1;
            break;
        }
    }
    if (flag === 0) {
        assignees[assignees.length] = assignee;
    }
}

function postTask(taskobj, callback) {
    var postobj = {};
    postobj.name = taskobj.name;
    postobj.description = taskobj.description;
    postobj.priority = taskobj.priority;
    postobj.assignee = taskobj.assignee;
    var data = JSON.stringify(postobj);

    var req = new XMLHttpRequest();
    req.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 201) {
            callback();
        }
    };

    req.open("POST", "http://localhost:9000/task", true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.setRequestHeader("Authorization", localStorage.getItem("key"));
    req.send(data);
}

function patchmoveTask(taskobj, callback) {
    var patchobj = {};
    patchobj.id = taskobj.id;
    patchobj.name = taskobj.name;
    patchobj.description = taskobj.description;
    patchobj.priority = taskobj.priority;
    patchobj.assignee = taskobj.assignee;
    if (taskobj.status === "todo") {
        patchobj.status = "progress";
    } else if (taskobj.status === "progress") {
        patchobj.status = "done";
    }
    var data = JSON.stringify(patchobj);
    var req = new XMLHttpRequest();
    req.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 201) {
            callback();
        }
    };

    req.open("PATCH", "http://localhost:9000/task", true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.setRequestHeader("Authorization", localStorage.getItem("key"));
    req.send(data);
}


function patchUpdatePrio(callback) {

    for (i = 0; i < array.length; i++) {

        var patchobj = {};
        patchobj.id = array[i].id;
        patchobj.name = array[i].name;
        patchobj.description = array[i].description;
        patchobj.priority = array[i].priority;
        patchobj.assignee = array[i].assignee;
        patchobj.status = array[i].status;

        var data = JSON.stringify(patchobj);

        var req = new XMLHttpRequest();
        req.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 201) {
                callback();
            }
        };

        req.open("PATCH", "http://localhost:9000/task", true);
        req.setRequestHeader('Content-Type', 'application/json');
        req.setRequestHeader("Authorization", localStorage.getItem("key"));
        req.send(data);
    }


}