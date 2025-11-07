// ===================================
// Mobile Navigation Toggle
// ===================================
document.addEventListener("DOMContentLoaded", () => {
  const mobileToggle = document.getElementById("mobileToggle")
  const navMenu = document.getElementById("navMenu")

  if (mobileToggle) {
    mobileToggle.addEventListener("click", function () {
      navMenu.classList.toggle("active")

      // Animate hamburger icon
      const spans = this.querySelectorAll("span")
      if (navMenu.classList.contains("active")) {
        spans[0].style.transform = "rotate(45deg) translateY(10px)"
        spans[1].style.opacity = "0"
        spans[2].style.transform = "rotate(-45deg) translateY(-10px)"
      } else {
        spans[0].style.transform = "none"
        spans[1].style.opacity = "1"
        spans[2].style.transform = "none"
      }
    })

    // Close menu when clicking on a link
    const navLinks = navMenu.querySelectorAll(".nav-link")
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("active")
        const spans = mobileToggle.querySelectorAll("span")
        spans[0].style.transform = "none"
        spans[1].style.opacity = "1"
        spans[2].style.transform = "none"
      })
    })
  }
})

// ===================================
// Navbar Scroll Effect
// ===================================
let lastScroll = 0
const navbar = document.getElementById("navbar")

window.addEventListener("scroll", () => {
  const currentScroll = window.pageYOffset

  // Add shadow on scroll
  if (currentScroll > 50) {
    navbar.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.15)"
  } else {
    navbar.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)"
  }

  lastScroll = currentScroll
})

// ===================================
// Form Validation
// ===================================
const contactForm = document.getElementById("contactForm")

if (contactForm) {
  const nameInput = document.getElementById("name")
  const emailInput = document.getElementById("email")
  const phoneInput = document.getElementById("phone")
  const messageInput = document.getElementById("message")

  // Real-time validation
  nameInput.addEventListener("blur", () => validateName())
  emailInput.addEventListener("blur", () => validateEmail())
  phoneInput.addEventListener("blur", () => validatePhone())
  messageInput.addEventListener("blur", () => validateMessage())

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    // Validate all fields
    const isNameValid = validateName()
    const isEmailValid = validateEmail()
    const isPhoneValid = validatePhone()
    const isMessageValid = validateMessage()

    if (isNameValid && isEmailValid && isPhoneValid && isMessageValid) {
      // Show loading state
      const submitBtn = contactForm.querySelector(".btn-submit")
      const btnText = submitBtn.querySelector(".btn-text")
      const btnLoader = submitBtn.querySelector(".btn-loader")

      btnText.style.display = "none"
      btnLoader.style.display = "inline"
      submitBtn.disabled = true

      const formData = new FormData()
      formData.append("name", nameInput.value.trim())
      formData.append("email", emailInput.value.trim())
      formData.append("phone", phoneInput.value.trim())
      formData.append("message", messageInput.value.trim())

      try {
        const response = await fetch("contact-form.php", {
          method: "POST",
          body: formData,
        })

        const result = await response.json()

        if (result.success) {
          // Show success message
          document.getElementById("formSuccess").style.display = "block"
          document.getElementById("formSuccess").innerHTML = `
            <p>✓ ${result.message}</p>
          `

          // Reset form
          contactForm.reset()

          // Clear any error states
          document.querySelectorAll(".form-group").forEach((group) => {
            group.classList.remove("error")
          })
          document.querySelectorAll(".error-message").forEach((error) => {
            error.textContent = ""
          })

          // Hide success message after 5 seconds
          setTimeout(() => {
            document.getElementById("formSuccess").style.display = "none"
          }, 5000)
        } else {
          throw new Error(result.message)
        }
      } catch (error) {
        document.getElementById("formSuccess").style.display = "block"
        document.getElementById("formSuccess").innerHTML = `
          <p style="background-color: #fee2e2; border-color: #dc2626; color: #991b1b;">
            ✗ ${error.message || "Възникна грешка при изпращане на съобщението. Моля, опитайте отново или се свържете с нас директно."}
          </p>
        `

        console.error("Form submission error:", error)

        // Hide error message after 5 seconds
        setTimeout(() => {
          document.getElementById("formSuccess").style.display = "none"
        }, 5000)
      } finally {
        // Reset button state
        btnText.style.display = "inline"
        btnLoader.style.display = "none"
        submitBtn.disabled = false
      }
    }
  })
}

// ===================================
// Validation Functions
// ===================================
function validateName() {
  const nameInput = document.getElementById("name")
  const nameError = document.getElementById("nameError")
  const nameValue = nameInput.value.trim()

  if (nameValue === "") {
    showError(nameInput, nameError, "Името е задължително")
    return false
  } else if (nameValue.length < 2) {
    showError(nameInput, nameError, "Името трябва да бъде поне 2 символа")
    return false
  } else if (nameValue.length > 50) {
    showError(nameInput, nameError, "Името не може да бъде повече от 50 символа")
    return false
  } else if (!/^[a-zA-Zа-яА-Я\s]+$/.test(nameValue)) {
    showError(nameInput, nameError, "Името може да съдържа само букви и интервали")
    return false
  } else {
    clearError(nameInput, nameError)
    return true
  }
}

function validateEmail() {
  const emailInput = document.getElementById("email")
  const emailError = document.getElementById("emailError")
  const emailValue = emailInput.value.trim()
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

  if (emailValue === "") {
    showError(emailInput, emailError, "Имейлът е задължителен")
    return false
  } else if (!emailRegex.test(emailValue)) {
    showError(emailInput, emailError, "Моля, въведете валиден имейл адрес")
    return false
  } else if (emailValue.length > 100) {
    showError(emailInput, emailError, "Имейлът не може да бъде повече от 100 символа")
    return false
  } else {
    clearError(emailInput, emailError)
    return true
  }
}

function validatePhone() {
  const phoneInput = document.getElementById("phone")
  const phoneError = document.getElementById("phoneError")
  const phoneValue = phoneInput.value.trim()
  const phoneRegex = /^[\d\s\-()]+$/
  const digitsOnly = phoneValue.replace(/\D/g, "")

  if (phoneValue === "") {
    showError(phoneInput, phoneError, "Телефонният номер е задължителен")
    return false
  } else if (!phoneRegex.test(phoneValue)) {
    showError(phoneInput, phoneError, "Моля, въведете валиден телефонен номер")
    return false
  } else if (digitsOnly.length < 9) {
    showError(phoneInput, phoneError, "Телефонният номер трябва да бъде поне 9 цифри")
    return false
  } else if (digitsOnly.length > 15) {
    showError(phoneInput, phoneError, "Телефонният номер не може да бъде повече от 15 цифри")
    return false
  } else {
    clearError(phoneInput, phoneError)
    return true
  }
}

function validateMessage() {
  const messageInput = document.getElementById("message")
  const messageError = document.getElementById("messageError")
  const messageValue = messageInput.value.trim()

  if (messageValue === "") {
    showError(messageInput, messageError, "Съобщението е задължително")
    return false
  } else if (messageValue.length < 10) {
    showError(messageInput, messageError, "Съобщението трябва да бъде поне 10 символа")
    return false
  } else if (messageValue.length > 1000) {
    showError(messageInput, messageError, "Съобщението не може да бъде повече от 1000 символа")
    return false
  } else {
    clearError(messageInput, messageError)
    return true
  }
}

function showError(input, errorElement, message) {
  input.parentElement.classList.add("error")
  errorElement.textContent = message
}

function clearError(input, errorElement) {
  input.parentElement.classList.remove("error")
  errorElement.textContent = ""
}

// ===================================
// Smooth Scroll for Anchor Links
// ===================================
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      const offsetTop = target.offsetTop - 80 // Account for sticky navbar
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      })
    }
  })
})

// ===================================
// Intersection Observer for Animations
// ===================================
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1"
      entry.target.style.transform = "translateY(0)"
    }
  })
}, observerOptions)

// Observe service cards and other elements
document.addEventListener("DOMContentLoaded", () => {
  const animatedElements = document.querySelectorAll(".service-card, .stat-item")
  animatedElements.forEach((el) => {
    el.style.opacity = "0"
    el.style.transform = "translateY(30px)"
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease"
    observer.observe(el)
  })
})
