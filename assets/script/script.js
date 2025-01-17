// ===============
// selectors
// ===============

let imageURL = "";
let topKey = "";
let topVal = 0;
let currId;
let inventoryId = 100;
let totalAmount = 0
let totalAmountCateogry = {}
const products = []
const globalData = [
    ['Category', 'Value'], // Include headers for Google Charts
  ];
let categories = {}
const addBtn = document.querySelector("#add")
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
const editBtn = document.querySelector("#editBtn")
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

function updateTotal(products) {
    const val = products.reduce((prev,product) => {
        return prev + (product.unitprice * product.totalunit)
    },0)
    countAmount.innerHTML = `${val} ₹`
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
        updateTotal(products)
        console.log(products);
        dashboardItems.innerHTML =  products.length;
        renderInventoryTable(product, products.length-1)
        createCategories()
        createPopUp(popupsObj.pop3,imgLink.pop3)

        document.querySelector("#prName").value = ""
        document.querySelector("#name-ctgry").value = ""
        document.querySelector("#per-price").value = ""
        document.querySelector("#total-unit").value = ""

    }   else {
        createPopUp(popupsObj.pop2, imgLink.pop2);
    }
}


// ==> rendering the table for the inventory section

function renderInventoryTable(product, index) {
    const tr = document.createElement('tr')
    tr.setAttribute('data-status', product.category)
    tr.dataset.index = index
    currId = index;
    tr.className = "item"
    tr.innerHTML = `
            <td>${inventoryId++}</td>
            <td>${product.name}</td>
            <td><img src="${product.image}" id="in-img"></td>
            <td>${product.unitprice} ₹</td>
            <td class="ctgry">${product.category}</td>
            <td>${product.totalunit}</td>
            <td>${product.unitprice * product.totalunit} ₹</td>
            <td class="ops">
                <div class="op" id="op1" onclick="showEditTab(${index})"><ion-icon name="create-outline"></ion-icon></div>
                <div class="op" id="op2" onclick="removeItem(this)"><ion-icon name="close-outline"></ion-icon></div>
            </td>
        `;
        LowInventory(product)
        categoryTotals(products)
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
    randerCategories(categories)
}

function randerCategories(categories) {
    selectoption.innerHTML = `<option value="All">All inventory</option>`
    for (const key in categories) {
        console.log(key);
        const option = document.createElement("option")
        option.innerHTML = key
        option.value  = key
        selectoption.append(option)
    }
        topCategory(categories)
        getChartData(categories)
        countCategory.innerHTML = Object.entries(categories).length;
}

function topCategory(categories) {
    topVal = 0
    topKey = ""
    for (const key in categories) {
       if(categories[key] > topVal) {
        topVal = categories[key]
        topKey = key
       } 
    }
    console.log(topVal);
    if(Object.entries(categories).length === 0) {
        countTopCategory.innerHTML = ""
    }   else {
    countTopCategory.innerHTML = `${topKey} (ctg)`
    }
}


function LowInventory(product) {
    if(product.totalunit <= 15) {
    const tr = document.createElement("tr")
    tr.innerHTML = `
          <tr>
                <th><img src="${product.image}"></th>
                <th>${product.name}</th>
                <th>${product.category}</th>
                <th>${product.unitprice}</th>
                <th>${product.unitprice * product.totalunit}</th>
                <th id="num"><p>${product.totalunit}</p></th>
            </tr>
    `;
    td1body.append(tr)
    countStock.innerHTML = document.querySelectorAll("#td1-tbody tr").length ;
    }
}

function categoryTotals(items) {
    const amountOfCategory = {}
    items.forEach((item) => {
        const category = item.category
        if(amountOfCategory[category]) {
            amountOfCategory[category]  += (item.unitprice * item.totalunit)

        }   else {
            amountOfCategory[category] = item.unitprice * item.totalunit
        }
    })
    updateDashboard(amountOfCategory);
}

function updateDashboard(object) {
    details.innerHTML = ""
    for (const key in object) {
        const detail = document.createElement("div")
        detail.classList.add("detail")
        detail.innerHTML = `
            <p>${key}</p>
            <p>${object[key]} ₹</p>
        `;
        details.append(detail)
    }
}



function removeItem(button) {
    const li = button.closest(".item");
    const index = li.dataset.index;
    const product = products[index];
    const category = product.category;

    products.splice(index, 1);
    dashboardItems.innerHTML =  products.length;
    li.remove();

    updateTotal(products)
    createPopUp(popupsObj.pop4, imgLink.pop4);
    categories[category] -= 1
    console.log(categories);
    topCategory(categories)
    if(categories[category] === 0) {
        delete categories[category];
        randerCategories(categories)
    }
    countStock.innerHTML = document.querySelectorAll("#td1-tbody tr").length ;
    updateLowInventory();
    categoryTotals(products)
const allRows = document.querySelectorAll('.item');
allRows.forEach((row, idx) => {
    row.dataset.index = idx; // Update dataset.index with the new index
});

}


function showEditTab(index) {
    toggleTab.classList.toggle("show")
    console.log(products[index])
    const name = document.querySelector("#name").value = products[index].name
    const perunitprice = document.querySelector("#perPrice").value = products[index].unitprice
    const totalUnit = document.querySelector("#qtyNumber").value = products[index].totalunit
    editBtn.onclick = () => {
        submitEdit(index)
    }
}

function submitEdit(index) {
    const val = document.querySelector(`#in-table-body tr[data-index="${index}"]`)

    let name = document.querySelector("#name").value;
    const unit = document.querySelector("#perPrice").value
    const totalUnit = document.querySelector("#qtyNumber").value


    if(name && unit && totalUnit) {
    console.log(val.querySelector("td:nth-child(2)").textContent);
    
    val.querySelector("td:nth-child(2)").textContent = name;
    val.querySelector("td:nth-child(4)").textContent = `${unit} ₹`;
    val.querySelector("td:nth-child(6)").textContent = totalUnit;
    val.querySelector("td:nth-child(7)").textContent = `${unit * totalUnit} ₹`;
    console.log(products);

    products[index].name = name;
    products[index].unitprice = parseFloat(unit);
    products[index].totalunit = parseInt(totalUnit, 10); 
    
    // td1body.innerHTML = ""
    updateLowInventory();
    updateTotal(products)
    categoryTotals(products)
    createPopUp("item edited succesfully", imgLink.pop3);
    }   else {
        createPopUp(popupsObj.pop2, imgLink.pop2);
    }
}

function updateLowInventory() {
    td1body.innerHTML = ""; // Clear the low-stock table
    let lowStockCount = 0;

    for (const product of products) {
        if (product.totalunit <= 15) {
            LowInventory(product); // Render low-stock product
            lowStockCount++;
        }
    }

    // Update low stock count in the UI
    countStock.textContent = lowStockCount;
}


function filterInventory(e) {
    const selectValue = selectoption.value;
    const allTableRow = document.querySelectorAll("#in-table-body tr");
    
    // Clear the low inventory table
    td1body.innerHTML = "";

    allTableRow.forEach((item) => {
        const status = item.dataset.status;
        
        // Show or hide the table rows based on the filter
        if (selectValue === status || selectValue === "All") {
            item.style.display = "table-row";

            // Check if the product qualifies as low inventory
            const totalUnits = parseInt(item.querySelector("td:nth-child(6)").textContent, 10);
            if (totalUnits < 13) {
                const product = {
                    name: item.querySelector("td:nth-child(2)").textContent,
                    image: item.querySelector("img").src,
                    category: item.querySelector("td:nth-child(5)").textContent,
                    unitprice: parseFloat(item.querySelector("td:nth-child(4)").textContent.replace("₹", "").trim()),
                    totalunit: totalUnits,
                };
                LowInventory(product);
            }
        } else {
            item.style.display = "none";
        }
    });
}

function inputFilter() {
    const input = searchText.value
    const items = document.querySelectorAll("#in-table-body tr")
if(input) {
    items.forEach((item) => {
        const name = item.querySelector("td:nth-child(2)").textContent
        console.log(name);
        
        if(name.toLocaleLowerCase() === input.toLocaleLowerCase()) {
            item.style.display = "table-row";

        }   else {
            item.style.display = "none"
        }
    })
} else {
    createPopUp(popupsObj.pop1, imgLink.pop1);
    
}
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
searchBtn.addEventListener("click", inputFilter)
// filter categories and products 


// ===========================
// charts
// ===========================
function getChartData(obj) {
    for (const key in obj) {
        globalData.push([key, obj[key]])
    }
    console.log(globalData);
    renderChart()
}

// Define global data

  console.log('main.js loaded. globalData is now available.');
  