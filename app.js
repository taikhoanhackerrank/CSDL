//import modules, models and others
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const morgan = require('morgan');
const hbs = require('hbs');
const cors = require('cors');
const { sequelize } = require('./models/DB');

//setting up the server
const app = express();
const port = 3000;

//configure body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//parse json
// app.use(express.json());

//configure session middleware
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));
  
//configure passport middleware
app.use(passport.initialize());
app.use(passport.session());
  
//configure Passport
require('./config/passport-config')(passport);

//enable CORS for all routes
app.use(cors());
//middleware for logging out request info
app.use(morgan('tiny'));
//serve html, css, img
app.use(express.static(path.join(__dirname, 'views', 'public')));
app.use('/node_modules', express.static('node_modules'));
// Serve static files from the 'models' directory
// app.use('/models', express.static('models'));
//set the MIME type for JavaScript files
app.use((req, res, next) => {
    if (req.url.endsWith('.js')) {
      res.type('text/javascript');
    }
    next();
  });

// Set the view engine to hbs
app.set('view engine', 'hbs');

// Register the partials directory
hbs.registerPartials(path.join(__dirname, 'views', 'partials'));

// Define the JSON.stringify helper
hbs.registerHelper('stringify', function(obj) {
  return JSON.stringify(obj);
});

//import models
const User  = require('./models/users');
const Brand  = require('./models/brands');
const Product = require('./models/products');
const Blog = require('./models/blogs');
const Payment = require('./models/payments');
const Order = require('./models/orders');
const OrderItem = require('./models/orderItems');
const Inventory = require('./models/inventory');
const Category = require('./models/categories');
const Cart = require('./models/carts');
const CartItem = require('./models/cartItems');
require('./models/DB');

    //define relationships between models
    Brand.hasMany(Product, { foreignKey: 'brand_id' });
    Product.belongsTo(Brand, { foreignKey: 'brand_id' });

    Category.hasMany(Product, { foreignKey: 'category_id' });
    Product.belongsTo(Category, { foreignKey: 'category_id' });

    User.hasMany(Order, { foreignKey: 'user_id' });
    Order.belongsTo(User, { foreignKey: 'user_id' });

    Order.hasMany(OrderItem, { foreignKey: 'order_id'});
    OrderItem.belongsTo(Order, { foreignKey: 'order_id'});

    Product.hasMany(OrderItem, { foreignKey: 'product_id'});
    OrderItem.belongsTo(Product, { foreignKey: 'product_id'});

    Product.hasMany(Inventory, { foreignKey: 'product_id'});
    Inventory.belongsTo(Product, { foreignKey: 'product_id'});

    User.hasOne(Cart, { foreignKey: 'user_id'});
    Cart.belongsTo(User, { foreignKey: 'user_id'});

    Cart.hasMany(CartItem, { foreignKey: 'cart_id'});
    CartItem.belongsTo(Cart, { foreignKey: 'cart_id'});

    Product.hasMany(CartItem, { foreignKey: 'product_id'});
    CartItem.belongsTo(Product, { foreignKey: 'product_id'});

    Order.hasMany(Payment, { foreignKey: 'order_id'});
    Payment.belongsTo(Order, { foreignKey: 'order_id'});

//importing routers
const homeRouter = require('./routers/homeRouter');
const shopRouter = require('./routers/shopRouter');
const blogRouter = require('./routers/blogRouter');
const aboutRouter = require('./routers/aboutRouter');
const contactRouter = require('./routers/contactRouter');
const productdetailsRouter = require('./routers/product-detailsRouter');
const usersRouter = require('./routers/usersRouter');
const productsRouter = require('./routers/productsRouter');
const brandsRouter = require('./routers/brandsRouter');
const categoriesRouter = require('./routers/categoriesRouter');
const cartRouter = require('./routers/cartRouter');
const inventoryRouter = require('./routers/inventoryRouter');
const paymentsRouter = require('./routers/paymentsRouter');
const ordersRouter = require('./routers/ordersRouter');
const authRouter = require('./routers/authRouter');

// configure routes
app.use('/', usersRouter);
app.use('/api/brands', brandsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/inventory', inventoryRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/orders', ordersRouter);
app.use('/', productsRouter);
app.use('/', shopRouter);
app.use('/', aboutRouter);
app.use('/', blogRouter);
app.use('/', contactRouter);
app.use('/', productdetailsRouter);
app.use('/', cartRouter);
app.use('/', authRouter);
app.use('/', homeRouter);

//define error handling middleware function
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

//connect to database
sequelize.authenticate()
  .then(() => {
    console.log('Database connected');

    //sync with db tables
    sequelize.sync()
      .then(() => {
        console.log('Database and table synced successfully!');
        //start server
        app.listen(port, () => {
          console.log(`Server is listening on port ${port}...`);
        });
      })
      .catch(err => {
        console.error('Error syncing database and table:', err);
      });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

