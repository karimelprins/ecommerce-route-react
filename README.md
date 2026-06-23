# FreshCart Pro — React E-commerce

A professional React e-commerce portfolio project inspired by the Route Academy demo and built with the Route E-commerce API.

## Overview

FreshCart Pro is a complete frontend e-commerce application focused on real-world React skills: API integration, authentication, protected routes, cart management, wishlist, checkout flow, validation, loading states, error handling, and responsive UI.

## API

Base URL:

```txt
https://ecommerce.routemisr.com/api/v1
```

## Features

- Modern responsive homepage
- Products page with search, category filter, and sorting
- Product details page
- Categories page
- Brands page
- Register and login flow
- Token-based authentication
- Protected cart, wishlist, and checkout routes
- Add to cart
- Update cart item quantity
- Remove cart item
- Clear cart
- Wishlist add/remove
- Checkout session flow
- Toast notifications
- Form validation
- Skeleton loading states
- Empty states
- Error states with retry actions
- Realistic product badges, discounts, stock, and delivery notes
- Product quantity selector
- Coupon UI with demo coupon `KARIM10`
- Order summary with subtotal, discount, shipping, and total
- Payment method selection
- Order success page
- Professional footer and newsletter section
- Clean folder structure

## Tech Stack

- React
- Vite
- React Router DOM
- JavaScript
- CSS3
- REST API
- Lucide React icons

## Folder Structure

```txt
src/
  components/
  context/
  pages/
  services/
  utils/
```

## Main API endpoints used

```txt
GET    /products
GET    /products/:id
GET    /categories
GET    /brands
POST   /auth/signup
POST   /auth/signin
GET    /cart
POST   /cart
PUT    /cart/:productId
DELETE /cart/:productId
GET    /wishlist
POST   /wishlist
DELETE /wishlist/:productId
POST   /orders/checkout-session/:cartId
```

## Run Locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Environment

Create `.env` from `.env.example` if needed:

```env
VITE_API_BASE_URL=https://ecommerce.routemisr.com/api/v1
```

## Portfolio Value

This project demonstrates practical frontend skills required for junior React roles, including API integration, component architecture, authentication, protected routes, state management, validation, responsive design, and user experience polish.

## Author

Karim Ehab Mohamed

- GitHub: https://github.com/karimelprins
- LinkedIn: https://www.linkedin.com/in/karim-ehab-4a10902a6
- Email: karimehabmohamedmohamed@gmail.com


## Latest Premium UX Upgrade

- Wishlist heart toggle: white when inactive, red when active, second click removes from wishlist.
- Animated premium homepage hero.
- Auto-playing category slider powered by API categories.
- Cleaner, darker, modern visual system.
- Removed generic filler sections and replaced them with conversion-focused store sections.
- Upgraded product cards with stronger visual hierarchy.
