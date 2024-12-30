const express = require('express')
const fs = require('fs')
const path = require('path')
const app = express()
app.use(express.json())
const PORT = 3000
const USERS_FILE = path.join(__dirname, 'users.jsonl')
const PRODUCTS_FILE = path.join(__dirname, 'products.jsonl')
const CART_FILE = path.join(__dirname, 'carts.jsonl')

function readUsers() {
  if (!fs.existsSync(USERS_FILE)) {
    return []
  }
  const data = fs.readFileSync(USERS_FILE, 'utf8').trim()
  if (!data) {
    return []
  }
  return data.split('\n').map(line => JSON.parse(line))
}

function writeUsers(users) {
  const data = users.map(u => JSON.stringify(u)).join('\n')
  fs.writeFileSync(USERS_FILE, data)
}

function readProducts() {
  if (!fs.existsSync(PRODUCTS_FILE)) {
    return []
  }
  const data = fs.readFileSync(PRODUCTS_FILE, 'utf8').trim()
  if (!data) {
    return []
  }
  return data.split('\n').map(line => JSON.parse(line))
}

function writeProducts(products) {
  const data = products.map(p => JSON.stringify(p)).join('\n')
  fs.writeFileSync(PRODUCTS_FILE, data)
}

function readCarts() {
  if (!fs.existsSync(CART_FILE)) {
    return []
  }
  const data = fs.readFileSync(CART_FILE, 'utf8').trim()
  if (!data) {
    return []
  }
  return data.split('\n').map(line => JSON.parse(line))
}

function writeCarts(carts) {
  const data = carts.map(c => JSON.stringify(c)).join('\n')
  fs.writeFileSync(CART_FILE, data)
}

app.post('/users/signup', (req, res) => {
  const users = readUsers()
  const { username, password } = req.body
  if (!username || !password) {
    return res.status(400).json({ error: 'username과 password를 모두 입력하세요.' })
  }
  const exists = users.find(u => u.username === username)
  if (exists) {
    return res.status(400).json({ error: '이미 존재하는 사용자입니다.' })
  }
  const newUser = {
    id: Date.now().toString(),
    username,
    password,
    createdAt: new Date().toISOString()
  }
  users.push(newUser)
  writeUsers(users)
  res.json({ message: '회원가입 성공', user: { id: newUser.id, username: newUser.username } })
})

app.post('/users/login', (req, res) => {
  const users = readUsers()
  const { username, password } = req.body
  if (!username || !password) {
    return res.status(400).json({ error: 'username과 password를 모두 입력하세요.' })
  }
  const user = users.find(u => u.username === username && u.password === password)
  if (!user) {
    return res.status(401).json({ error: '로그인 실패' })
  }
  res.json({ message: '로그인 성공', user: { id: user.id, username: user.username } })
})

app.get('/products', (req, res) => {
  const products = readProducts()
  res.json(products)
})

app.post('/products', (req, res) => {
  const products = readProducts()
  const { name, price } = req.body
  if (!name || price == null) {
    return res.status(400).json({ error: '상품명과 가격을 모두 입력하세요.' })
  }
  const newProduct = {
    id: Date.now().toString(),
    name,
    price,
    createdAt: new Date().toISOString()
  }
  products.push(newProduct)
  writeProducts(products)
  res.json(newProduct)
})

app.get('/products/:id', (req, res) => {
  const products = readProducts()
  const product = products.find(p => p.id === req.params.id)
  if (!product) {
    return res.status(404).json({ error: '상품을 찾을 수 없습니다.' })
  }
  res.json(product)
})

app.put('/products/:id', (req, res) => {
  const products = readProducts()
  const index = products.findIndex(p => p.id === req.params.id)
  if (index === -1) {
    return res.status(404).json({ error: '상품을 찾을 수 없습니다.' })
  }
  const { name, price } = req.body
  products[index].name = name || products[index].name
  products[index].price = price != null ? price : products[index].price
  writeProducts(products)
  res.json(products[index])
})

app.delete('/products/:id', (req, res) => {
  const products = readProducts()
  const newProducts = products.filter(p => p.id !== req.params.id)
  if (newProducts.length === products.length) {
    return res.status(404).json({ error: '상품을 찾을 수 없습니다.' })
  }
  writeProducts(newProducts)
  res.json({ success: true })
})

app.get('/cart', (req, res) => {
  const carts = readCarts()
  const { userId } = req.query
  if (!userId) {
    return res.status(400).json({ error: 'userId 쿼리 파라미터가 필요합니다.' })
  }
  const userCart = carts.filter(c => c.userId === userId)
  res.json(userCart)
})

app.post('/cart', (req, res) => {
  const carts = readCarts()
  const { userId, productId, quantity } = req.body
  if (!userId || !productId || !quantity) {
    return res.status(400).json({ error: 'userId, productId, quantity를 모두 입력하세요.' })
  }
  const existing = carts.find(c => c.userId === userId && c.productId === productId)
  if (existing) {
    existing.quantity += quantity
    writeCarts(carts)
    return res.json(existing)
  }
  const newCartItem = {
    id: Date.now().toString(),
    userId,
    productId,
    quantity
  }
  carts.push(newCartItem)
  writeCarts(carts)
  res.json(newCartItem)
})

app.put('/cart/:id', (req, res) => {
  const carts = readCarts()
  const index = carts.findIndex(c => c.id === req.params.id)
  if (index === -1) {
    return res.status(404).json({ error: '장바구니 아이템을 찾을 수 없습니다.' })
  }
  const { quantity } = req.body
  if (quantity == null) {
    return res.status(400).json({ error: 'quantity가 필요합니다.' })
  }
  carts[index].quantity = quantity
  writeCarts(carts)
  res.json(carts[index])
})

app.delete('/cart/:id', (req, res) => {
  const carts = readCarts()
  const newCarts = carts.filter(c => c.id !== req.params.id)
  if (newCarts.length === carts.length) {
    return res.status(404).json({ error: '장바구니 아이템을 찾을 수 없습니다.' })
  }
  writeCarts(newCarts)
  res.json({ success: true })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
