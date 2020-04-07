
//BUDGET CONTROLLER
var budgetController = (function(){

    var Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };
    
    var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
    }

    

    return {
        addItem: function(type, des, val){
            var newItem, ID;
            ID = 0;

            //determining last id of array to increment for next one, if it is empty, set ID to 0
            if(data.allItems[type].length > 0 ){
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            }else{
                ID = 0;
            }
            //Create newItem based on inc or exp type
            if(type === 'exp'){
                newItem = new Expense(ID, des, val);
            }else{
                newItem = new Income(ID, des, val);
            }

            //push it into our data structure
            data.allItems[type].push(newItem);


            //return the new element
            return newItem; //allows direct access for other modules to use, ie updating UI 
        },
        testing: function(){
            console.log(data);
        }

    }

})();


//UI CONTROLLER
var UIController = (function(){

    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn'
    }

    return {
        getInput: function(){
            return {
                type: document.querySelector(DOMStrings.inputType).value, //will be either inc or exp depending on which selected
                description: document.querySelector(DOMStrings.inputDescription).value, 
                value: document.querySelector(DOMStrings.inputValue).value
            }
            // console.log(type + '-----' + description + '----- $' + value); //why does this return undefined? when called
        },
        addListItem: function(obj, type){
            var html;
            //Create HTML Sring with placeholder text - placeholders delimited with % to make finding and replacing easeer
            if(type = 'inc'){
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">Salary</div><div class="right clearfix"><div class="item__value">+ 2,100.00</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }else if(type='exp'){
                html = '<div class="item clearfix" id="expense-0"><div class="item__description">Apartment rent</div><div class="right clearfix"> <div class="item__value">- 900.00</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i><button></div></div></div>'
            }else{

            }

            //Replace placeholder text with data

            //Insert HtML into the DOM
        },

        getDOMStrings: function(){
            return DOMStrings;
        }
    }
})();


//GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl){

    var setupEventListeners = function(){

        var DOM = UICtrl.getDOMStrings();
        //Detect Clickimng the Add button
        document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem );
        //Listen for Enter Key
        document.addEventListener('keypress', function(event){
            if(event.keyCode === 13 || event.which === 13){
                ctrlAddItem();
                // console.log('Enter was pressed');
            };
        });
    }
    
    var ctrlAddItem = function(){

        var input, newItem;

        console.log('Button clicked or Enter pressed');
        //1.Get the field input datq
        input  = UICtrl.getInput();
        console.log(input);

        // 2. Add the item to the budget controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value); 
        //3.Add the ttem to the UI.

        //4. Calculate the budget

        //5. Display the budget on the UI
    };

    return {init: function(){
        console.log('Application has started');
        setupEventListeners();
    }}
})(budgetController, UIController);

controller.init();