const header = document.getElementById("header")
const nav = document.getElementById("nav")
const menuBtn = document.getElementById("menuBtn")
const navLinks = document.querySelectorAll(".nav-link")

const searchBtn = document.getElementById("searchBtn")
const searchOverlay = document.getElementById("searchOverlay")
const closeSearch = document.getElementById("closeSearch")
const searchInput = document.getElementById("searchInput")
const searchSubmit = document.getElementById("searchSubmit")
const searchResults = document.getElementById("searchResults")

const cartBtn = document.getElementById("cartBtn")
const cartDrawer = document.getElementById("cartDrawer")
const cartOverlay = document.getElementById("cartOverlay")
const closeCart = document.getElementById("closeCart")
const cartItems = document.getElementById("cartItems")
const cartCount = document.getElementById("cartCount")
const cartTotal = document.getElementById("cartTotal")
const cartFooter = document.getElementById("cartFooter")
const checkoutBtn = document.getElementById("checkoutBtn")

const filterButtons = document.querySelectorAll(".filter-btn")
const categoryButtons = document.querySelectorAll(".category-shop-btn")
const productCards = document.querySelectorAll(".product-card")

const productModal = document.getElementById("productModal")
const modalClose = document.getElementById("modalClose")
const modalImage = document.getElementById("modalImage")
const modalCategory = document.getElementById("modalCategory")
const modalName = document.getElementById("modalName")
const modalDescription = document.getElementById("modalDescription")
const modalPrice = document.getElementById("modalPrice")
const modalAddBtn = document.getElementById("modalAddBtn")

const newsletterForm = document.getElementById("newsletterForm")
const newsletterEmail = document.getElementById("newsletterEmail")

const toast = document.getElementById("toast")
const toastText = document.getElementById("toastText")
const backTop = document.getElementById("backTop")

let cart = []
let selectedProduct = null


/* =========================
   MOBILE MENU
========================= */

menuBtn.addEventListener("click", () => {
  nav.classList.toggle("active")
})

navLinks.forEach(link => {
  link.addEventListener("click", () => {
    nav.classList.remove("active")
  })
})

document.addEventListener("click", event => {
  if (
    !nav.contains(event.target) &&
    !menuBtn.contains(event.target)
  ) {
    nav.classList.remove("active")
  }
})


/* =========================
   STICKY HEADER
========================= */

window.addEventListener("scroll", () => {
  if (window.scrollY > 40) {
    header.classList.add("scrolled")
  } else {
    header.classList.remove("scrolled")
  }

  if (window.scrollY > 500) {
    backTop.classList.add("show")
  } else {
    backTop.classList.remove("show")
  }

  updateActiveNavigation()
})


/* =========================
   ACTIVE NAVIGATION
========================= */

function updateActiveNavigation() {
  const sections = document.querySelectorAll("section[id]")
  let currentSection = "home"

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 180

    if (window.scrollY >= sectionTop) {
      currentSection = section.getAttribute("id")
    }
  })

  navLinks.forEach(link => {
    link.classList.remove("active")

    if (link.getAttribute("href") === `#${currentSection}`) {
      link.classList.add("active")
    }
  })
}


/* =========================
   SMOOTH SCROLL
========================= */

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", event => {
    const targetId = link.getAttribute("href")

    if (targetId === "#") {
      event.preventDefault()
      return
    }

    const target = document.querySelector(targetId)

    if (target) {
      event.preventDefault()

      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      })
    }
  })
})


/* =========================
   SEARCH
========================= */

searchBtn.addEventListener("click", () => {
  searchOverlay.classList.add("active")
  document.body.classList.add("no-scroll")

  setTimeout(() => {
    searchInput.focus()
  }, 200)
})

closeSearch.addEventListener("click", closeSearchOverlay)

searchOverlay.addEventListener("click", event => {
  if (event.target === searchOverlay) {
    closeSearchOverlay()
  }
})

function closeSearchOverlay() {
  searchOverlay.classList.remove("active")
  document.body.classList.remove("no-scroll")
  searchInput.value = ""
  searchResults.innerHTML = ""
}

searchSubmit.addEventListener("click", performSearch)

searchInput.addEventListener("keydown", event => {
  if (event.key === "Enter") {
    performSearch()
  }
})

searchInput.addEventListener("input", () => {
  if (searchInput.value.trim().length >= 2) {
    performSearch()
  } else {
    searchResults.innerHTML = ""
  }
})

function performSearch() {
  const query = searchInput.value.trim().toLowerCase()

  if (!query) {
    searchResults.innerHTML = `
      <p style="color:#777">
        Enter a product name or category
      </p>
    `
    return
  }

  const searchableItems = [
    ...document.querySelectorAll(".product-card"),
    ...document.querySelectorAll(".gear-card")
  ]

  const matches = searchableItems.filter(item => {
    const name = item.dataset.name?.toLowerCase() || ""
    const category =
      item.dataset.category?.toLowerCase() ||
      item.querySelector(".gear-info > span")?.textContent.toLowerCase() ||
      ""

    return name.includes(query) || category.includes(query)
  })

  if (matches.length === 0) {
    searchResults.innerHTML = `
      <div style="
        padding:20px;
        background:#f4f6f7;
        border-radius:12px;
        color:#666;
      ">
        No products found
      </div>
    `
    return
  }

  searchResults.innerHTML = matches.map(item => {
    const name = item.dataset.name
    const price = Number(item.dataset.price)
    const image = item.querySelector("img")?.src || ""

    return `
      <div
        class="search-result-item"
        data-search-name="${name}"
        style="
          display:flex;
          align-items:center;
          gap:15px;
          padding:12px 0;
          border-bottom:1px solid #e5e5e5;
          cursor:pointer;
        "
      >
        <img
          src="${image}"
          alt="${name}"
          style="
            width:70px;
            height:60px;
            border-radius:10px;
            object-fit:cover;
          "
        >

        <div style="flex:1">
          <strong style="display:block">${name}</strong>
          <span style="font-size:13px;color:#777">
            $${price.toLocaleString()}
          </span>
        </div>

        <span>→</span>
      </div>
    `
  }).join("")

  document.querySelectorAll(".search-result-item").forEach(result => {
    result.addEventListener("click", () => {
      const name = result.dataset.searchName

      const target = [...searchableItems].find(
        item => item.dataset.name === name
      )

      closeSearchOverlay()

      if (target) {
        setTimeout(() => {
          target.scrollIntoView({
            behavior: "smooth",
            block: "center"
          })
        }, 150)
      }
    })
  })
}


/* =========================
   PRODUCT FILTERS
========================= */

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter

    filterProducts(filter)

    filterButtons.forEach(btn => {
      btn.classList.remove("active")
    })

    button.classList.add("active")
  })
})

function filterProducts(filter) {
  productCards.forEach(card => {
    const category = card.dataset.category

    if (filter === "all" || category === filter) {
      card.classList.remove("hidden")
    } else {
      card.classList.add("hidden")
    }
  })
}


/* =========================
   CATEGORY BUTTONS
========================= */

categoryButtons.forEach(button => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter

    filterProducts(filter)

    filterButtons.forEach(btn => {
      btn.classList.toggle(
        "active",
        btn.dataset.filter === filter
      )
    })

    document.getElementById("bikes").scrollIntoView({
      behavior: "smooth"
    })
  })
})


/* =========================
   WISHLIST
========================= */

document.querySelectorAll(".wishlist-btn").forEach(button => {
  button.addEventListener("click", event => {
    event.stopPropagation()

    button.classList.toggle("active")

    if (button.classList.contains("active")) {
      button.textContent = "♥"
      showToast("Added to wishlist")
    } else {
      button.textContent = "♡"
      showToast("Removed from wishlist")
    }
  })
})


/* =========================
   PRODUCT QUICK VIEW
========================= */

document.querySelectorAll(".quick-view-btn").forEach(button => {
  button.addEventListener("click", event => {
    event.stopPropagation()

    const card = button.closest(".product-card")

    openProductModal(card)
  })
})

function openProductModal(card) {
  const name = card.dataset.name
  const price = Number(card.dataset.price)
  const category = card.dataset.category
  const image = card.querySelector(".product-image img").src

  selectedProduct = {
    id: card.dataset.id,
    name,
    price,
    category,
    image
  }

  modalImage.src = image
  modalImage.alt = name
  modalName.textContent = name
  modalCategory.textContent =
    `${capitalize(category)} Bike`

  modalPrice.textContent =
    `$${price.toLocaleString()}`

  const descriptions = {
    road:
      "Engineered for speed efficiency and confident handling on every road ride",

    mountain:
      "Built for demanding trails with powerful control stability and all terrain performance",

    urban:
      "A lightweight stylish bicycle designed for smooth comfortable everyday city riding"
  }

  modalDescription.textContent =
    descriptions[category] ||
    "Designed for riders who demand performance control and comfort on every ride"

  productModal.classList.add("active")
  document.body.classList.add("no-scroll")
}

modalClose.addEventListener("click", closeProductModal)

productModal.addEventListener("click", event => {
  if (event.target === productModal) {
    closeProductModal()
  }
})

function closeProductModal() {
  productModal.classList.remove("active")
  document.body.classList.remove("no-scroll")
}

modalAddBtn.addEventListener("click", () => {
  if (!selectedProduct) return

  addToCart(selectedProduct)
  closeProductModal()
})


/* =========================
   ADD PRODUCT TO CART
========================= */

document.querySelectorAll(".product-card .add-cart-btn").forEach(button => {
  button.addEventListener("click", event => {
    event.stopPropagation()

    const card = button.closest(".product-card")

    const product = {
      id: card.dataset.id,
      name: card.dataset.name,
      price: Number(card.dataset.price),
      image: card.querySelector(".product-image img").src
    }

    addToCart(product)
  })
})


/* =========================
   ADD GEAR TO CART
========================= */

document.querySelectorAll(".gear-card .add-cart-btn").forEach(button => {
  button.addEventListener("click", () => {
    const card = button.closest(".gear-card")

    const product = {
      id: card.dataset.id,
      name: card.dataset.name,
      price: Number(card.dataset.price),
      image: card.querySelector(".gear-image img").src
    }

    addToCart(product)
  })
})


/* =========================
   CART FUNCTIONS
========================= */

function addToCart(product) {
  const existingItem = cart.find(item => item.id === product.id)

  if (existingItem) {
    existingItem.quantity += 1
  } else {
    cart.push({
      ...product,
      quantity: 1
    })
  }

  updateCart()
  showToast(`${product.name} added to cart`)
}

function updateCart() {
  const totalQuantity = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  )

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  cartCount.textContent = totalQuantity
  cartTotal.textContent = `$${totalPrice.toLocaleString()}`

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="empty-cart" id="emptyCart">
        <div class="empty-cart-icon">🛒</div>
        <h3>Your cart is empty</h3>
        <p>Add your favorite bikes and gear</p>
      </div>
    `

    return
  }

  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item" data-id="${item.id}">

      <div class="cart-item-image">
        <img
          src="${item.image}"
          alt="${item.name}"
        >
      </div>

      <div class="cart-item-info">
        <h4>${item.name}</h4>

        <p>
          $${item.price.toLocaleString()}
        </p>

        <div class="cart-item-controls">

          <button
            class="quantity-minus"
            data-id="${item.id}"
          >
            −
          </button>

          <span>${item.quantity}</span>

          <button
            class="quantity-plus"
            data-id="${item.id}"
          >
            +
          </button>

        </div>
      </div>

      <button
        class="remove-item"
        data-id="${item.id}"
        aria-label="Remove item"
      >
        ×
      </button>

    </div>
  `).join("")

  attachCartControls()
}

function attachCartControls() {
  document.querySelectorAll(".quantity-plus").forEach(button => {
    button.addEventListener("click", () => {
      const item = cart.find(
        product => product.id === button.dataset.id
      )

      if (item) {
        item.quantity += 1
        updateCart()
      }
    })
  })

  document.querySelectorAll(".quantity-minus").forEach(button => {
    button.addEventListener("click", () => {
      const item = cart.find(
        product => product.id === button.dataset.id
      )

      if (!item) return

      item.quantity -= 1

      if (item.quantity <= 0) {
        cart = cart.filter(
          product => product.id !== item.id
        )
      }

      updateCart()
    })
  })

  document.querySelectorAll(".remove-item").forEach(button => {
    button.addEventListener("click", () => {
      const id = button.dataset.id

      cart = cart.filter(item => item.id !== id)

      updateCart()
      showToast("Item removed from cart")
    })
  })
}


/* =========================
   CART DRAWER
========================= */

cartBtn.addEventListener("click", openCart)

closeCart.addEventListener("click", closeCartDrawer)

cartOverlay.addEventListener("click", closeCartDrawer)

function openCart() {
  cartDrawer.classList.add("active")
  cartOverlay.classList.add("active")
  document.body.classList.add("no-scroll")
}

function closeCartDrawer() {
  cartDrawer.classList.remove("active")
  cartOverlay.classList.remove("active")
  document.body.classList.remove("no-scroll")
}


/* =========================
   CHECKOUT
========================= */

checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) {
    showToast("Your cart is empty")
    return
  }

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  showToast(
    `Checkout ready  Total $${total.toLocaleString()}`
  )
})


/* =========================
   NEWSLETTER
========================= */

newsletterForm.addEventListener("submit", event => {
  event.preventDefault()

  const email = newsletterEmail.value.trim()

  if (!email) return

  showToast("Welcome to VeloRush")

  newsletterEmail.value = ""
})


/* =========================
   TOAST
========================= */

let toastTimer

function showToast(message) {
  clearTimeout(toastTimer)

  toastText.textContent = message
  toast.classList.add("show")

  toastTimer = setTimeout(() => {
    toast.classList.remove("show")
  }, 2600)
}


/* =========================
   BACK TO TOP
========================= */

backTop.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  })
})


/* =========================
   REVEAL ANIMATIONS
========================= */

const revealElements = document.querySelectorAll(`
  .section-heading,
  .category-card,
  .product-card,
  .gear-card,
  .collection-card,
  .about-image,
  .about-content,
  .testimonial-card
`)

revealElements.forEach(element => {
  element.classList.add("reveal")
})

const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible")
        revealObserver.unobserve(entry.target)
      }
    })
  },
  {
    threshold: 0.12
  }
)

revealElements.forEach(element => {
  revealObserver.observe(element)
})


/* =========================
   ESCAPE KEY
========================= */

document.addEventListener("keydown", event => {
  if (event.key !== "Escape") return

  if (productModal.classList.contains("active")) {
    closeProductModal()
  }

  if (searchOverlay.classList.contains("active")) {
    closeSearchOverlay()
  }

  if (cartDrawer.classList.contains("active")) {
    closeCartDrawer()
  }

  nav.classList.remove("active")
})


/* =========================
   HELPER
========================= */

function capitalize(text) {
  if (!text) return ""

  return text.charAt(0).toUpperCase() + text.slice(1)
}


/* =========================
   INITIAL STATE
========================= */

updateCart()
updateActiveNavigation()