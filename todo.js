function removeEntry(id) {
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
                <div class="p-2 flex-grow-1 bd-highlight list-item-text">
                    ${candidate.value}
                </div>
                <div class="p-2 bd-highlight edit-btn" onclick="editEntry(this.parentElement.id)">
                    <span class="badge">Edit</span>
                </div>
                <div class="p-2 bd-highlight delete-btn" onclick="removeEntry(this.parentElement.id)">
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
    var inputTemplate = document.createElement('template');
    var inputHtml = 
        `<div class="p-2 flex-grow-1 bd-highlight list-item-input">
            <input type="text" class="form-control" placeholder="Feed the doggie..." value=${textDiv.innerHTML}>
        </div>`.trim();
    inputTemplate.innerHTML = inputHtml;
    var inputDiv = inputTemplate.content.firstChild;

    // create the Save button
    // This button isn't hooked up! But because we're listening for "focusout" events,
    // clicking the button will trigger that action
    var saveBtnTemplate = document.createElement('template');
    var saveBtnHtml = 
        `<div class="p-2 bd-highlight save-btn">
            <span class="badge">Save</span>
        </div>`;
    saveBtnTemplate.innerHTML = saveBtnHtml;
    var saveBtn = saveBtnTemplate.content.firstChild;

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

var todoList = document.querySelector('#todo-list');
todoList.addEventListener(
    'focusout',
    function(e) {
        if (!e.target) {
            return;
        }

        if (e.target.nodeName === "INPUT") {
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

