//libraries
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());

const sqlite3 = require("sqlite3").verbose();

let db = new sqlite3.Database("data.db", (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Connected to the data.db SQlite database.");
});

db.run(
  `CREATE TABLE IF NOT EXISTS users (
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    email TEXT NOT NULL
);`,
  (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log("users table created successfully.");
  }
);

//Everything from recipe
//db.run('DROP TABLE  connect_bases');
//db.run('DROP TABLE IF EXISTS categories');

db.run(
  `CREATE TABLE IF NOT EXISTS recipes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user TEXT NOT NULL,
    przepis_json TEXT NOT NULL
    
);`,
  (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log("recipes table created successfully.");
  }
);

db.run(
  `CREATE TABLE IF NOT EXISTS activities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    activity Text not null
);`,
  (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log("activities table created successfully.");
  }
);

db.run(
  `CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product Text not null,
    product_category Text not null
);`,
  (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log("products table created successfully.");
  }
);

const products = [
  { product: "Milk", product_category: "Dairy" },
  { product: "Chicken meat", product_category: "Meat" },
  { product: "Butter", product_category: "Dairy" },
  { product: "Pork chops", product_category: "Meat" },
  { product: "Cheese", product_category: "Dairy" },
  { product: "Beef steak", product_category: "Meat" },
  { product: "Yogurt", product_category: "Dairy" },
  { product: "Salmon", product_category: "Fish" },
  { product: "Eggs", product_category: "Dairy" },
  { product: "Shrimp", product_category: "Fish" },
  { product: "Cream", product_category: "Dairy" },
  { product: "Lamb chops", product_category: "Meat" },
  { product: "Sour cream", product_category: "Dairy" },
  { product: "Tuna", product_category: "Fish" },
  { product: "Ice cream", product_category: "Dessert" },
  { product: "Trout", product_category: "Fish" },
  { product: "Pudding", product_category: "Dessert" },
  { product: "Mackerel", product_category: "Fish" },
  { product: "Cottage cheese", product_category: "Dairy" },
  { product: "Crab", product_category: "Fish" },
  { product: "Gouda", product_category: "Dairy" },
  { product: "Lobster", product_category: "Fish" },
  { product: "Cheddar", product_category: "Dairy" },
  { product: "Oysters", product_category: "Fish" },
  { product: "Parmesan", product_category: "Dairy" },
];

db.get("SELECT COUNT(*) AS count FROM products", (err, row) => {
  var rowCount = 1;
  if (err) {
    console.error(err.message);
    var rowCount = 0;
  } else {
    var rowCount = row.count;
  }

  if (rowCount === 0) {
    products.forEach((product) => {
      db.run(
        "INSERT INTO products (product, product_category) VALUES (?, ?)",
        [product.product, product.product_category],
        function (err) {
          if (err) {
            return console.log(err.message);
          }
          console.log(`A row has been inserted with rowid ${this.lastID}`);
        }
      );
    });
  }
});

db.get("SELECT COUNT(*) AS count FROM products", (err, row) => {
  var rowCount = 1;
  if (err) {
    console.error(err.message);
    var rowCount = 0;
  } else {
    var rowCount = row.count;
  }
  if (rowCount === 0) {
    db.run(
      `INSERT INTO activities(activity) VALUES ('baking'), ('cooking'), ('grilling'), ('roasting'), ('steaming'), ('boiling'), ('frying'), ('sauteing'), ('poaching'), ('smoking');`,
      (err) => {
        if (err) {
          return console.error(err.message);
        }
        console.log("Records inserted successfully.");
      }
    );
  }
});

db.run(
  `CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category Text not null,
  UNIQUE(category)
);`,
  (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log("categories table created successfully.");
  }
);

db.get("SELECT COUNT(*) AS count FROM categories", (err, row) => {
  var rowCount = 1;
  if (err) {
    console.error(err.message);
    var rowCount = 0;
  } else {
    var rowCount = row.count;
  }
  if (rowCount === 0) {
    db.run(
      `INSERT INTO categories(category) VALUES ('Dairy'), ('Meat'), ('Fish'), ('Dessert');`,
      (err) => {
        if (err) {
          return console.error(err.message);
        }
        console.log("Records inserted successfully.");
      }
    );
  }
});

db.close();

app.use(express.urlencoded({ extended: false }));
app.use(express.static("views"));
//check if password and login are correct and redirect to home page
app.post("/login", async (req, res) => {
  let founded = false;
  let db = new sqlite3.Database("data.db");
  db.all(`SELECT * FROM users`, (err, rows) => {
    rows.forEach((row) => {
      if (
        req.body.username === row.username &&
        req.body.password === row.password
      ) {
        let username = req.body.username;
        founded = true;
        db.close();

        res.redirect(`/homepage?username=${username}`);

        //res.redirect(`/AddDishList?username=${username}`);
      }
    });
    if (!founded) {
      db.close();
      res.redirect("/login");
    }
  });
});

app.post("/register", async (req, res) => {
  4;
  let db = new sqlite3.Database("data.db");

  db.run(
    `INSERT INTO users (username, password, email) VALUES (?, ?, ?)`,
    [req.body.username, req.body.password, req.body.email],
    (err) => {
      if (err) {
        console.log(err);
        console.log(req.body.username);
        res.redirect("/register");
      } else {
        db.close();
        res.redirect("/login");
      }
    }
  );
});

app.post("/addToDataBase", async (req, res) => {
  console.log(req.body.addCategory);
  if (req.body.addCategory !== "") {
    console.log("Mozna dodac kategorie");

    let db = new sqlite3.Database("data.db");

    //przed dodaniem do bazy porownaj z istniejacymi w niej
    const query = `SELECT COUNT(*) AS count FROM your_table_name WHERE category = ?`;

    db.run(
      `INSERT INTO categories (category) VALUES (?)`,
      [req.body.addCategory],
      (err) => {
        db.close();
      }
    );
  }
  res.redirect("/admin/addToDataBase");
});
app.post("/addToDataBase2", async (req, res) => {
  console.log(req.body.selectCategory, req.body.addProduct);
  if (req.body.addProduct !== "") {
    console.log("Mozna dodac produkt");

    let db = new sqlite3.Database("data.db");

    db.run(
      `INSERT INTO products (product, product_category) VALUES (?, ?)`,
      [req.body.addProduct, req.body.selectCategory],
      (err) => {
        db.close();
      }
    );
  }
  res.redirect("/admin/addToDataBase");
});

app.post("/addDishList", (req, res) => {
  let username = req.query.username;
  var id = JSON.stringify(req.body.currentlyeditingThisRecipe);
  console.log(username, id);

  let db = new sqlite3.Database("data.db");
  const jsonDataString = JSON.stringify(req.body.t);
  if (id == -1) {
    db.run(
      `INSERT INTO recipes (user, przepis_json) VALUES (?, ?)`,
      [username, jsonDataString],
      (err) => {
        db.close();
      }
    );
  } else {
    var query = `
  REPLACE INTO recipes (id, user, przepis_json)
  VALUES (?, ?, ?)`;

    db.run(query, [id, username, jsonDataString], function (err) {
      if (err) {
        console.error(err.message);
      } else {
        console.log("Row replaced successfully");
      }
    });
  }

  res.send("Data received successfully");
});

app.post("/transportIntoDishList", (req, res) => {
  var username = req.query.username;
  console.log(username);

  res.redirect("/addDishList?username=" + username);
});

app.get("/", (req, res) => {
  res.render("index.ejs"); //create template for html (frontend)
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.get("/admin/addToDataBase", (req, res) => {
  const username = req.query.username;

  const db = new sqlite3.Database("data.db");

  db.all("SELECT product, product_category FROM products", (err, result) => {
    if (err) throw err;
    const productsData = result.map((row) => ({
      product: row.product,
      product_category: row.product_category,
    }));

    db.all("SELECT category FROM categories", (err, result) => {
      if (err) throw err;
      const categoriesData = result.map((row) => ({
        category: row.category,
      }));
      res.render("addToDataBase.ejs", {
        username: username,
        category: JSON.stringify(categoriesData),
        products: JSON.stringify(productsData),
      });
    });
  });
});

app.get("/homepage", (req, res) => {
  const username = req.query.username;

  const db = new sqlite3.Database("data.db");

  db.all("SELECT user, przepis_json, id FROM recipes", [], (err, result) => {
    if (err) throw err;
    const recipesData = result
      .filter((row) => row.user === req.query.username)
      .map((row) => ({
        przepis_json: row.przepis_json,
        id: String(row.id),
        user: row.user,
      }));
    //console.log(recipesData);
    res.render("homepage.ejs", {
      username: username,
      recipes: JSON.stringify(recipesData),
    });
  });
});

app.get("/AddDishList", (req, res) => {
  //const processedData = req.session.processedData;
  var username = req.query.username;
  var id2 = req.query.idToCheck;

  var editableJSON = '"asd"';
  var newId = -1;

  const db = new sqlite3.Database("data.db");

  if (typeof id2 !== "undefined") {
    db.get(
      "SELECT przepis_json FROM recipes WHERE id = ?",
      [id2],
      (err, row) => {
        if (err) {
          console.error(err.message);
        } else {
          editableJSON = row.przepis_json;
          console.log(editableJSON);
        }
      }
    );
    newId = id2;
  }

  db.all("SELECT activity FROM activities", [], (err, activities) => {
    if (err) {
      return console.log(err.message);
    }
    const activitiesData = activities.map((row) => ({
      activity: row.activity,
    }));

    db.all("SELECT product, product_category FROM products", (err, result) => {
      if (err) throw err;
      const productsData = result.map((row) => ({
        product: row.product,
        product_category: row.product_category,
      }));

      db.all("SELECT category FROM categories", (err, result) => {
        if (err) throw err;
        const categoriesData = result.map((row) => ({
          category: row.category,
        }));

        res.render("AddDishList.ejs", {
          username,
          id: newId,
          editJson: editableJSON,
          activities: JSON.stringify(activitiesData),
          products: JSON.stringify(productsData),
          categories: JSON.stringify(categoriesData),
        });
      });
    });
  });
});

app.get("/selectRecipe", (req, res) => {
  var id2 = req.query.idToCheck;
  var username = req.query.username;
  var przepis = "xD";

  const db = new sqlite3.Database("data.db");
  db.get("SELECT przepis_json FROM recipes WHERE id = ?", [id2], (err, row) => {
    if (err) {
      console.error(err.message);
    } else {
      przepis = String(row.przepis_json);

      res.render("recipeIndividualSteps.ejs", { przepis, username });
    }
  });
});

app.post("/ImportDish", (req, res) => {
  const jsonDataString = req.body.replacedData;

  const username = req.body.username;
  //console.log(jsonDataString, username);

  let db = new sqlite3.Database("data.db");

  db.run(
    `INSERT INTO recipes (user, przepis_json) VALUES (?, ?)`,
    [username, jsonDataString],
    (err) => {
      db.close();
    }
  );

  // db.all('SELECT user, przepis_json, id FROM recipes', (err, result) => {
  //   if (err) throw err;

  //   result.forEach(row => {
  //     console.log(row.user, row.przepis_json, row.id);
  //   });
  // });

  res.send("Data received successfully");
});

app.get("/admin", (req, res) => {
  res.render("admin.ejs");
});

app.post("/adminPost", (req, res) => {
  const login = req.body.login;
  const password = req.body.password;

  if (login == "admin" && password == "admin") {
    res.redirect("/admin/addToDataBase");
  } else {
    res.redirect("/admin");
  }
});

app.post("/DeletetDish", (req, res) => {
  var idToDelete = req.body.idToDelete;

  console.log(idToDelete);

  let db = new sqlite3.Database("data.db");

  db.run(`DELETE FROM recipes where id = (?)`, [idToDelete], (err) => {
    db.close();
  });

  res.redirect("/admin/addToDataBase");
});

app.post("/deleteCategory", async (req, res) => {
  var category = req.body.selectCategoryToDelete;
  console.log(category);

  if (category != "") {
    let db = new sqlite3.Database("data.db");
    db.run(`DELETE FROM categories where category = (?)`, [category], (err) => {
      db.close();
    });
    res.redirect("/admin/addToDataBase");
  }
});

app.post("/deleteProduct", async (req, res) => {
  var category = req.body.selectCategoryToDelete2;
  var product = req.body.selectProductToDelete;
  console.log(product, category);
  if (product != "" && category != "") {
    let db = new sqlite3.Database("data.db");
    db.run(
      `DELETE FROM products where product_category = (?) AND product = (?)`,
      [category, product],
      (err) => {
        db.close();
      }
    );
    res.redirect("/admin/addToDataBase");
  }
});

app.listen(3000);
