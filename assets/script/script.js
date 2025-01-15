// ===============
// selectors
// ===============

let imageURL = "";
let totalAmounts = 0;
let inventoryId = 100;
let maxCategory = null;
let maxValue = -Infinity;
let totalAmount = 0
const products = []
let categories = {}
const addBtn = document.querySelector("#add")
document.querySelector("#id").value = inventoryId
const inventoryTableBody = document.querySelector("#in-table-body")
const inventoryTable = document.querySelector("#in-table");
const selectoption = document.querySelector("#inse")
const td1 = document.querySelector("#td1")
const td1body = document.querySelector("#td1-tbody")
const dashboardItems = document.querySelector("#t-item");
const countCategory = document.querySelector("#cat")
const countStock = document.querySelector("#stock-val")
const countTopCategory = document.querySelector("#cat-val")
const countAmount = document.querySelector("#t-amt")
const details = document.querySelector(".details")
const searchBtn = document.querySelector("#fil-btn")
const searchText = document.querySelector(".searchVal");
const toggleTab =  document.querySelector(".container");
// ================
// event on the left container icons to toggle the Selection
// ==================================
const ul = document.querySelector(".pop-ups")
const popupsObj = {
    pop1 : "Something went wrong",
    pop2 : "please fill the information",
    pop3 : "product added to the inventory",
    pop4 : "Item removed from the inventory"
}
const imgLink  = {
    pop1 : "images/popupimages/multiply.png",
    pop2 : "images/popupimages/information.png",
    pop3 : "images/popupimages/correct.png",
    pop4 : "images/popupimages/correct.png"
}

function deletePopup(el) {
    el.classList.add("hide")
    setTimeout(() => el.remove(),500)
}

function createPopUp(msg,img) {
    const li = document.createElement("li")
    li.classList.add("pop")
    li.innerHTML = `
        <img src="${img}" alt="">
        <p class="txt">${msg}</p>
        <p id="cancle" onclick="deletePopup(this.parentElement)">&times;</p>
    `;
    ul.appendChild(li)
    setTimeout(() => deletePopup(li),5000)
}

const icons = document.querySelectorAll('.icon');

// Function to handle icon clicks
function handleIconClick(e) {
    // Remove 'left-tab-toggle' from all icons
    icons.forEach(icon => icon.classList.remove('left-tab-toggle'));

    // Add 'left-tab-toggle' to the clicked icon
    const clickedIcon = e.currentTarget; // Use e.currentTarget to get the clicked .icon
    clickedIcon.classList.add('left-tab-toggle');

    // Get the text content of the <p> element
    const text = clickedIcon.querySelector(".icon-name").innerText.trim();

    // Show/hide sections based on the clicked icon's text
    if (text.toLowerCase() === "inventory") {
        document.querySelector(".sub-right").style.display = "none";
        document.querySelector(".add-items-iv").style.display = "none"
        document.querySelector(".inventory").style.display = "block";
    } else if (text.toLowerCase() === "dashboard") {
        document.querySelector(".sub-right").style.display = "block";
        document.querySelector(".inventory").style.display = "none";
        document.querySelector(".add-items-iv").style.display = "none"
    } else if (text.toLowerCase() === "add item") {
        document.querySelector(".sub-right").style.display = "none";
        document.querySelector(".inventory").style.display = "none";
        document.querySelector(".add-items-iv").style.display = "block"
    }
}

// Select the "Home" icon by default on window load
window.addEventListener("load", () => {
    const homeIcon = Array.from(icons).find(icon => {
        const text = icon.querySelector(".icon-name").innerText.trim();
        return text.toLowerCase() === "dashboard";
    });

    if (homeIcon) {
        homeIcon.classList.add('left-tab-toggle');
        document.querySelector(".sub-right").style.display = "block";
        // document.querySelector(".inventory").style.display = "none";
    }
});

// Attach event listeners to all icons
icons.forEach(icon => {
    icon.addEventListener("click", handleIconClick);
});


const imageInput = document.getElementById("imageUpload");
const imagePreview = document.getElementById("imagePreview");

imageInput.addEventListener("change", (event) => {
  const file = event.target.files[0]; // Get the selected file
  if (file) {
    // Create a temporary URL for the uploaded image
    imageURL = URL.createObjectURL(file);
    console.log(imageURL);
    imagePreview.src = imageURL; // Set the src of the image element
    imagePreview.style.display = "block"; // Make the image visible
  } else {
    imagePreview.style.display = "none"; // Hide the image if no file is selected
  }
});

function showEditTab(idx) {
    toggleTab.classList.toggle("show")
    
}

// ================
// event on edit tab
// // ================

document.querySelector("#close").addEventListener("click", () => toggleTab.classList.remove("show"))


// ====================
// Work
// ====================

// ==> making add item to with some checks 

function addItem() {
    
    const productsName = document.querySelector("#prName").value
    const categoryName = document.querySelector("#name-ctgry").value
    const perUnitPrice = document.querySelector("#per-price").value
    const totalUnit = document.querySelector("#total-unit").value

    if(imageURL && productsName && categoryName && perUnitPrice && totalUnit) {
       let product = {
            id : inventoryId,
            image : imageURL,
            name : productsName,
            category : categoryName,
            unitprice : perUnitPrice,
            totalunit : totalUnit
        }
        products.push(product)
        renderInventoryTable(product, products.length -1)
        createCategories()
        createPopUp(popupsObj.pop3,imgLink.pop3)
    }   else {
        createPopUp(popupsObj.pop2, imgLink.pop2);
    }
}


// ==> rendering the table for the inventory section

function renderInventoryTable(product, index) {
    const tr = document.createElement('tr')
    tr.setAttribute('data-status', product.category)
    tr.dataset.index = index
    tr.innerHTML = `
            <td>${inventoryId++}</td>
            <td>${product.name}</td>
            <td><img src="${product.image}" id="in-img"></td>
            <td>${product.unitprice} ₹</td>
            <td class="ctgry">${product.category}</td>
            <td>${product.unitprice}</td>
            <td>${product.unitprice * product.totalunit} ₹</td>
            <td class="ops">
                <div class="op" id="op1" onclick="showEditTab(${index})"><ion-icon name="create-outline"></ion-icon></div>
                <div class="op" id="op2" onclick="removeItem(${index})"><ion-icon name="close-outline"></ion-icon></div>
            </td>
        `;
        inventoryTableBody.appendChild(tr);
        console.log(tr);
}


function createCategories() {
    categories = {}
    for (const pr of products) {
    if(categories[pr.category]) {
        categories[pr.category] +=1

    }   else {
        categories[pr.category] = 1;
    }
}
    randerCategories()
}

function randerCategories() {
    selectoption.innerHTML = `<option value="All">All inventory</option>`
    for (const key in categories) {
        console.log(key);
        const option = document.createElement("option")
        option.innerHTML = key
        option.value  = key
        selectoption.append(option)
    }
}

function filterInventory(e) {
    const selectValue = selectoption.value
    const allTableRow = document.querySelectorAll("#in-table-body tr")
    console.log(allTableRow);
    allTableRow.forEach((item) => {
        const status = item.dataset.status;
        console.log(status,selectValue)
        if(selectValue === status || selectValue === "All") {
            item.style.display = "table-row"; 
            console.log(1);
        }   else {
            item.style.display = "none"
        }
    })
}


// // ======================
// event on the select option for filter
// //=======================

selectoption.addEventListener('change', (e) => {
    filterInventory(e)
})

// =====================
// event on the add button in add items section 
// =====================

addBtn.addEventListener('click', addItem);

// filter categories and products 
