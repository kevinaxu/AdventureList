function addEntry() {
    var ul = document.getElementById("todo-list");
    var candidate = document.getElementById("candidate");

    // TODO: validate that this is not empty
    console.log(candidate);
    
    if (candidate.value) {
        todo.addEntry(candidate.value);

        var li = 
            `<li id=${candidate.value}>
                <p>${candidate.value}</p>
                <button class="edit-btn" onclick="editEntry(this.parentElement.id)">Edit</button>
                <button class="delete-btn" onclick="removeEntry(this.parentElement.id)">Delete</button>
            </li>`;
        ul.insertAdjacentHTML('beforeend', li);

        // clear out the input box after adding
        candidate.value = "";
    }
}

function removeEntry(id) {
    console.log("removing list entry", id);
    var li = document.getElementById(id);
    if (li) {
        li.remove();
        //todo.removeEntry(candidate.value);
    }
};

function editEntry(id) {
    var li = document.getElementById(id);

    // hide the DELETE button while we're editing
    var deleteBtn = li.getElementsByClassName('delete-btn')[0];
    deleteBtn.style.display = 'none';

    // create a new Input with the <p> tag value
    var pTag = li.getElementsByTagName('p')[0];
    var input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.setAttribute('value', pTag.innerText);

    // TODO: this button doesn't actually do something,
    // but because you lose focus from the input when you click it,
    // it triggers the focusout event below!
    // create a Save button to replace Edit
    var saveBtn = document.createElement("button");
    saveBtn.setAttribute('class', 'save-btn');
    saveBtn.innerHTML = "Save";
    var editBtn = li.getElementsByClassName('edit-btn')[0];
    li.replaceChild(saveBtn, editBtn);

    li.replaceChild(input, pTag);
    input.focus();
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
            var li = input.parentElement;

            // create a new <p> tag instead of the input
            var pTag = document.createElement("p");
            pTag.innerHTML = input.value;
            li.replaceChild(pTag, input);

            // change Save back to Edit
            var saveBtn = li.getElementsByClassName("save-btn")[0];
            var editBtn = document.createElement("button");

            editBtn.setAttribute("class", "edit-btn");
            editBtn.innerHTML = "Edit";
            editBtn.setAttribute('onclick', 'editEntry(this.parentElement.id)');
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

