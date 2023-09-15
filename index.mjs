import express from "express";
import * as path from "path";
import hbs from "express-handlebars";
import cookieParser from "cookie-parser";
import * as Console from "console";

const rootDir = process.cwd();
const port = 3000;
const app = express();
let history=[];

const coffes= [
  {name: "Кунтик Футбол", image: "/static/img/kuntikFootbal.jpg", price: 10,volume:"XXXL",weight:120 },
  { name: "Кунтик Девушка", image: "/static/img/kuntikGirl.jpg", price: 15 ,volume:"XL",weight:20},
  { name: "Кунтик Гусь", image: "/static/img/kuntikGouse.jpeg", price: 13,volume:"XL",weight:70 },
  { name: "Кунтик Маска", image: "/static/img/kuntikMask.jpg", price: 14,volume:"XL",weight:50 },
  { name: "Кунтик Клубника", image: "/static/img/kuntikStrawberry.jpg", price: 7,volume:"XL",weight:10 },
  { name: "Кунтик Винни Пух", image: "/static/img/kuntikVinniPuh.jpg", price: 9,volume:"XXL",weight:100 }
];
const cart=[];
const users = {"Аноним":[]};
let username="Аноним";
// Выбираем в качестве движка шаблонов Handlebars
app.use(cookieParser())
app.set("view engine", "hbs");
app.use('/static', express.static('static'))
// Настраиваем пути и дефолтный view
app.engine(
  "hbs",
  hbs({
    extname: "hbs",
    defaultView: "default",
    layoutsDir: path.join(rootDir, "/views/layouts/"),
    partialsDir: path.join(rootDir, "/views/partials/"),
    helpers: {
      get_sum: function (items) {
        let x = 0;
        for (let i = 0; i < items.length; i++)
          x += items[i].price;
        return x;
      },
      get_order: function (items) {
        let vol = 0;
	let wei=0;
	 const sizes = {
         'S': 1,
         'M': 2,
         'L': 3,
         'XL': 4,
         'XXL': 5,
         'XXXL': 6,
         'XXXXL': 7
        };
         const numbers = {
         1:'S',
         2: 'M',
         3:'L',
         4: 'XL',
         5: 'XXL',
         6:'XXXL',
         7: 'XXXXL'
        };
       for (let i = 0; i < items.length; i++) 
        {
         if(sizes[items[i].volume]>vol)
		vol=sizes[items[i].volume]
	wei+=items[i].weight
        }
        if (vol>4 || wei>150)
		return "Доставка на вагонетке, вес товаров:"+String(wei)+" | максимальный размер:"+numbers[vol]
	else
		return "Доставка на шарах, вес товаров:"+String(wei)+" | максимальный размер:"+numbers[vol]
      }
      }
  })
);

app.get("/", (_, res) => {
  res.sendFile(path.join(rootDir, "/static/html/index.html"));
  res.redirect('../menu');
});

app.get("/menu", (_, res) => {
  res.render("menu", {
    layout: "default",
    items: coffes,
    title:"Меню",
  });
});

app.get("/cart", (req, res) => {
  res.render("cart", {
    layout: "default",
    items: users[username],
    title:"Корзина",
  });
});

app.get("/login", (req, res) => {
  username = req.query.username || req.cookies.username ||  "Аноним";
  if (!(username in users))
    users[username]=[];
  console.log(users)
  res.cookie("username", username);
  res.render("login", {
    layout: "default",
    username: username,
    title:"Личный кабинет",
  });

});

app.get("/history", (req, res) => {

  res.render("history", {
    layout: "default",
    history: history,
  });

});

app.get("/buy/:name", (req, res) => {
  coffes.forEach(element => {
    if(element.name===req.params.name)
      users[username].push(element);
  });
  res.redirect("/menu");
});

app.post("/cart", (req, res) => {
  let userCoffes=users[username].slice(0);
  history.push( {name: username, items:userCoffes});
  users[username].length=0;
  res.redirect("/menu");
});



app.listen(port, () => console.log(`App listening on port ${port}`));