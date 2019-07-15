var todoList = document.querySelector('#todo-list');

function deleteEntry(id) {
    console.log("removing list entry", id);
    var li = document.getElementById(id);
    if (li) {
        li.remove();
        //todo.removeEntry(candidate.value);
    }
};

function addEntry() {
    var ul = document.getElementById("todo-list");
    var candidate = document.getElementById("candidate");
    
    if (candidate.value) {
        var li = 
            `<li id=${candidate.value} class="list-group-item list-group-item-action d-flex align-items-center bd-highlight">
                <div class="form-check">
                    <input class="form-check-input list-item-check" type="checkbox" onclick="toggleCheck(this)">
                    <label class="form-check-label" for="defaultCheck1"></label>
                </div>
                <div class="p-2 flex-grow-1 bd-highlight list-item-text">
                    ${candidate.value}
                </div>
                <div class="p-2 bd-highlight edit-btn" onclick="editEntry(this.parentElement.id)">
                    <span class="badge">Edit</span>
                </div>
                <div class="p-2 bd-highlight delete-btn" onclick="deleteEntry(this.parentElement.id)">
                    <span class="badge">Delete</span>
                </div>
            </li>`;
        ul.insertAdjacentHTML('beforeend', li);

        // clear out the input box after adding
        candidate.value = "";
    }
}

function editEntry(id) {
    var li = document.getElementById(id);

    // hide the DELETE button while we're editing
    var deleteBtn = li.getElementsByClassName('delete-btn')[0];
    deleteBtn.style.display = 'none';

    // create a new Input div with value set to the list item text
    var textDiv = li.getElementsByClassName('list-item-text')[0];
    var inputDiv = createElementFromHtml(
        `<div class="p-2 flex-grow-1 bd-highlight list-item-input">
            <input type="text" class="form-control" placeholder="Feed the doggie..." value=${textDiv.innerHTML}>
        </div>`
    );

    // create the Save button
    // This button isn't hooked up! But because we're listening for "focusout" events,
    // clicking the button will trigger that action
    var saveBtn = createElementFromHtml(
        `<div class="p-2 bd-highlight save-btn">
            <span class="badge">Save</span>
        </div>`
    );

    // replace the Edit with Save
    var editBtn = li.getElementsByClassName('edit-btn')[0];
    li.replaceChild(saveBtn, editBtn);

    li.replaceChild(inputDiv, textDiv);
    inputDiv.getElementsByTagName('input')[0].focus();
}

function createElementFromHtml(html) {
    var template = document.createElement('template');
    var html = html.trim();
    template.innerHTML = html;
    return template.content.firstChild;
}

function disableSelected() {
    var collection = todoList.getElementsByTagName('li');

    for (var li of collection) {
        if (li) {
            li.classList.add("disabled");

            // add a strikethrough to the text
            var text = li.getElementsByClassName('list-item-text')[0];
            text.style.setProperty("text-decoration", "line-through");
        }
    }

    toggleListItems(/*shouldSelect*/ false);
}

function deleteSelected() {
    // TODO: might run into trouble if we have other LI elements in the DOM
    var collection = document.querySelectorAll('li');

    // DOESN'T WORK BECAUSE THIS IS A "LIVE" LIST
    //var collection = todoList.getElementsByTagName('li');

    for (var li of collection) {
        if (li && li.classList.contains("active")) {
            deleteEntry(li.id);
        }
    }
}

function toggleListItems(shouldSelect) {
    var collection = todoList.getElementsByTagName('li');

    for (var li of collection) {
        if (li) {
            var checkbox = li.getElementsByClassName('list-item-check')[0];
            if (shouldSelect) {
                li.classList.add("active");
                checkbox.checked = true;
            } else {
                li.classList.remove("active");
                checkbox.checked = false;
            }
        }
    }
}


/**
 * Highlight the List Item when the checkbox is toggled
 * by adding/removing the "active" class
 *
 * @param e <input>
 */
function toggleCheck(e) {
    console.log(e);
    if (e) {
        var li = e.parentElement.parentElement;
        if (e.checked) {
            li.classList.add("active");
        } else {
            li.classList.remove("active");
        }
    }
}

/**
 * When you select a checkbox for one of the tasks,
 * we want to mark the 'Delete Selected' and 'complete Selected' buttons as active
 */
todoList.addEventListener(
    // better here to onclick? oncheck?
    'change',
    function (e) {
        if (!e.target) {
            return;
        }

        if (e.target.nodeName === "INPUT" && e.target.type === "checkbox") {
            var bulkActions = document.getElementById('bulk-container');
            console.log(e.target);

            var deselectBtn = bulkActions.getElementsByClassName('bulk-delete-selected')[0];
            var markCompleteBtn = bulkActions.getElementsByClassName('bulk-mark-complete')[0];

            // if all checkboxes are not checked, then add disabled back
            deselectBtn.classList.remove("disabled");
            markCompleteBtn.classList.remove("disabled");
        }
    }
);
 
todoList.addEventListener(
    'focusout',
    function (e) {
        if (!e.target) {
            return;
        }

        if (e.target.nodeName === "INPUT" && e.target.type !== "checkbox") {
            //console.log("running focusout actions on input");
            //console.log(e);

            var input = e.target;
            var itemInput = input.parentElement;
            var li = itemInput.parentElement;

            // create a new List Item Text using Item Input value
            var itemText = createElementFromHtml(
                `<div class="p-2 flex-grow-1 bd-highlight list-item-text">
                    ${input.value}
                </div>`
            );
            li.replaceChild(itemText, itemInput);

            // change Save button back to Edit button
            var saveBtn = li.getElementsByClassName("save-btn")[0];
            var editBtn = createElementFromHtml(
                `<div class="p-2 bd-highlight edit-btn" onclick="editEntry(this.parentElement.id)">
                    <span class="badge">Edit</span>
                </div>`
            );
            li.replaceChild(editBtn, saveBtn);

            // show the Delete button again
            var deleteBtn = li.getElementsByClassName('delete-btn')[0];
            deleteBtn.style.display = '';
        }
    }
);

/*
todo object API

todo.addEntry('hello');
todo.addEntry('whatup');
todo.removeEntry('hello');
todo.dumpEntries();
todo.editEntry('whatup', 'whatup bro');
todo.dumpEntries();
*/
var todo = {

    // entries is an ordered array of objects
    // that contain a field, completed status
    entries: [],

    addEntry(str) {
        // first let's get
        this.entries.push(str);

        //var entry = {
            //text: str,
            //completed: false
        //};
        //this.entries.push(entry);
    },

    editEntry(old_str, new_str) {
        var idx = this.entries.indexOf(old_str);
        this.entries[idx] = new_str;
    },

    dumpEntries() {
        console.log(this.entries);
    },

    // removes by index
    removeEntry(str) {
        var idx = this.entries.indexOf(str);
        if (idx !== -1) {
            this.entries.splice(idx, 1);
        }
    }
};

