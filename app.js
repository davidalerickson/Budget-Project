
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

    var calculateTotal = function(type){
        var sum = 0;
        data.allItems[type].forEach(function(cur){
            sum += cur.value;
        })
        data.totals[type] = sum;
    };

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };



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
        calculateBudget: function(){
            //calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');

            //calculate budget which is income-expenses

            data.budget = data.totals['inc'] - data.totals['exp'];

            //calculaate the percent of income that we spent

            data.percentage = Math.round((data.totals.exp/data.totals.inc) * 100);
            console.log('Total Inc is: ' + data.totals.exp);
            console.log('Total Exp is: ' + data.totals.inc);
            console.log('Data percentage is: ' + data.percentage);
        },

        getBudget: function(){
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
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
        inputButton: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list'
    }

    return {
        getInput: function(){
            return {
                type: document.querySelector(DOMStrings.inputType).value, //will be either inc or exp depending on which selected
                description: document.querySelector(DOMStrings.inputDescription).value, 
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
            }
            // console.log(type + '-----' + description + '----- $' + value); //why does this return undefined? when called
        },
        addListItem: function(obj, type){
            var html, newHtml, element;
            //Create HTML Sring with placeholder text - placeholders delimited with % to make finding and replacing easeer
            if(type === 'inc'){
                element = DOMStrings.incomeContainer;
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }else if(type ==='exp'){
                element = DOMStrings.expensesContainer;
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"> <div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i><button></div></div></div>'
            }

            //Replace placeholder text with data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);
            //Insert HtML into the DOM

            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        getDOMStrings: function(){
            return DOMStrings;
        },
        
        clearFileds: function(){
            var fields;
            fields = document.querySelectorAll(DOMStrings.inputDescription + ' ,' + DOMStrings.inputValue);
            //covert nodelist to array by using Array.prototype to trick into returning an array from a nodelist
            var fieldsArray = Array.prototype.slice.call(fields);
            fieldsArray.forEach(function(current, index, array){
                current.value = '';
            })
            fieldsArray[0].focus();
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
    
    var updateBudget = function(){
        //1. Calculate the budget
            budgetCtrl.calculateBudget();

        //2. Return the budget
            budget = budgetCtrl.getBudget();
            console.log(budget);

        //3. Display the budget on the UI
    }

    var ctrlAddItem = function(){

        var input, newItem;

        //1.Get the field input datq
        input  = UICtrl.getInput();
        console.log(input);

        if(input.description !== '' && !isNaN(input.value) && input.value > 0){

    
            // 2. Add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value); 
            //3.Add the ttem to the UI.
            UICtrl.addListItem(newItem, input.type);
            //4. Cleare the fields
            UICtrl.clearFileds();
            //5. Calculate and update buget
            updateBudget();
        }
    };

    return {init: function(){
        console.log('Application has started');
        setupEventListeners();
    }}
})(budgetController, UIController);

controller.init();
