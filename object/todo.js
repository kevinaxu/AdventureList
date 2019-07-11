function createElementFromHtml(html) {
    var template = document.createElement('template');
    var html = html.trim();
    template.innerHTML = html;
    return template.content.firstChild;
}

// TODO:
// - document onLoad init TodoList() object

class ListItem {
    constructor(text) {
        this.id = this.computeID(text);
        this.text = text;
        this.state = "active";
        this.checked = false;
    }

    computeID(s) {
        return '_' + Math.random().toString(36).substr(2, 9);
    }

    isChecked() {
        return this.checked;
    }

    dump() {
        return {
            "id": this.id,
            "text": this.text,
            "state": this.state,
            "checked": this.checked
        }
    }
}

class TodoList {

    constructor(ul) {
        this.ul = ul;
        this.listItems = [];
    }

    /**
     * MANIPULATING LIST ITEM STATE
     */
    _addListItem(item) {
        this.listItems.push(item);
    }

    _deleteListItem(id) {
        this.listItems = this.listItems.filter(function(item) {
            return item.id !== id;
        });
    }

    _getListItem(id) {
        var listItems = this.listItems.filter(function(item) {
            return item.id === id;
        });
        return listItems[0];
    }

    _updateListItem(id, newText) {
        this.listItems.forEach(item => {
            if (item.id === id) {
                item.text = newText;
            }
        });
    }

    /**
     * CRUD OPERATIONS
     */

    // TODO: change var from CANDIDATE to something else
    addListItem(text) {
        var candidate = document.getElementById("candidate");
        
        if (candidate.value) {
            var listItem = new ListItem(candidate.value);
            this._addListItem(listItem);

            var li = 
                `<li id=${listItem.id} class="list-group-item list-group-item-action d-flex align-items-center bd-highlight">
                    <div class="form-check">
                        <input class="form-check-input list-item-check" type="checkbox" onclick="toggleCheck(this)">
                        <label class="form-check-label" for="defaultCheck1"></label>
                    </div>
                    <div class="p-2 flex-grow-1 bd-highlight list-item-text">
                        ${listItem.text}
                    </div>
                    <div class="p-2 bd-highlight edit-btn" onclick="todoList.editListItem(this.parentElement.id)">
                        <span class="badge">Edit</span>
                    </div>
                    <div class="p-2 bd-highlight delete-btn" onclick="todoList.deleteListItem(this.parentElement.id)">
                        <span class="badge">Delete</span>
                    </div>
                </li>`;
            this.ul.insertAdjacentHTML('beforeend', li);

            // clear out the input box after adding
            candidate.value = "";
        }
    }

    deleteListItem(id) {
        console.log("removing list entry", id);
        var li = document.getElementById(id);
        if (li) {
            this._deleteListItem(id);
            li.remove();
            this.dumpEntries();
        }
    };

    editListItem(id) {
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

    /**
     * DEBUGGING
     */
    dumpEntries() {
        this.listItems.forEach((item) => {
            console.log(item.dump());
        });
    }
}

var ul = document.querySelector('#todo-list');
var todoList = new TodoList(ul);

// TESTING
//todoList.addEntry("what up bruh");
//todoList.dumpEntries();

todoList.ul.addEventListener(
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

            // TODO: SHOULDN'T BE PRIVATE if accessing like this!!
            // update state
            todoList._updateListItem(li.id, input.value);

            // change Save button back to Edit button
            var saveBtn = li.getElementsByClassName("save-btn")[0];
            var editBtn = createElementFromHtml(
                `<div class="p-2 bd-highlight edit-btn" onclick="todoList.editListItem(this.parentElement.id)">
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
