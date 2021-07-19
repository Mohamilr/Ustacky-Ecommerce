const data = [
  {
      id: 1,
      image: "https://res.cloudinary.com/project-s/image/upload/v1619972269/product3_iyadfq.png",
      name: "PS 5",
      price: "400000"
  },
  {
      id: 2,
      image: "https://res.cloudinary.com/project-s/image/upload/v1619972269/product5_mothwj.png",
      name: "watch",
      price: "20000"
  },
  {
      id: 3,
      image: "https://res.cloudinary.com/project-s/image/upload/v1619972269/product2_j1wvfr.png",
      name: "Techno spark 4",
      price: "30000"
  },
  {
      id: 4,
      image: "https://res.cloudinary.com/project-s/image/upload/v1619972269/product4_pwfxla.png",
      name: "hp 640",
      price: "80000"
  },
  {
      id: 5,
      image: "https://res.cloudinary.com/project-s/image/upload/v1619972268/product1_ktbggp.png",
      name: "television",
      price: "40000"
  },
  {
      id: 6,
      image: "https://res.cloudinary.com/project-s/image/upload/v1619972268/product6_epx7oo.png",
      name: "phone accessories",
      price: "2000"
  }
]


// declare elements
const productContainer = document.querySelector(".products-container");
//
const cartIconContainer = document.querySelector(".cart-icon-container");
const cartItemCount = document.querySelector(".cart-item-count");
//
const addProductBtns = document.getElementsByClassName("product-btn");
const removeProductBtns = document.getElementsByClassName("remove-from-cart");
// Cart
const modalBackground = document.querySelector(".modal-background");
const cartModal = document.querySelector(".cart-modal");
const cartItems = document.querySelector(".cart-data");
//
const cartItemPrices = document.getElementsByClassName("cart-item-price");
const increaseQuantityBtns = document.getElementsByClassName("increase");
const decreaseQuantityBtns = document.getElementsByClassName("reduce");
const removeItemFromCartBtns = document.getElementsByClassName("remove");
const continueShoppingBtn = document.querySelector(".continue");
// cart form
const cartForm = document.querySelector(".cart-form");
const name = document.querySelector("#name");
const email = document.querySelector("#email");
const phone = document.querySelector("#phone");
const totalItemsPrice = document.querySelector(".total-items-price");
// success modal
const successModal = document.querySelector(".success-modal-container");
const ok = document.querySelector("#ok");
//
const purchasedData = document.querySelector(".purchased-data");
const customerName = document.querySelector(".customer-name");

// GLOBAL
let cart = [];
const user = {};
let initialTotalPrice = 0;

// display data
data.forEach((product) => {
  productContainer.innerHTML += `
    <div class="product">
      <div class="product-image-container">
          <img src="${product.image}" alt="product" />
          <div class="overlay">
            <p class="price-tag">Price</p>
            <p class="price">₦${product.price}</p>
          </div>
      </div>
      <h3>${product.name}</h3>
      <button value=${product.id} class="product-btn">ADD TO CART</button>
      <button value=${product.id} class="remove-from-cart">REMOVE FROM CART</button>
    </div>
    `;
});

// Add to cart Buttons
for (const addProductBtn of addProductBtns) {
  addProductBtn.addEventListener("click", (e) => {
    addProductBtn.style.display = "none";
    addProductBtn.nextElementSibling.style.display = "inline-block";
    cartItemCount.textContent = parseInt(cartItemCount.textContent) + 1;

    const item = data.find((value) => value.id == e.target.value);

    const store = {
      id: item.id,
      itemName: item.name,
      price: item.price,
      quantity: 1,
    };

    cart.push(store);
  });
}

// Remove from cart buttons
for (const removeBtn of removeProductBtns) {
  removeBtn.addEventListener("click", (e) => {
    removeBtn.style.display = "none";
    removeBtn.previousElementSibling.style.display = "inline-block";
    cartItemCount.textContent = parseInt(cartItemCount.textContent) - 1;

    const item = cart.find((value) => value.id == e.target.value);

    const filteredItem = cart.filter((data) => data.id !== item.id);
    cart = filteredItem;
  });
}

/**
 * Calculate Grand total price
 * @returns total price of all cart intem
 */
function overallCartAmount() {
  initialTotalPrice = 0;
  for (let i = 0; i < cartItemPrices.length; i++) {
    initialTotalPrice += parseInt(cartItemPrices[i].textContent.slice(1));
  }
  return totalItemsPrice.textContent = `₦${initialTotalPrice}`;
}

// cart icon
cartIconContainer.addEventListener("click", () => {
  openCartModal()
  displayCartItems();
  overallCartAmount();

  let totalPrice;

  increaseItemQuantity(totalPrice);

  decreaseItemQuantity(totalPrice);

  // remove item from cart
  for (const removeItemFromCartBtn of removeItemFromCartBtns) {
    removeItemFromCartBtn.addEventListener("click", () => {
      cartItemCount.textContent = parseInt(cartItemCount.textContent) - 1;

      for (const addProductBtn of addProductBtns) {
        if (
          removeItemFromCartBtn.parentElement.parentElement.id ===
          addProductBtn.value
        ) {
          addProductBtn.style.display = "inline-block";
          addProductBtn.nextElementSibling.style.display = "none";

          const item = cart.find((value) => value.id == addProductBtn.value);
          const filteredItem = cart.filter((data) => data.id !== item.id);
          cart = filteredItem;
        }
      }

      //
      removeItemFromCartBtn.parentElement.parentElement.remove();
      overallCartAmount();
    });
  }
});

/**
 * Handles cart modal state (close)
 */
function closeCartModal() {
  modalBackground.style.display = "none";
  cartModal.style.display = "none";
  cartItems.innerHTML = "";
}

/**
 * Handles cart modal state (open)
 */
function openCartModal() {
  modalBackground.style.display = "block";
  cartModal.style.display = "block";
}

continueShoppingBtn.addEventListener("click", closeCartModal);
// close modal by clicking out of it
window.onclick = function(event) {
  if (event.target == cartModal) {
    closeCartModal()
  }
}

/**
 * Handles success modal state (close)
 */
function closeSuccessModal() {
  successModal.style.display = "none";

  // reset cart
  cartItemCount.textContent = 0
  cart = []

  // reset remove from cart buttons
  for (const removeBtn of removeProductBtns) {
      removeBtn.style.display = "none";
      removeBtn.previousElementSibling.style.display = "inline-block";
  }
}

/**
 * Handles success modal state (open)
 */
function openSuccessModal() {
  successModal.style.display = "block";
  displayPurchasedItems();
  customerName.textContent = user?.name;
 
}

ok.addEventListener("click", closeSuccessModal);

function displayCartItems() {
  cart.forEach((item, i) => {
    cartItems.innerHTML += `
   <tr id=${item.id}>
      <td>${i + 1}</td>
      <td>${item.itemName}</td>
      <td class="cart-item-price" id=${item.id}-${item.price}>₦${item.price}</td>
      <td class="quantity-increase-container">
        <button class="reduce">-</button>
        <span class="quantity">${item.quantity}</span>
        <button class="increase">+</button>
      </td>
      <td><button class="remove">Remove</button></td>
    </tr>
   `;
  });
}

function displayPurchasedItems() {
  cart.forEach((item, i) => {
    purchasedData.innerHTML += `
   <tr>
      <td>${i + 1}</td>
        <td>${item.itemName}</td>
        <td>${item.quantity}</td>
    </tr>
   `;
  });
}

function increaseItemQuantity(totalPrice) {
  for (const increaseQuantityBtn of increaseQuantityBtns) {
    increaseQuantityBtn.addEventListener("click", () => {
      const itemId = parseInt(
        increaseQuantityBtn.parentElement.parentElement.children[2].id.split(
          "-"
        )[0],
        10
      );
      const item = cart.find((value) => value.id == itemId);
      // update quantity
      Object.assign(item, { quantity: item.quantity + 1 });

      //
      increaseQuantityBtn.previousElementSibling.textContent =
        parseInt(increaseQuantityBtn.previousElementSibling.textContent) + 1;

      totalPrice =
        parseInt(
          increaseQuantityBtn.parentElement.parentElement.children[2].id.split(
            "-"
          )[1],
          10
        ) * parseInt(increaseQuantityBtn.previousElementSibling.textContent);

      increaseQuantityBtn.parentElement.parentElement.children[2].textContent = `₦${totalPrice}`;

      overallCartAmount();
    });
  }
}

function decreaseItemQuantity(totalPrice) {
  for (const decreaseQuantityBtn of decreaseQuantityBtns) {
    decreaseQuantityBtn.addEventListener("click", () => {
      if (parseInt(decreaseQuantityBtn.nextElementSibling.textContent) <= 1) {
        alert("you must have an item, else remove the item from the cart");
      } else {
        const itemId = parseInt(
          decreaseQuantityBtn.parentElement.parentElement.children[2].id.split(
            "-"
          )[0],
          10
        );
        const item = cart.find((value) => value.id == itemId);
        // update quantity
        Object.assign(item, { quantity: item.quantity - 1 });

        //
        decreaseQuantityBtn.nextElementSibling.textContent =
          parseInt(decreaseQuantityBtn.nextElementSibling.textContent) - 1;
        totalPrice =
          parseInt(
            decreaseQuantityBtn.parentElement.parentElement.children[2].id.split(
              "-"
            )[1],
            10
          ) * parseInt(decreaseQuantityBtn.nextElementSibling.textContent);

        decreaseQuantityBtn.parentElement.parentElement.children[2].textContent = `₦${totalPrice}`;

        overallCartAmount();
      }
    });
  }
}

cartForm.addEventListener(
  "submit",
  (e) => {
    e.preventDefault();
    if (parseInt(totalItemsPrice.textContent.slice(1), 10) === 0) {
      return alert("add at least an item to your cart before you checkout.");
    }
    Object.assign(user, {
      name: name.value,
      email: email.value,
      phone: phone.value,
    });

    closeCartModal();
    payWithPaystack();

    e.target.reset();
  },
  false
);

function payWithPaystack() {
  let handler = PaystackPop.setup({
    key: "pk_test_420f5d09d81b1975850448939bf7bc24b31a4b1f",
    email: email.value,
    amount: parseInt(totalItemsPrice.textContent.slice(1), 10) * 100,
    ref: "" + Math.floor(Math.random() * 1000000000 + 1),
    onClose: function () {
      alert("Window closed.");
    },
    callback: function (response) {
      openSuccessModal();
    },
  });
  handler.openIframe();
}
