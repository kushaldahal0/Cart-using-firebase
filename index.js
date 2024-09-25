import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase,ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

// Firebase configuration settings (e.g., database URL is passed from window.env)
const appsettings = {
    databaseURL: window.env.databaseURL,
};

// Initialize Firebase app with the provided settings
const app = initializeApp(appsettings);

// Get a reference to the Firebase Realtime Database
const database = getDatabase(app);

// Get a reference to the 'cart' node in the database
const cartInDB = ref(database, "cart");


const cartList = document.querySelector(".cartList");
var clearInput = (inputEl) => { inputEl.value = ""; };
// var addToList = (listEl) => { cartList.innerHTML += `<li class="m-1 flex-grow-1 text-center" >
//         <div class="card p-3 shadow"> 
//             ${listEl}
//         </div>
//     </li>`; };

var addToList = (arrayItem) => {
    let currentItemId = arrayItem[0];
    let currentItemValue = arrayItem[1];
    let newEl = document.createElement("li");
    newEl.classList.add("cursor-pointer","m-1", "flex-grow-1", "text-center", "card", "p-3", "shadow")
    newEl.textContent = currentItemValue
    newEl.addEventListener("click", () => {
        let exactlocationinDB = ref(database, `cart/${currentItemId}`);
        // remove the item from the database using id 
        remove(exactlocationinDB);
    });
    cartList.append(newEl)

};
var clearList = (listEl) => { listEl.innerHTML = ''; };
document.getElementById('myForm').addEventListener('submit', function(event) {
    event.preventDefault(); 
    var inputFeild = document.getElementById('inputText')// Prevent the default form submission
    var inputText = inputFeild.value; // Get the value from the input
    if (inputText != "")  {
        // adding input to the table or collection in database
        push(cartInDB,inputText);
    }
    // console.log(inputText); // Log the value to the console
    clearInput(inputFeild);

});
onValue(cartInDB, function(snapshot) {
    if (snapshot.exists()){
        let cartArray = Object.entries(snapshot.val());
        clearList(cartList);
        cartArray.forEach(item => {
            addToList(item);
        });
    }
    else{
        cartList.innerHTML="No items in the cart yet...";
    }

})