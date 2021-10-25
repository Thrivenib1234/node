const express = require('express')
const mysql = require('mysql')
const multer = require('multer')
const bodyParser = require("body-parser");
const cors = require('cors');
const dotenv = require('dotenv')

dotenv.config();

const app = express()
app.use(cors());
const PORT = 3002

app.listen(PORT, () => {
    console.log(`HEB listing port ${PORT}.`)
})

app.use(bodyParser.json()), app.use(bodyParser.urlencoded({ extended: !0 })),

app.use('/uploads', express.static(__dirname + '/uploads'))

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "OPTIONS, GET, POST, PUT, PATCH, DELETE"
    );
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

var con = mysql.createConnection({
    connectionLimit: 20,
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'game',
    multipleStatements: true
});

con.connect(function (err) {
    if (err) {
        console.log('error occured while connecting' + err);
    } else {
        console.log('connection created with Mysql successfully');
    }
});


app.get("/details",(req,res)=>{
    const{userid}=req.body
    con.query("SELECT * FROM user_details where userid='"+userid+"'",(er,rs)=>{
        if(er){
            console.log(er)
        }else{
            res.status(200).json({status:true,message:'Fetch user data successfully',data:rs})
        }
    })
})

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, './uploads')
    },
    filename: function (req, file, callback) {
      //console.log(file)
      filep = file.fieldname + '-' + __dirname + "/uploads/" + file.originalname;
      let ts1 = Date.now();
  
      let date_ob = new Date(ts1);
      let date = date_ob.getDate();
      let month = date_ob.getMonth() + 1;
      let year = date_ob.getFullYear();
  
      callback(null, year + "-" + month + "-" + date + file.originalname)
    }
  })

var upload = multer({ storage: storage });

app.put("/update",upload.any(),(req,res)=>{
    let ts2 = Date.now();
    let date_ob1 = new Date(ts2);
    let date = date_ob1.getDate();
    let month = date_ob1.getMonth() + 1;
    let year = date_ob1.getFullYear();
  
    var  u =`${process.env.upload_file}/uploads/`

    const{userid,user_name,user_email,total_orders}=req.body
    const user_image=u + year + "-" + month + "-" + date + req.files[0].originalname
    con.query("update user_details set user_name='"+user_name+"',user_email='"+user_email+"',total_orders='"+total_orders+"',user_image='"+user_image+"' where userid='"+userid+"'",(er,rs)=>{
        if(er){
            console.log(er)
        }else{
            res.status(200).json({status:true,message:'Fetch user data successfully'})
        }
    })
})


app.get("/image",(req,res)=>{
    const{userid}=req.body
    con.query("SELECT user_image FROM user_details where userid='"+userid+"'",(er,rs)=>{
        if(er){
            console.log(er)
        }else{
            res.status(200).json({status:true,message:'Fetch your image successfully',data:rs})
        }
    })
})

const storage1 = multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, './uploads')
    },
    filename: function (req, file, callback) {
      //console.log(file)
      filep = file.fieldname + '-' + __dirname + "/uploads/" + file.originalname;
      let ts1 = Date.now();
  
      let date_ob = new Date(ts1);
      let date = date_ob.getDate();
      let month = date_ob.getMonth() + 1;
      let year = date_ob.getFullYear();
  
      callback(null, year + "-" + month + "-" + date + file.originalname)
    }
})

var upload1 = multer({ storage: storage1});

app.post("/insert",upload1.any(),(req,res)=>{
    let ts2 = Date.now();
    let date_ob1 = new Date(ts2);
    let date = date_ob1.getDate();
    let month = date_ob1.getMonth() + 1;
    let year = date_ob1.getFullYear();
    var  u =`${process.env.upload_file}/uploads/`
    const user_image=u + year + "-" + month + "-" + date + req.files[0].originalname
    const{user_name, user_email,user_password,total_orders}=req.body
  con.query("insert into user_details (user_name, user_email,user_password,user_image,total_orders)values('"+user_name+"', '"+user_email+"','"+user_password+"','"+user_image+"',"+total_orders+")",(er,rs)=>{
        if(er){
            console.log(er)
        }else{
            res.status(200).json({status:true,message:'Insert your data successfully'})
        }
    })
})

app.delete("/delete",(req,res)=>{
    const{userid}=req.body
    con.query("delete  FROM user_details where userid='"+userid+"'",(er,rs)=>{
        if(er){
            console.log(er)
        }else{
            res.status(200).json({status:true,message:'deleted  user data successfully'})
        }
    })
})


