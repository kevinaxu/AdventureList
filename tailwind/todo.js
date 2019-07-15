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

    setChecked() {
        this.checked = true;
    }

    setNotChecked() {
        this.checked = false;
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

    constructor(ul, btnGroup) {
        this.ul = ul;
        this.listItems = [];

        // shortcuts to Bulk Action buttons
        this.btnSelectAll = btnGroup.getElementsByClassName("bulk-select-all")[0];
        this.btnDeselectAll = btnGroup.getElementsByClassName("bulk-deselect-all")[0];
        this.btnMarkComplete = btnGroup.getElementsByClassName("bulk-mark-complete")[0];
        this.btnDeleteSelected = btnGroup.getElementsByClassName("bulk-delete-selected")[0];

        this.computeButtonState();
    }

    /**
     * MANIPULATING LIST ITEM STATE
     */
    _addListItem(item) {
        this.listItems.push(item);
    }

    _completeListItem(id) {
        var listItem = _getListItem(id);
        listItem.state = "disabled";
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

    // We don't care about deleted ones since they're not visible
    _getCheckedItems() {
        var listItems = this.listItems.filter(function(item) {
            return item.checked === true && item.state !== "deleted";
        });
        return listItems;
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

    addListItem() {
        var inputElement = document.getElementById('list-input');
        var inputVal = inputElement.value;
        if (!inputVal) {
            return;
        }
        
        var listItem = new ListItem(inputVal);
        this._addListItem(listItem);

        var li = 
            `<li id=${listItem.id} class="flex justify-between items-center h-16 w-full border-b border-b-2 border-teal-500 hover:bg-blue-200">
                <div class="flex-initial px-2 mb-1 ml-1">
                    <input class="list-item-check" type="checkbox" onclick="todoList.toggleCheck(this.parentElement.parentElement.id)">
                    <label></label>
                </div>
                <div class="list-item-text flex-auto px-2 text-lg text-gray-700">
                    ${listItem.text}
                </div>
                <div class="item-check flex-initial p-1 m-1" onclick="todoList.completeListItem(this.parentElement.id)">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="20pt" height="16pt" viewBox="0 0 24 20" version="1.1">
                        <g id="surface1">
                        <path style="fill:none;stroke-width:14;stroke-linecap:butt;stroke-linejoin:miter;stroke:rgb(0%,80%,0%);stroke-opacity:1;stroke-miterlimit:4;" d="M 19.990234 130 L 60.008138 170 L 200.014648 30 " transform="matrix(0.104348,0,0,0.1,0,0)"/>
                        </g>
                    </svg>
                </div>
                <div class="item-remove flex-initial p-1 m-1" onclick="todoList.deleteListItem(this.parentElement.id)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24">
                        <path fill="#FC8181" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
                    </svg>

                </div>
            </li>`;
        this.ul.insertAdjacentHTML('afterbegin', li);

        // clear out the input box after adding
        inputElement.value = "";

        this.computeButtonState();
        console.log("added list item", listItem.id);
    }

    deleteListItem(id) {
        var li = document.getElementById(id);
        if (li) {
            this._deleteListItem(id);
            li.remove();
            this.dumpEntries();
        }

        this.computeButtonState();
        console.log("removing list item", id);
    };

    completeListItem(id) {
        var li = document.getElementById(id);
        if (li) {
            li.classList.add("opacity-50");

            // add a strikethrough to the text
            var text = li.getElementsByClassName('list-item-text')[0];
            text.style.setProperty("text-decoration", "line-through");

            this._completeListItem(id);
            this.dumpEntries();
        }
    }

    toggleCheck(id) {
        var li = document.getElementById(id);
        var checkbox = li.getElementsByClassName('list-item-check')[0];

        var listItem = this._getListItem(li.id);
        if (checkbox.checked) {
            li.classList.add("bg-blue-200");
            listItem.setChecked();
            console.log("checked da box", li.id);
        } else {
            li.classList.remove("bg-blue-200");
            listItem.setNotChecked();
            console.log("unchecked da box", li.id);
        }

        this.computeButtonState();
    }

    computeButtonState() {
        console.log("computing button state");
        var checkedItems = this._getCheckedItems();

        var numListItems = this.listItems.length;
        var numCheckedItems = checkedItems.length;

        // if there are no items, then everything is disabled
        if (numListItems === 0) {
            console.log("no items at all!");
            [this.btnSelectAll, this.btnDeselectAll, this.btnMarkComplete, this.btnDeleteSelected].forEach(btn => {
                btn.classList.add("cursor-not-allowed");
                btn.classList.add("opacity-50");
            });
        } else if (numListItems > 0 && numCheckedItems === 0) {
            console.log("we have items, but none are checked!");
            this.btnSelectAll.classList.remove("opacity-50");
            this.btnSelectAll.classList.remove("cursor-not-allowed");
            [this.btnDeselectAll, this.btnMarkComplete, this.btnDeleteSelected].forEach(btn => {
                btn.classList.add("opacity-50");
                btn.classList.add("cursor-not-allowed");
            });
        } else if (numListItems === numCheckedItems) {
            this.btnSelectAll.classList.add("opacity-50");
            this.btnSelectAll.classList.add("cursor-not-allowed");
            [this.btnDeselectAll, this.btnMarkComplete, this.btnDeleteSelected].forEach(btn => {
                btn.classList.remove("opacity-50");
                btn.classList.remove("cursor-not-allowed");
            });
        } else {
            [this.btnSelectAll, this.btnDeselectAll, this.btnMarkComplete, this.btnDeleteSelected].forEach(btn => {
                btn.classList.remove("opacity-50");
                btn.classList.remove("cursor-not-allowed");
            });
        }
    }
    
    /**
     * BUTTON GROUP OPERATIONS
     */
    toggleListItems(shouldSelect) {
        var collection = this.ul.getElementsByTagName('li');
        for (var li of collection) {
            if (li) {
                var checkbox = li.getElementsByClassName('list-item-check')[0];

                console.log(li);
                var listItem = this._getListItem(li.id);
                if (shouldSelect) {
                    li.classList.add("bg-blue-200");
                    checkbox.checked = true;
                    listItem.setChecked();
                } else {
                    li.classList.remove("bg-blue-200");
                    checkbox.checked = false;
                    listItem.setNotChecked();
                }
            }
        }

        this.computeButtonState();
    }

    disableSelected() {
        var checkedItems = this._getCheckedItems();
        console.log(checkedItems);
        if (checkedItems && checkedItems.length > 0) {
            checkedItems.forEach(item => {
                var li = document.getElementById(item.id);
                li.classList.add("opacity-50");

                // add a strikethrough to the text
                var text = li.getElementsByClassName('list-item-text')[0];
                text.style.setProperty("text-decoration", "line-through");
            });
        }

        this.toggleListItems(false);
    }

    deleteSelected() {
        var checkedItems = this._getCheckedItems();
        console.log(checkedItems);
        if (checkedItems && checkedItems.length > 0) {
            checkedItems.forEach(item => {
                var li = document.getElementById(item.id);
                this.deleteListItem(li.id);

                item.state = "deleted";
            });
        }
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



/*
// TODO
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

            <div class="list-item-text flex-auto px-2 text-lg">
                <input class="w-full bg-transparent border-none text-gray-700 focus:outline-none" type="text" placeholder="Feed the doggie">
                <!--What up bruh-->
            </div>

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

    console.log("edited list item", id);
}
*/

var ul = document.querySelector('#todo-list');
var btnGroup = document.querySelector('#bulk-actions');
var todoList = new TodoList(ul, btnGroup);

todoList.ul.addEventListener(
    'dblclick',
    function(e) {
        if (!e.target) {
            return;
        }

        if (e.target.nodeName === "LI") {
            console.log("double clicked li")
        }
    }
);

todoList.ul.addEventListener(
    'mouseover',
    function (e) {
        if (!e.target) {
            return;
        }
        if (e.target.nodeName === "LI") {
            console.log("entering LI", e.target.id);
            //console.log(e);
        }
    }
);

// TESTING
//todoList.addEntry("what up bruh");
//todoList.dumpEntries();

// run these actions whenever list item checkboxes get changed
/*
todoList.ul.addEventListener(
    // better here to onclick? oncheck?
    'change',
    function (e) {
        if (!e.target) {
            return;
        }

        if (e.target.nodeName === "INPUT" && e.target.type === "checkbox") {
            console.log("tagged the box", e.target.parentElement.parentElement.id);

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
*/

/*
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
                `<div class="p-2 bd-highlight edit-btn" onclick="todoList.ListItem(this.parentElement.id)">
                    <span class="badge">Edit</span>
                </div>`
            );
            li.replaceChild(editBtn, saveBtn);

            // show the Delete button again
            var deleteBtn = li.getElementsByClassName('delete-btn')[0];
            deleteBtn.style.display = '';

            console.log("finished editing item", li.id);
        }
    }
);
*/
