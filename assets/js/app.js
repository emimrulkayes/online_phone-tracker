const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const spinner = document.getElementById("spinner");
const productsDisplay = document.getElementById("products-display");
const productDetailsContainer = document.getElementById(
    "product-details-container"
);


let allPhones = [];
// Search Listener
searchBtn.addEventListener("click", () => {
    try {
        displayPhones(searchInput.value.toLowerCase());
    } catch (error) {
        console.log(error);
    }
});

async function displayPhones(phoneName) {
    clearDisplay();
    clearShowMoreBtn();
    allPhones = await getData(phoneName, true);
    // return if no data found
    if (allPhones.length <= 0) return nothingFound();
    // Render Only 20 results
    renderCards(allPhones.slice(0, 20));
    // show more btn
    renderShowMoreBtn();
}
// This function displays product details
async function displayProductDetails(id) {
    productDetailsContainer.textContent = "";
    let phone = await getData(id, false);
    productDetailsContainer.innerHTML = `
    <div class="card-details text-center py-4 px-5">
      <h4 class="text-dark mb-4 text-start">Product Details</h4>
      <img id="details-img" src="${phone.image}" class="w-75 h-100" alt"Products" />
      <div class="card-body text-start ms-4 pt-5">
        <h3 class="card-title">Product Name:<span class="text-info"> ${phone.name}</span> <i class="bi bi-star text-warning"></i></h3>
        <h6 class="card-title">Brand: <span class="text-muted">${phone.brand}</span></h6>
        <h6 class="card-title">Release Date: <span class="text-muted">${phone.releaseDate ? phone.releaseDate : "Not found"
        }</span>
        </h6>
        <div>
        ${displayFeatures(phone.mainFeatures, "Main Features")}
        </div>
        <div>${displayFeatures(phone.others, "Other Connectivity")}</div>
      </div>
    </div>`;
}

// utility functions
async function getData(arg, allData) {
    let phones = allData ? [] : {};
    const searchText = searchInput.value;
    searchInput.value = "";
    const apiLink = allData ?

        `https://openapi.programming-hero.com/api/phones?search=${searchText}` :
        `https://openapi.programming-hero.com/api/phone/${arg}`;
    try {
        showSpinner(true);
        const res = await fetch(apiLink);
        const { data } = await res.json();
        phones = data;
    } catch (error) {
        console.log(error);
    } finally {
        showSpinner(false);
        return phones;
    }
}

function displayFeatures(features, title) {
    if (!features) return "";
    let string = `<h3 class='fw-bold mt-5'>${title}:</h3>`;
    for (let [key, value] of Object.entries(features)) {
        if (key == "sensors") value = value.join(", ");
        string += `
        <h6 class="card-title">${key}: <span class="text-muted">${value}</span></h6>
        <hr>
    `;
    }
    return string;
}

function renderCards(phones) {
    clearDisplay();
    phones.forEach((phone) => {
        productsDisplay.insertAdjacentHTML(
            "beforeend",
            `<div class="col">
                <div class="card pt-3 text-start">
                    <img src="${phone.image}" class="card-img-top w-75 h-100 mx-auto" alt="Product" />
                    <div class="card-body">
                        <h5 class="card-title"><strong>Model</strong>: <a href="#">${phone.phone_name}</a> <i class="bi bi-star text-warning"></i> </h5>
                        <span class="card-title"><strong>Brand</strong>: ${phone.brand}</span>
                    </div>

                    <div class="card-footer">
                        <a href="#" onclick="displayProductDetails('${phone.slug}')" class="btn btn-primary card-btn">View details</a>
                    </div>
                </div>
            </div>`
        );
    });
}

function renderShowMoreBtn() {
    const allProducts = document.getElementById("all-products");
    allProducts.insertAdjacentHTML(
        "beforeend",
        `
            <div class="text-center my-3"> 
            <button id="show-more" type="button" class="btn btn-success">Show More</button>
            </div>
        `
    );
    // show more Listener
    document.getElementById("show-more").addEventListener("click", showMoreHandler);
}

function showMoreHandler() {
    renderCards(allPhones);
    clearShowMoreBtn();
}

function clearShowMoreBtn() {
    const showMoreBtn = document.getElementById("show-more");
    if (!showMoreBtn) return null;
    showMoreBtn.parentNode.removeChild(showMoreBtn);
}

function clearDisplay() {
    productDetailsContainer.textContent = "";
    productsDisplay.textContent = "";
}

function nothingFound() {
    productDetailsContainer.innerHTML = `<h5 class="text-danger text-center"><strong>No Results</strong> <br> <br> Please search: <cite class="text-info">Apple - Samsung - Huawei - Oppo </cite> etc...</h5>`;
}

// show spinner
function showSpinner(value) {
    spinner.setAttribute("style", `display: ${value ? "block" : "none"}`);
}