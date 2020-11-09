// Storage controller
const StorageCtrl = (() => {
    return {
        storeItem: (newItem) =>{
            let items=[];
            if (localStorage.getItem('items') === null) {
                items.push(newItem);
                localStorage.setItem('items', JSON.stringify(items));
            } else {
                items = JSON.parse(localStorage.getItem('items'));
                items.push(newItem);
                localStorage.setItem('items', JSON.stringify(items));
            }
        },
        getItemsFromStorage: () => {
            let items;
            if (localStorage.getItem('items') === null) {
                items = [];
            } else {
                items = JSON.parse(localStorage.getItem('items'));
            }
            return items;
        },
        updateItemStorage: (updatedItem) => {
            let items = JSON.parse(localStorage.getItem('items'));
            items.forEach((item, index) => {
                if (item.id === updatedItem.id) {
                    items.splice(index, 1, updatedItem);
                }
            });
            localStorage.setItem('items', JSON.stringify(items));
        },
        deleteItemFromStorage: (id) => {
            let items = JSON.parse(localStorage.getItem('items'));
            items.forEach((item, index) => {
                if (id === item.id) {
                    items.splice(index, 1);
                }
            });
            localStorage.setItem('items', JSON.stringify(items));
        },
        clearItemsFromStorage: () => {
            localStorage.removeItem('items');
        }
    }
})();


// Item controller
const ItemCtrl = (function() {
    // Item Constructor
    class Item {
        constructor(id, name, calories) {
            this.id = id;
            this.name= name;
            this.calories = calories;
        }
    }
    // Data Structure / State
    const data = {
        items: StorageCtrl.getItemsFromStorage(),
        currentItem: null,
        totalCalories: 0
    }

    return {
        getItems: () => {
            return data.items;
        },
        addItem: (name, calories) => {
            let ID;
            // Create ID
            if(data.items.length > 0){
                ID = data.items[data.items.length - 1].id + 1;
            } else {
                ID = 0;
            }
            // Calories to number;
            calories = parseInt(calories);

            // Create new item
            newItem = new Item(ID, name, calories);
            data.items.push(newItem);

            return newItem;
        },
        getItemById: (id) => {
            let found;
            data.items.forEach((item) => {
                if(item.id === id) {
                    found = item;
                }
            });
            return found;
        },
        updateItem: (name, cal) => {
            // Calories to number
            cal = parseInt(cal);

            let found;
            data.items.forEach((item) => {
                if(item.id === data.currentItem.id) {
                    item.name = name;
                    item.calories = cal;
                    found = item;
                }
            });
            return found;
        },
        deleteItem: (id) => {
            data.items.forEach((item, index) => {
                if(item.id === id) {
                    data.items.splice(index, 1);
                }
            });
            // BRADS VERSION to delete
            // const ids = data.items.map((item) => {
            //     return item.id;
            // });
            // const index = ids.indexOf(id);
            // data.items.splice(index, 1);
        },
        clearItems: () => {
            data.items = [];
            return data.items;
        },
        setCurrentItem: (itemtoEdit) => {
            data.currentItem = itemtoEdit;
        },
        getCurrentItem: () => {
            return data.currentItem;
        },
        getTotalCalories: () => {
            let total = 0;
            data.items.forEach(function(item) {
                total += item.calories;
            });
            
            data.totalCalories = total;
            return data.totalCalories;
        },
        logData: function () {
            return data;
        },
    };
})();


// UI controller
const UICtrl = (() => {
    const UISelectors = {
        itemList: '#item-list',
        listItems: '#item-list li',
        addBtn: '.add-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        clearBtn: '.clear-btn',
        editIcon: '.edit-item'
    };

    // Public vars
    return {
        populateItemList: function getItems(items) {
            items.forEach((item) => {
                const li = document.createElement('li');
                li.className = `collection-item`;
                li.id = `item-${item.id}`;
                li.innerHTML = `
                    <strong>${item.name}: </strong><em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content">
                        <i class="edit-item fa fa-pencil"></i>
                    </a>
                `;
                document.querySelector(UISelectors.itemList).appendChild(li);
            });
        },
        getItemInput: () => {
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value,
            }
        },

        addListItem: (item) => {
            document.querySelector(UISelectors.itemList).style.display = 'block';
            const li = document.createElement('li');
            li.className = `collection-item`;
            li.id = `item-${item.id}`;
            li.innerHTML = `
                <strong>${item.name}: </strong><em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pencil"></i>
                </a>
            `;
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend',li);

        },
        updateListItem: (item) => {
            document.getElementById(`item-${item.id}`).innerHTML = `
                <strong>${item.name}: </strong><em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pencil"></i>
                </a>
            `;
            // BRADS VERSION
            // let listItems = document.querySelectorAll(UISelectors.listItems);
            // listItems = Array.from(listItems);
            // listItems.forEach((li) => {
            //     if (li.id === `item-${item.id}`) {
            //         li.innerHTML = `
            //         <strong>${item.name}: </strong><em>${item.calories} Calories</em>
            //         <a href="#" class="secondary-content">
            //             <i class="edit-item fa fa-pencil"></i>
            //         </a>
            //         `;
            //     }
            // });

        },
        deleteListItem: (id) => {
            document.getElementById(`item-${id}`).remove();
        },
        clearInput: () => {
            document.querySelector(UISelectors.itemNameInput).value ='';
            document.querySelector(UISelectors.itemCaloriesInput).value ='';

        },
        addItemToForm: () => {
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
        },
        clearAllItems: () => {
            // document.querySelector(UISelectors.itemList).innerHTML = '';
            const listItems = document.querySelectorAll(UISelectors.listItems);
            listArr = Array.from(listItems);
            listArr.forEach((item) => {
                item.remove();
            });
        },
        hideList: () => {
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },

        showTotalCalories: (totalCalories) => {
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
        },
        clearEditState: () => {
            UICtrl.clearInput();
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';

        },
        showEditState: () => {
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';
        },
        getSelectors: function() {
            return UISelectors;
        }
    }
})();



// App controller
const App = ((ItemCtrl, UICtrl, StorageCtrl) => {
    // Load event listeners
    const loadEventListeners = () => {
        // Get UI Selectors
        const UISelectors = UICtrl.getSelectors();

        // Add item event
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);
        // Disable submit on enter
        document.addEventListener('keypress', (e) => {
            if(e.keyCode === 13 || e.which === 13) {
                e.preventDefault();
                return false;
            }
        })
        document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);
        document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);
        document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState);
        document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);
        document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);
    }
    // Add item submit
    const itemAddSubmit = (e) => {
        // Get form input from UI controller
        const input = UICtrl.getItemInput();
        // Validation
        if (input.name !== '' && input.calories !== '') {
            // Add Item
            const newItem = ItemCtrl.addItem(input.name, input.calories);
            // Add item to UI list
            UICtrl.addListItem(newItem);       
            // Get total calories
            const totalCalories = ItemCtrl.getTotalCalories();
            //Add TcCal to UI
            UICtrl.showTotalCalories(totalCalories);
            // Add item to LS
            StorageCtrl.storeItem(newItem);
            // Clear fields
            UICtrl.clearInput();
        }
        e.preventDefault();
    }

    const itemEditClick = (e) => {
        if(e.target.classList.contains('edit-item')) {
            // Get list item id
            const listId = e.target.parentNode.parentNode.id;
            // Break into an array
            const listIdArr = listId.split('-');
            const id = parseInt(listIdArr[1]);
            // Get item from data structure
            const itemToEdit = ItemCtrl.getItemById(id);

            // Set current item
            ItemCtrl.setCurrentItem(itemToEdit);

            // Add item to form
            UICtrl.addItemToForm();

            e.preventDefault();
        }
    };

    const itemUpdateSubmit = (e) => {
        // Get item input
        const input = UICtrl.getItemInput();

        // Update item
        const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

        // Update UI
        UICtrl.updateListItem(updatedItem);
        StorageCtrl.updateItemStorage(updatedItem);
        // Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        //Add TcCal to UI
        UICtrl.showTotalCalories(totalCalories);
        UICtrl.clearEditState();
        e.preventDefault();
    };

    const itemDeleteSubmit = (e) => {
        // Get current item
        const currentItem = ItemCtrl.getCurrentItem();
        // Delete from data structure
        ItemCtrl.deleteItem(currentItem.id);
        // Delete from UI
        UICtrl.deleteListItem(currentItem.id);
        // Clear edit state
        UICtrl.clearEditState();
        // Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        //Add TcCal to UI
        UICtrl.showTotalCalories(totalCalories);
        // delete from LS
        StorageCtrl.deleteItemFromStorage(currentItem.id);
        // Make sure no ugly line 
        const items = ItemCtrl.getItems();
        if (items.length === 0) {
            UICtrl.hideList();
        }
        e.preventDefault();
    }
    const clearAllItemsClick = (e) => {
        // Clear items from data structure
        ItemCtrl.clearItems();
        // Clear items from UI
        UICtrl.clearAllItems();

        const items = ItemCtrl.getItems();
        if (items.length === 0) {
            UICtrl.hideList();
        }
        StorageCtrl.clearItemsFromStorage();
        e.preventDefault();
    }
    return {
        init: function() {
            // Clear edit state
            UICtrl.clearEditState();
            // Fetch items from data structure
            const items = ItemCtrl.getItems();

            // Check if any items
            if(items.length === 0) {
                UICtrl.hideList();
            } else {
                // Populate lists with items
                UICtrl.populateItemList(ItemCtrl.logData().items);
            }
            // Get total calories
            const totalCalories = ItemCtrl.getTotalCalories();
            //Add TcCal to UI
            UICtrl.showTotalCalories(totalCalories);

            // Load event listeners
            loadEventListeners();
        }
    }
})(ItemCtrl, UICtrl, StorageCtrl);


// Initialize App
App.init();