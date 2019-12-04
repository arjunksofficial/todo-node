
function autocomplete(inp,assignees){ /* The autocomplete function takes two arguments,
    the text field element and an assignees possible autocompleted values:*/
    var currentFocus;

    /* Execute a function when someone writes in the text field:*/
    inp.addEventListener("input",function(e) {
        var a,b,i,
            val = this.value;

        /* Close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) {
            return false;
        }
        currentFocus = -1;

        /* Create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id",this.id + "autocomplete-list");
        a.setAttribute("class","autocomplete-items");

        /* Append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);

        /* For each item in the assignees.*/
        for (i = 0; i < assignees.length; i++) {

            /* Check if the item starts with the same letters as the text field value:*/
            if (assignees[i].substr(0,val.length).toUpperCase() == val.toUpperCase()) {

                /* Create a DIV element for each matching element:*/
                b = document.createElement("DIV");

                /* Make the matching letters bold:*/
                b.innerHTML = "<strong>" + assignees[i].substr(0,val.length) + "</strong>";
                b.innerHTML += assignees[i].substr(val.length);

                /* Insert a input field that will hold the current assigneesay item's value:*/
                b.innerHTML += "<input type='hidden' value='" + assignees[i] + "'>";

                /* Execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click",function(e) {

                    /* Insert the value for the autocomplete text field:*/
                    inp.value = this.getElementsByTagName("input")[0].value;

                    /*
                     * Close the list of autocompleted values,
                     * (or any other open lists of autocompleted values:
                     */
                    closeAllLists();
                });
                a.appendChild(b);
            }
        }
    });

    /* Execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown",function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) {
            x = x.getElementsByTagName("div");
        }
        if (e.keyCode == 40) {

            /*
             * If the assigneesow DOWN key is pressed,
             * increase the currentFocus variable:
             */
            currentFocus++;

            /* And and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 38) { // Up
            /*
             * If the assigneesow UP key is pressed,
             * decrease the currentFocus variable:
             */
            currentFocus--;

            /* And and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 13) {

            /* If the ENTER key is pressed, prevent the form from being submitted,*/
            e.preventDefault();
            if (currentFocus > -1) {

                /* And simulate a click on the "active" item:*/
                if (x) {
                    x[currentFocus].click();
                }
            }
        }
    });
    function addActive(x) {

        /* A function to classify an item as "active":*/
        if (!x) {
            return false;
        }

        /* Start by removing the "active" class on all items:*/
        removeActive(x);
        if (currentFocus >= x.length) {
            currentFocus = 0;
        }
        if (currentFocus < 0) {
            currentFocus = x.length - 1;
        }

        /* Add class "autocomplete-active":*/
        x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {

        /* A function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }
    function closeAllLists(elmnt) {

        /*
         * Close all autocomplete lists in the document,
         * except the one passed as an argument:
         */
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }

    /* Execute a function when someone clicks in the document:*/
    document.addEventListener("click",function (e) {
        closeAllLists(e.target);
    });
}

/* An assigneesntaining all the country names in the world:*/