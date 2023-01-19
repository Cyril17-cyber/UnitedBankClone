require('dotenv').config();

const express = require('express');
const app = express();
const enforce = require('express-sslify');
app.use(enforce.HTTPS({trustProtoHeader: true}));
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const UserOTPVerification = require('./models/UserOTPVerification');
const Accounts = require('./models/Accounts');
const Transfers = require('./models/Transfers');
var fs = require('fs');
var path = require('path'); 
const nodemailer = require('nodemailer');
const multer = require('multer');
const transpoter = require('./models/Nodemailersettings');
const Logins = require('./models/LoginActivity');

const mongoUrl = process.env.MONGOURL;

mongoose.connect(mongoUrl,
    { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
        if (err) {
            console.log(err)
        } else {
            console.log('connected');
        }
    });
//mongoose.set('useCreateIndex', true);


const date = new Date().getFullYear();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));


app.set('view engine', 'ejs');

const saltRounds = Number(process.env.SALTROUNDS);

const storage = multer.diskStorage({ 

    destination: (req, file, cb) => { 

        cb(null, 'uploads') 

    }, 

    filename: (req, file, cb) => { 

        cb(null, file.fieldname + '-' + Date.now()) 

    } 
}); 

const credits = [
    {
        transactionType: "Deposit",
        from: "631372394142",
        name: "Deployment Bonus",
        bank: "United Bank",
        amount: "35896",
        description: "Defense Finance and Accounting Services > Military Members > Payentitlements > Pay Tables > Deployment bounus > CO.",
        date: "11/29/2021, 3:09:48 PM",
        link: "HuakJsSJAsdfd"
    },
    {
        transactionType: "Deposit",
        from: "631372394142",
        name: "Annual Pay",
        bank: "United Bank",
        amount: "63024",
        description: "Defense Finance and Accounting Services > Military Members > Payentitlements > Pay Tables > Deployment bounus > CO.",
        date: "11/23/2021, 4:45:39 PM",
        link: "jkdseHFIaskdl"
    },
    {
        transactionType: "Deposit",
        from: "631372394142",
        name: "Annual Pay",
        bank: "United Bank",
        amount: "62935",
        description: "Defense Finance and Accounting Services > Military Members > Payentitlements > Pay Tables > Deployment bounus > CO.",
        date: "11/25/2020, 4:23:58 PM",
        link: "judBIslNUsa"
    },
    {
        transactionType: "Deposit",
        from: "874325643476",
        name: "Crypto withdrawal (BTC)",
        bank: "United Bank",
        amount: "954200",
        description: "BTC to USD conversion and withdrawal",
        date: "05/08/2020, 7:29:41 PM",
        link: "HuakJsSJAsdfd"
    },
    {
        transactionType: "Deposit",
        from: "631372394142",
        name: "Annual Pay",
        bank: "United Bank",
        amount: "62929",
        description: "Defense Finance and Accounting Services > Military Members > Payentitlements > Pay Tables > Deployment bounus > CO.",
        date: "11/30/2019, 11:12:41 AM",
        link: "hsjkBkiakjH183"
    },
    {
        transactionType: "Deposit",
        from: "874325643476",
        name: "Crypto withdrawal (BTC)",
        bank: "United Bank",
        amount: "523600",
        description: "BTC to USD conversion and withdrawal",
        date: "01/18/2019, 8:35:53 PM",
        link: "kjlaoHVUs83"
    },
    {
        transactionType: "Deposit",
        from: "631372394142",
        name: "Annual Pay",
        bank: "United Bank",
        amount: "62937",
        description: "Defense Finance and Accounting Services > Military Members > Payentitlements > Pay Tables > Deployment bounus > CO.",
        date: "11/21/2018, 9:38:58 AM",
        link: "lksdjHGUlja"
    },
    {
        transactionType: "Deposit",
        from: "874325643476",
        name: "Crypto withdrawal (BTC)",
        bank: "United Bank",
        amount: "40600",
        description: "BTC to USD conversion and withdrawal",
        date: "12/15/2017, 1:59:43 PM",
        link: "jsaliBBKakle"
    },
    {
        transactionType: "Deposit",
        from: "631372394142",
        name: "Annual Pay",
        bank: "United Bank",
        amount: "62940",
        description: "Defense Finance and Accounting Services > Military Members > Payentitlements > Pay Tables > Deployment bounus > CO.",
        date: "11/25/2017, 5:52:18 PM",
        link: "alsjewoYEI47328"
    },
    {
        transactionType: "Deposit",
        from: "631372394142",
        name: "Annual Pay",
        bank: "United Bank",
        amount: "62936",
        description: "Defense Finance and Accounting Services > Military Members > Payentitlements > Pay Tables > Deployment bounus > CO.",
        date: "11/23/2016, 9:19:14 PM",
        link: "lksdjHGUlja"
    },
    {
        transactionType: "Deposit",
        from: "874325643476",
        name: "Crypto withdrawal (BTC)",
        bank: "United Bank",
        amount: "123260",
        description: "BTC to USD conversion and withdrawal",
        date: "06/19/2016, 11:06:32 AM",
        link: "hbklSFDJ7885"
    },
    {
        transactionType: "Deposit",
        from: "6388272672",
        name: "Bet Winnings",
        bank: "United Bank",
        amount: "408700",
        description: "Bet winning- FanDuel Sportsbook",
        date: "03/09/2016, 12:46:41 PM",
        link: "kjsaliwBUDI378"
    },
    {
        transactionType: "Deposit",
        from: "631372394142",
        name: "Deployment Bonus",
        bank: "United Bank",
        amount: "36240",
        description: "Defense Finance and Accounting Services > Military Members > Payentitlements > Pay Tables > Deployment bounus > CO.",
        date: "02/14/2016, 2:29:37 PM",
        link: "jkxgKHRAmnm456"
    },
    {
        transactionType: "Deposit",
        from: "631372394142",
        name: "Monthly Basic Pay",
        bank: "United Bank",
        amount: "4730",
        description: "Defense Finance and Accounting Services > Military Members > Payentitlements > Pay Tables > Deployment bounus > CO.",
        date: "12/30/2015, 5:09:05 PM",
        link: "jkldsaVSIeu8432"
    },
    {
        transactionType: "Deposit",
        from: "874325643476",
        name: "Crypto withdrawal (BTC)",
        bank: "United Bank",
        amount: "26400",
        description: "BTC to USD conversion and withdrawal",
        date: "12/23/2015, 04:48:06 PM",
        link: "shg;kbnvgh2135"
    },
    {
        transactionType: "Deposit",
        from: "6388272672",
        name: "Bet Winnings",
        bank: "United Bank",
        amount: "322100",
        description: "Bet winning- FanDuel Sportsbook",
        date: "12/19/2015, 10:39:38 AM",
        link: "jdsklajdl^$327"
    },
    {
        transactionType: "Deposit",
        from: "631372394142",
        name: "Monthly Basic Pay",
        bank: "United Bank",
        amount: "4560",
        description: "Defense Finance and Accounting Services > Military Members > Payentitlements > Pay Tables > Deployment bounus > CO.",
        date: "11/29/2015, 5:21:31 PM",
        link: "dnIUsbc942"
    },
    {
        transactionType: "Deposit",
        from: "6388272672",
        name: "Bet Winnings",
        bank: "United Bank",
        amount: "104550",
        description: "Bet winning- FanDuel Sportsbook",
        date: "11/27/2015, 12:27:03 PM",
        link: "hskjalhVuweo^831"
    },
    {
        transactionType: "Deposit",
        from: "874325643476",
        name: "Crypto withdrawal (BTC)",
        bank: "United Bank",
        amount: "9600",
        description: "BTC to USD conversion and withdrawal",
        date: "11/10/2015, 01:34:06 PM",
        link: "xhjucHTEFAE3689"
    },
    {
        transactionType: "Deposit",
        from: "631372394142",
        name: "Monthly Basic Pay",
        bank: "United Bank",
        amount: "4552",
        description: "Defense Finance and Accounting Services > Military Members > Payentitlements > Pay Tables > Deployment bounus > CO.",
        date: "10/29/2015, 5:25:20 PM",
        link: "jaskue748329"
    },
    {
        transactionType: "Deposit",
        from: "6388272672",
        name: "Bet Winnings",
        bank: "United Bank",
        amount: "67450",
        description: "Bet winning- FanDuel Sportsbook",
        date: "10/19/2015, 11:06:12 AM",
        link: "lkjhdfm35GH"
    },
    {
        transactionType: "Deposit",
        from: "631372394142",
        name: "Monthly Basic Pay",
        bank: "United Bank",
        amount: "4549",
        description: "Defense Finance and Accounting Services > Military Members > Payentitlements > Pay Tables > Deployment bounus > CO.",
        date: "09/28/2015, 01:51:33 PM",
        link: "fgdkxrdHLK427"
    },
    {
        transactionType: "Deposit",
        from: "6388272672",
        name: "Bet Winnings",
        bank: "United Bank",
        amount: "456300",
        description: "Bet winning- FanDuel Sportsbook",
        date: "09/16/2015, 2:39:57 PM",
        link: "vgjcdfGHFDe8743"
    },
    {
        transactionType: "Deposit",
        from: "631372394142",
        name: "Monthly Basic Pay",
        bank: "United Bank",
        amount: "4550",
        description: "Defense Finance and Accounting Services > Military Members > Payentitlements > Pay Tables > Deployment bounus > CO.",
        date: "08/30/2015, 12:32:55 PM",
        link: "hbkhcGET98r"
    },
    {
        transactionType: "Deposit",
        from: "631372394142",
        name: "Monthly Basic Pay",
        bank: "United Bank",
        amount: "4550",
        description: "Defense Finance and Accounting Services > Military Members > Payentitlements > Pay Tables > Deployment bounus > CO.",
        date: "07/30/2015, 11:13:55 AM",
        link: "KJvsdjcjcv664534"
    },
    {
        transactionType: "Deposit",
        from: "631372394142",
        name: "Monthly Basic Pay",
        bank: "United Bank",
        amount: "4550",
        description: "Defense Finance and Accounting Services > Military Members > Payentitlements > Pay Tables > Deployment bounus > CO.",
        date: "06/29/2015, 3:48:35 PM",
        link: "blgjgxzsTf425"
    },
    {
        transactionType: "Deposit",
        from: "631372394142",
        name: "Monthly Basic Pay",
        bank: "United Bank",
        amount: "4549",
        description: "Defense Finance and Accounting Services > Military Members > Payentitlements > Pay Tables > Deployment bounus > CO.",
        date: "05/28/2015, 4:45:54 PM",
        link: "vjxSebgWf634"
    },
    {
        transactionType: "Deposit",
        from: "874325643476",
        name: "Crypto withdrawal (BTC)",
        bank: "United Bank",
        amount: "5400",
        description: "BTC to USD conversion and withdrawal",
        date: "04/16/2015, 2:28:57 PM",
        link: "gjfd#5ui7d63976"
    },
]

const debits = [
    {
        transactionType: "Debit",
        to: "8356253982",
        name: "CHARITY DONATIONS",
        bank: "Wells Fargo",
        amount: "7000",
        description: "Bi-Monthly Charity Donation for Throneroom Orphanage & Edctnl · Children's Homes",
        date: "10/29/2021, 12:31:39 PM",
        link: "jase8439HB"
    },
    {
        transactionType: "Local Transfer",
        to: "3882663728",
        name: "AMAZON.COM",
        bank: "JPMorgan Chase",
        amount: "1580",
        description: "Iphone 12 PRO MAX Purchase- Amazon.com",
        date: "09/08/2021, 3:25:46 PM",
        link: "HIkldoe2182"
    },
    {
        transactionType: "Local Transfer",
        to: "4783982773",
        name: "VA HOMES",
        bank: "Bank of America",
        amount: "491630",
        description: "2 bedroom unit in Mariner's Park 23318 Sesame Street L, Torrance, California 90502-3090 Purchase, PENDING BALANCE, upon tiling completion",
        date: "09/02/2021, 2:22:24 PM",
        link: "NKHokksa868"
    },
    {
        transactionType: "Debit",
        to: "8356253982",
        name: "CHARITY DONATIONS",
        bank: "Wells Fargo",
        amount: "7000",
        description: "Bi-Monthly Charity Donation for Throneroom Orphanage & Edctnl · Children's Homes",
        date: "08/28/2021, 6:20:15 PM",
        link: "ljaksjNIG439"
    },
    {
        transactionType: "Debit",
        to: "8356253982",
        name: "CHARITY DONATIONS",
        bank: "Wells Fargo",
        amount: "7000",
        description: "Bi-Monthly Charity Donation for Throneroom Orphanage & Edctnl · Children's Homes",
        date: "06/29/2021, 5:35:53 PM",
        link: "kjdaBEUW8327"
    },
    {
        transactionType: "Local Transfer",
        to: "5627299373",
        name: "Auto Trader",
        bank: "Bank of America",
        amount: "36970",
        description: "TOYOTA CAMRY XLE V6 model 2021 Purchase",
        date: "05/17/2021, 11:07:28 AM",
        link: "HJasklheR381"
    },
    {
        transactionType: "Debit",
        to: "8356253982",
        name: "CHARITY DONATIONS",
        bank: "Wells Fargo",
        amount: "7000",
        description: "Bi-Monthly Charity Donation for Throneroom Orphanage & Edctnl · Children's Homes",
        date: "04/28/2021, 2:40:39 PM",
        link: "skk823BHF"
    },
    {
        transactionType: "United Bank Transfer",
        to: "273970116",
        name: "COINBASE WALLET-JKD",
        bank: "MetaBank",
        amount: "341720",
        description: "Crypto(BTC) purchase",
        date: "03/29/2021, 4:52:22 PM",
        link: "GKskq9829nds"
    },
    {
        transactionType: "Local Transfer",
        to: "6377388282",
        name: "Eneba.com",
        bank: "SEPA",
        amount: "5650",
        description: "Razer gold digital gift card purchase $500 *11",
        date: "03/12/2021, 4:44:34 PM",
        link: "jklsdf2834Bs"
    },
    {
        transactionType: "Debit",
        to: "8356253982",
        name: "CHARITY DONATIONS",
        bank: "Wells Fargo",
        amount: "7000",
        description: "Bi-Monthly Charity Donation for Throneroom Orphanage & Edctnl · Children's Homes",
        date: "02/21/2021, 5:40:11 PM",
        link: "HJsKGsaklds"
    },
    {
        transactionType: "Debit",
        to: "8356253982",
        name: "CHARITY DONATIONS",
        bank: "Wells Fargo",
        amount: "7500",
        description: "Bi-Monthly Charity Donation for Throneroom Orphanage & Edctnl · Children's Homes",
        date: "12/29/2020, 3:33:47 PM",
        link: "sldkVGU6793"
    },
    {
        transactionType: "Debit",
        to: "8356253982",
        name: "CHARITY DONATIONS",
        bank: "Wells Fargo",
        amount: "7500",
        description: "Bi-Monthly Charity Donation for Throneroom Orphanage & Edctnl · Children's Homes",
        date: "10/31/2020, 6:04:04 AM",
        link: "NKslewjks43892"
    },
    {
        transactionType: "Debit",
        to: "8356253982",
        name: "CHARITY DONATIONS",
        bank: "Wells Fargo",
        amount: "7500",
        description: "Bi-Monthly Charity Donation for Throneroom Orphanage & Edctnl · Children's Homes",
        date: "08/30/2020, 12:46:44 PM",
        link: "NKBshskj4393"
    },
    {
        transactionType: "Debit",
        to: "8356253982",
        name: "CHARITY DONATIONS",
        bank: "Wells Fargo",
        amount: "7500",
        description: "Bi-Monthly Charity Donation for Throneroom Orphanage & Edctnl · Children's Homes",
        date: "06/28/2020, 02:53:06 PM",
        link: "sdahfkVUsu"
    },
    {
        transactionType: "Local Transfer",
        to: "3829746256",
        name: "NOVANT HEALTH UVA PRINCE WILLIAM MEDICAL CENTER (MANASSAS, VA)",
        bank: "Bank of America",
        amount: "97300",
        description: "COVID-19 DONATION Medical Equipment supply Aid",
        date: "05/16/2020, 2:31:37 PM",
        link: "KJKslehkas39u3"
    },
    {
        transactionType: "Local Transfer",
        to: "6377388282",
        name: "ENEBA.COM",
        bank: "SEPA",
        amount: "5050",
        description: "Razer gold digital gift card purchase $500 *10",
        date: "04/29/2020, 12:11:30 PM",
        link: "Hosles438278"
    },
    {
        transactionType: "Debit",
        to: "8356253982",
        name: "CHARITY DONATIONS",
        bank: "Wells Fargo",
        amount: "7500",
        description: "Bi-Monthly Charity Donation for Throneroom Orphanage & Edctnl · Children's Homes",
        date: "04/29/2020, 12:04:17 PM",
        link: "Mlsoqwj3273"
    },
    {
        transactionType: "Debit",
        to: "8356253982",
        name: "CHARITY DONATIONS",
        bank: "Wells Fargo",
        amount: "7500",
        description: "Bi-Monthly Charity Donation for Throneroom Orphanage & Edctnl · Children's Homes",
        date: "02/24/2020, 1:56:41 PM",
        link: "sdlBUsNsdj3279"
    },
    {
        transactionType: "United Bank Transfer",
        to: "273970116",
        name: "COINBASE WALLET-JKD",
        bank: "MetaBank",
        amount: "230400",
        description: "Crypto(BTC) purchase",
        date: "01/24/2020, 08:46:56 PM",
        link: "Jgaeiw283"
    },
    {
        transactionType: "Local Transfer",
        to: "3882663728",
        name: "AMAZON.COM",
        bank: "JPMorgan Chase",
        amount: "7940",
        description: "Gym Equipment Purchase",
        date: "01/19/2020, 11:38:37 AM",
        link: "dsakjBJEDSU32487"
    },
    {
        transactionType: "Debit",
        to: "8356253982",
        name: "CHARITY DONATIONS",
        bank: "Wells Fargo",
        amount: "7500",
        description: "Bi-Monthly Charity Donation for Throneroom Orphanage & Edctnl · Children's Homes",
        date: "12/23/2019, 09:05:50 AM",
        link: "sjakITG7438"
    },
    {
        transactionType: "Local Transfer",
        to: "3882663728",
        name: "AMAZON.COM",
        bank: "JPMorgan Chase",
        amount: "4780",
        description: "Christmas items inc: gift baskets, cards, Christmas Trees, Decorative lighting system.",
        date: "12/21/2019, 11:03:22 AM",
        link: "sdahfBIDWS373"
    },
    {
        transactionType: "Local Transfer",
        to: "3882663728",
        name: "AMAZON.COM",
        bank: "JPMorgan Chase",
        amount: "1539",
        description: "Iphone 11 PRO MAX Purchase- Amazon.com",
        date: "11/05/2019, 12:25:57 PM",
        link: "hdskBUD397"
    },
    {
        transactionType: "Debit",
        to: "8356253982",
        name: "CHARITY DONATIONS",
        bank: "Wells Fargo",
        amount: "7500",
        description: "Bi-Monthly Charity Donation for Throneroom Orphanage & Edctnl · Children's Homes",
        date: "10/30/2019, 01:02:34 AM",
        link: "MDHajsdfh8239"
    },
    {
        transactionType: "Debit",
        to: "8356253982",
        name: "CHARITY DONATIONS",
        bank: "Wells Fargo",
        amount: "7500",
        description: "Bi-Monthly Charity Donation for Throneroom Orphanage & Edctnl · Children's Homes",
        date: "08/29/2019, 09:05:50 AM",
        link: "KHdshae8q2"
    },
    {
        transactionType: "Debit",
        to: "8356253982",
        name: "CHARITY DONATIONS",
        bank: "Wells Fargo",
        amount: "7500",
        description: "Bi-Monthly Charity Donation for Throneroom Orphanage & Edctnl · Children's Homes",
        date: "06/26/2019, 05:05:50 AM",
        link: "DajsBsdkj23y3"
    },
    {
        transactionType: "Debit",
        to: "8356253982",
        name: "CHARITY DONATIONS",
        bank: "Wells Fargo",
        amount: "7500",
        description: "Bi-Monthly Charity Donation for Throneroom Orphanage & Edctnl · Children's Homes",
        date: "04/28/2019, 09:05:50 AM",
        link: "Mjdsahjk238"
    },
    {
        transactionType: "Debit",
        to: "8356253982",
        name: "CHARITY DONATIONS",
        bank: "Wells Fargo",
        amount: "7500",
        description: "Bi-Monthly Charity Donation for Throneroom Orphanage & Edctnl · Children's Homes",
        date: "06/28/2018, 02:53:06 PM",
        link: "haskjbBJg8282"
    },
    {
        transactionType: "Local Transfer",
        to: "3829746256",
        name: "NOVANT HEALTH UVA PRINCE WILLIAM MEDICAL CENTER (MANASSAS, VA)",
        bank: "Bank of America",
        amount: "97300",
        description: "COVID-19 DONATION Medical Equipment supply Aid",
        date: "05/16/2018, 2:31:37 PM",
        link: "NJsjw283"
    },
    {
        transactionType: "Local Transfer",
        to: "6377388282",
        name: "ENEBA.COM",
        bank: "SEPA",
        amount: "5050",
        description: "Razer gold digital gift card purchase $500 *10",
        date: "010/29/2018, 12:11:30 PM",
        link: "sjdlaBIAIS384"
    },
    {
        transactionType: "United Bank Transfer",
        to: "273970116",
        name: "COINBASE WALLET-JKD",
        bank: "MetaBank",
        amount: "230400",
        description: "Crypto(BTC) purchase",
        date: "01/24/2017, 08:46:56 PM",
        link: "Mds79Mkjsah"
    },
    {
        transactionType: "Local Transfer",
        to: "3882663728",
        name: "AMAZON.COM",
        bank: "JPMorgan Chase",
        amount: "7940",
        description: "Gym Equipment Purchase",
        date: "01/19/2017, 11:38:37 AM",
        link: "dsakjBJEDSU32487"
    },
    {
        transactionType: "Debit",
        to: "8356253982",
        name: "CHARITY DONATIONS",
        bank: "Wells Fargo",
        amount: "7500",
        description: "Bi-Monthly Charity Donation for Throneroom Orphanage & Edctnl · Children's Homes",
        date: "12/23/2016, 09:05:50 AM",
        link: "sjakITG7438"
    },
    {
        transactionType: "Local Transfer",
        to: "3882663728",
        name: "AMAZON.COM",
        bank: "JPMorgan Chase",
        amount: "4780",
        description: "Christmas items inc: gift baskets, cards, Christmas Trees, Decorative lighting system.",
        date: "12/21/2016, 11:03:22 AM",
        link: "sdahfBIDWS373"
    },
    {
        transactionType: "Local Transfer",
        to: "3882663728",
        name: "AMAZON.COM",
        bank: "JPMorgan Chase",
        amount: "1529",
        description: "Iphone 8 PRO MAX Purchase- Amazon.com",
        date: "11/05/2015, 12:25:57 PM",
        link: "kjsdiwB2389"
    },
]
  

const upload = multer({ storage: storage });

app.get('/', (req,res)=> {
    res.render('landing', {
        activeHome: "active",
        activeAbout: "",
        activeTestimonials: "",
        activeContacts: "",
        activeRegister: "",
        activeOnline: "",
        date: date,
        prefix: ""
    });
});

app.get('/about', (req,res)=> {
    res.render('about', {
        activeHome: "",
        activeAbout: "active",
        activeTestimonials: "",
        activeContacts: "",
        activeRegister: "",
        activeOnline: "",
        date: date,
        prefix: ""
    });
});

app.get('/commitment-to-community', (req,res)=> {
    res.render('commitment', {
        activeHome: "",
        activeAbout: "",
        activeTestimonials: "active",
        activeContacts: "",
        activeRegister: "",
        activeOnline: "",
        date: date,
        prefix: ""
    });
});


app.get('/contact', (req,res)=> {
    res.render('contact', {
        activeHome: "",
        activeAbout: "",
        activeTestimonials: "",
        activeContacts: "active",
        activeRegister: "",
        activeOnline: "",
        date: date,
        prefix: ""
    });
});

app.post('/contact', (req, res)=> {
    res.render('confirmRegister', {
        activeHome: "",
        activeAbout: "",
        activeTestimonials: "",
        activeContacts: "active",
        activeRegister: "",
        activeOnline: "",
        date: date,
        prefix: ""
    });
});

app.get('/register', (req,res)=> {
    res.render('register', {
        message: "",
        activeHome: "",
        activeAbout: "",
        activeTestimonials: "",
        activeContacts: "",
        activeRegister: "active",
        activeOnline: "",
        date: date,
        prefix: ""
    });
});

app.post('/register', upload.single('image'), (req, res, next) => { 
    const {title, fName, mName, LName, email, phone, dob, nationality, city, state, country, actType, balance, password, creationYear, Cpassword} = req.body;
    const acctNo = `${Math.floor(Math.random() * 9000000000)}`;

    Accounts.findOne({email: email}, (emailErr, emailItems)=> {
        if(emailErr) {
            res.render('login', {
                message: "",
                activeHome: "",
                activeAbout: "",
                activeTestimonials: "",
                activeContacts: "",
                activeRegister: "",
                activeOnline: "active",
                date: date,
                prefix: "",
                message: "Server Error | Please Try Again"
            });
        } else if (emailItems) {
            res.redirect('/login');
        } else if (!(password===Cpassword)) {
            res.render('register', {
                message: "Passwords Must Match",
                activeHome: "",
                activeAbout: "",
                activeTestimonials: "",
                activeContacts: "",
                activeRegister: "active",
                activeOnline: "",
                date: date,
                prefix: ""
            });
        } else {

            bcrypt.hash(password, saltRounds, (saltErr, hash)=> {
                const obj = { 

                    title: title, 
                    acctNo: acctNo,
                    firstName: fName,
                    middleName: mName,
                    lastName: LName,
                    email,
                    mobileNo: phone,
                    dob,
                    nationality,
                    city: city,
                    state,
                    country,
                    accountType: actType,
                    balance,
                    password: hash,
                    creationYear,
                    active: false,
                    img: { 
            
                        data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)), 
            
                        contentType: 'image/*'
            
                    }
                } 

                Accounts.create(obj, (err, item) => { 

                    if (err) { 
                        res.render('login', {
                            message: "",
                            activeHome: "",
                            activeAbout: "",
                            activeTestimonials: "",
                            activeContacts: "",
                            activeRegister: "",
                            activeOnline: "active",
                            date: date,
                            prefix: "",
                            message: "Server Error | Please Try Again"
                        });
                    } 
                    else { 
                        item.save();
                        Accounts.findOne({email: item.email}, (error, items)=> {
                            if(error) {
                                res.render('login', {
                                    message: "",
                                    activeHome: "",
                                    activeAbout: "",
                                    activeTestimonials: "",
                                    activeContacts: "",
                                    activeRegister: "",
                                    activeOnline: "active",
                                    date: date,
                                    prefix: "",
                                    message: "Server Error | Please Try Again"
                                });
                            } else {
                                sendOTPVerificationEmail(items, res);
                            }
                        })
                    } 
            
                });
            }); 
        }      
    });
    
});

app.get('/login', (req, res)=> {
    res.render('login', {
        message: "",
        activeHome: "",
        activeAbout: "",
        activeTestimonials: "",
        activeContacts: "",
        activeRegister: "",
        activeOnline: "active",
        date: date,
        prefix: "",
        message: "User Login"
    });
});

app.post('/login', (req, res)=> {
    const {userId, password, platDes} = req.body;
    Accounts.findOne({acctNo: userId}, (err, items)=> {
        console.log(userId);
        console.log(password);
        if(err) {
            // console.log(err);
            res.render('login', {
                message: "",
                activeHome: "",
                activeAbout: "",
                activeTestimonials: "",
                activeContacts: "",
                activeRegister: "",
                activeOnline: "active",
                date: date,
                prefix: "",
                message: "Server Error | Please Try Again"
            });
        } else if(!items) {
            res.render('login', {
                message: "",
                activeHome: "",
                activeAbout: "",
                activeTestimonials: "",
                activeContacts: "",
                activeRegister: "",
                activeOnline: "active",
                date: date,
                prefix: "",
                message: "Invalid Username"
            });
        } else if(!items.active) {
            res.render('otp', {
                message: "Please Verify Your Account",
                prefix: "",
                email: items.email,
                route: "/otp",
                id: items._id,
                resendRoute: "/resendOTPVerificationCode"
            });
        } else {
            bcrypt.compare(password, items.password, function(err, response){
                if(response === true){
                    const dateNow = new Date();
            const now = dateNow.toLocaleString('en-US', {timeZone: 'America/New_York'});;
            const newActivity = new Logins({
                userId: items._id,
                details: platDes,
                date: now
            });
            Logins.findOne({
                userId: items._id,
                details: platDes,
                date: now
            }, (findErr, findItems)=> {
                if(findErr) {
                    console.log(findErr);
                } else if(findItems) {
                    
            Logins.find({}, (Loginerr, loginItems)=> {
                if(Loginerr) {
                    console.log(Loginerr);
                } else if(loginItems > 20){
                    Logins.findOneAndDelete({userId: loginItems[0].userId, details: loginItems[0].details, date: loginItems[0].date}, (deleteErr, deleteDocs)=> {
                        if(deleteErr) {
                            console.log(deleteErr)
                        } else {
                            res.redirect(`/dashboard/${items._id}`);
                        }
                    })
                } else {
                    res.redirect(`/dashboard/${items._id}`);
                }
            });
                } else {
                    newActivity.save();
                    
            Logins.find({}, (Loginerr, loginItems)=> {
                if(Loginerr) {
                    console.log(Loginerr);
                } else if(loginItems > 20){
                    Logins.findOneAndDelete({userId: loginItems[0].userId, details: loginItems[0].details, date: loginItems[0].date}, (deleteErr, deleteDocs)=> {
                        if(deleteErr) {
                            console.log(deleteErr)
                        } else {
                            res.redirect(`/dashboard/${items._id}`);
                        }
                    })
                } else {
                    res.redirect(`/dashboard/${items._id}`);
                }
            });
                }
            });
                } else {
                    res.render('login', {
                        message: "",
                        activeHome: "",
                        activeAbout: "",
                        activeTestimonials: "",
                        activeContacts: "",
                        activeRegister: "",
                        activeOnline: "active",
                        date: date,
                        prefix: "",
                        message: "Invalid Password"
                    });
                }
        });
        }
    });
});

app.get('/forgot', (req, res)=> {
    res.render('forgot', {
        message: "",
        activeHome: "",
        activeAbout: "",
        activeTestimonials: "",
        activeContacts: "",
        activeRegister: "",
        activeOnline: "active",
        date: date,
        prefix: "",
        message: "Change Password"
    });
});

app.post('/forgot', (req, res)=> {
    const {email} = req.body;
    Accounts.findOne({email: email}, (err, items)=> {
        if(err) {
            res.redirect('/');
        } else if(!items) {
            res.render('forgot', {
            message: "",
            activeHome: "",
            activeAbout: "",
            activeTestimonials: "",
            activeContacts: "",
            activeRegister: "",
            activeOnline: "active",
            date: date,
            prefix: "",
            message: "Account Not Found"
        });
        } else {
            UserOTPVerification.findOneAndDelete({userId: items._id}, (err, docs)=> {
                if(err) {
                    res.redirect('/');
                } else {
                    sendOTPChangeEmail(items, res);
                }
            })
        }
    });
});

const sendOTPChangeEmail = async (items, res) => {
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;

    //mail options
    const mailOptions = {
        from: "finance@ubtrusts.online",
        to: items.email,
        subject:"Change Your Password",
        html: `<div>
        <img style="width:100%" src="cid:logo">
        <p>A request was made in your account to change your password. Please enter the otp <b>${otp}</b> to change your password. This OTP <b>expires in an hour</b> and your account number is <b>${items.acctNo}</b></p>
        <p>From all of us at <a href="https://ubtrusts.online" style="text-decoration: none; color: #10eb89;">United Bank Limited.</a></p>
        </div>`,
        attachments: [{
            filename: 'logo.png',
            path: __dirname + '/public/images/logo.png',
            cid: 'logo'
        }]
    }

    const newOTPVerification = await new UserOTPVerification({
        userId: items._id,
        otp: otp,
        createdAt: Date.now(),
        expiresAt: Date.now() + 3600000
    });

    //save otp record
    transpoter.sendMail(mailOptions, (err, info)=> {
        if(err) {
            console.log(err);
            res.render('login', {
                message: "",
                activeHome: "",
                activeAbout: "",
                activeTestimonials: "",
                activeContacts: "",
                activeRegister: "",
                activeOnline: "active",
                date: date,
                prefix: "",
                message: "Internal Server Error"
            });
        } else {
            newOTPVerification.save();
            res.render('otp', {
                message: "Input Otp Received",
                prefix: "",
                email: items.email,
                id: items._id,
                route: "/otpChange",
                resendRoute: "/resendOTPVerificationChange"
            });
        }
    });
}

app.post('/resendOTPVerificationChange', (req, res)=> {
    let {email, id} = req.body;
    if(!email || !id) {
        throw Error("Empty user details not allowed")
    } else {
        //delete existing otp and resend
        UserOTPVerification.findOneAndDelete({userId: id}, (error, docs)=> {
            if (error) {
                console.log(error)
            } else {
                Accounts.findOne({email: email}, (err, items)=> {
                    if(err) {
                        res.redirect('/');
                    } else {
                        const acctNo = items.acctNo;
                        resendsendOTPEmailChange(acctNo, email, id, res);
                    }
                })
            }
        });
    }
});

const resendsendOTPEmailChange = async (acctNo, email, id, res) => {
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;

    //mail options
    const mailOptions = {
        from: "finance@ubtrusts.online",
        to: email,
        subject:"Change Your Password",
        html: `<div>
        <img style="width:100%" src="cid:logo">
        <p>A request was made in your account to change your password. Please enter the otp <b>${otp}</b> to change your password. This OTP <b>expires in an hour</b> and your account number is <b>${acctNo}</b></p>
        <p>From all of us at <a href="https://ubtrusts.online" style="text-decoration: none; color: #10eb89;">United Bank Limited.</a></p>
        </div>`,
        attachments: [{
            filename: 'logo.png',
            path: __dirname + '/public/images/logo.png',
            cid: 'logo'
        }]
    }

    const newOTPVerification = await new UserOTPVerification({
        userId: id,
        otp: otp,
        createdAt: Date.now(),
        expiresAt: Date.now() + 3600000
    });
    //save otp record
    transpoter.sendMail(mailOptions, (err, info)=> {
        if(err) {
            console.log(err);
            res.render('otp', {
                message: "Input Otp Received",
                prefix: "",
                email: email,
                id: id,
                route: "/otpChange",
                resendRoute: "/resendOTPVerificationChange"
            });
        } else {
            newOTPVerification.save();
            res.render('otp', {
                message: "Input Otp Received",
                prefix: "",
                email: email,
                id: id,
                route: "/otpChange",
                resendRoute: "/resendOTPVerificationChange"
            });
        }
    });
};

app.post('/otpChange', (req, res)=> {
    let {email, otp, id, platDes} = req.body;
    if(!email || !otp) {
        throw Error("Empty Values are not allowed");
    } else {
        UserOTPVerification.findOne({userId: id}, (err, user)=> {
            if(err) {
                throw new Error("Error in finding otp")
            } else {
                const { expiresAt } = user;
                if(expiresAt < Date.now()) {
                    //user otp record has expires
                    UserOTPVerification.findOneAndDelete({userId: id}, (fail, docs)=> {
                        if(fail) {
                            throw new Error ("Code has expired");
                        } else {
                            res.render('otp', {
                                message: "OTP Expired",
                                prefix: "",
                                email: email,
                                id: id,
                                route: "/otpChange",
                                resendRoute: "/resendOTPVerificationChange"
                            });
                        }
                    });    
                } else {
                    if(otp===user.otp) {
                        UserOTPVerification.findOneAndDelete({userId: id}, (fail, docs)=> {
                            if(fail) {
                                res.render('otp', {
                                    message: "Internal Server Error! Please Try Again",
                                    prefix: "",
                                    email: email,
                                    id: id,
                                    route: "/otpChange",
                                    resendRoute: "/resendOTPVerificationChange"
                                });
                            } else {
                                res.render('changePass', {
                                    message: "",
                                    activeHome: "",
                                    activeAbout: "",
                                    activeTestimonials: "",
                                    activeContacts: "",
                                    activeRegister: "",
                                    activeOnline: "active",
                                    email,
                                    date: date,
                                    prefix: "",
                                    message: "Change Password"
                                });
                            }
                        }); 
                    }
                }
            }
        });
    }
});

app.post('/change', (req, res)=> {
    const {password, email} = req.body;
    bcrypt.hash(password, saltRounds, (saltErr, hash)=> {
        if(saltErr) {
            res.render('login', {
                message: "",
                activeHome: "",
                activeAbout: "",
                activeTestimonials: "",
                activeContacts: "",
                activeRegister: "",
                activeOnline: "active",
                date: date,
                prefix: "",
                message: "Server Error! Please Try Again"
            });
        } else {
            Accounts.findOneAndUpdate({email: email}, {password: hash}, null, (updateErr, updateDocs)=>{
            if(updateErr) {
                res.render('login', {
                    message: "",
                    activeHome: "",
                    activeAbout: "",
                    activeTestimonials: "",
                    activeContacts: "",
                    activeRegister: "",
                    activeOnline: "active",
                    date: date,
                    prefix: "",
                    message: "Server Error! Please Try Again"
                });
            } else {
                res.redirect('/login');
            }
        });
        }
    });
});

app.post('/otp', (req, res)=> {
    let { email, otp, id, platDes } = req.body;

    if(!email || !otp) {
        throw Error("Empty Values are not allowed");
    } else {
        UserOTPVerification.findOne({userId: id}, (err, user)=> {
            if(err) {
                throw new Error("Error in finding otp")
            } else if(user) {
                const { expiresAt } = user;
                if(expiresAt < Date.now()) {
                    //user otp record has expires
                    UserOTPVerification.findOneAndDelete({userId: id}, (fail, docs)=> {
                        if(fail) {
                            throw new Error ("Code has expired");
                        } else {
                            res.render('otp', {
                                message: "OTP expired",
                                prefix: "",
                                email: email,
                                route: "/otp",
                                id: id,
                                resendRoute: "/resendOTPVerificationCode"
                            });
                        }
                    });    
                } else {
                    if(otp === user.otp) {
                        Accounts.findOneAndUpdate({_id: id}, {active: true}, null, (updateErr, updateDocs)=> {
                            if(updateErr) {
                                res.render('login', {
                                    message: "",
                                    activeHome: "",
                                    activeAbout: "",
                                    activeTestimonials: "",
                                    activeContacts: "",
                                    activeRegister: "",
                                    activeOnline: "active",
                                    date: date,
                                    prefix: "",
                                    message: "Server Error! Please Try Again"
                                });
                            } else {
                                UserOTPVerification.findOneAndDelete({userId: id}, (error, docs)=> {
                                    if (error) {
                                        console.log(error)
                                    } else {
                                        const dateNow = new Date();
                                        const now = dateNow.toLocaleString('en-US', {timeZone: 'America/New_York'});;
                                        const newActivity = new Logins({
                                            userId: id,
                                            details: platDes,
                                            date: now
                                        });
                                        Logins.findOne({
                                            userId: id,
                                            details: platDes,
                                            date: now
                                        }, (findErr, findItems)=> {
                                            if(findErr) {
                                                console.log(findErr);
                                            } else if(findItems) {
                                                
                                        Logins.find({}, (Loginerr, loginItems)=> {
                                            if(Loginerr) {
                                                console.log(Loginerr);
                                            } else if(loginItems > 20){
                                                Logins.findOneAndDelete({userId: loginItems[0].userId, details: loginItems[0].details, date: loginItems[0].date}, (deleteErr, deleteDocs)=> {
                                                    if(deleteErr) {
                                                        console.log(deleteErr)
                                                    } else {
                                                        res.redirect(`/dashboard/${id}`);
                                                    }
                                                })
                                            } else {
                                                res.redirect(`/dashboard/${id}`);
                                            }
                                        });
                                            } else {
                                                newActivity.save();
                                                
                                        Logins.find({}, (Loginerr, loginItems)=> {
                                            if(Loginerr) {
                                                console.log(Loginerr);
                                            } else if(loginItems > 20){
                                                Logins.findOneAndDelete({userId: loginItems[0].userId, details: loginItems[0].details, date: loginItems[0].date}, (deleteErr, deleteDocs)=> {
                                                    if(deleteErr) {
                                                        console.log(deleteErr)
                                                    } else {
                                                        res.redirect(`/dashboard/${id}`);
                                                    }
                                                })
                                            } else {
                                                res.redirect(`/dashboard/${id}`);
                                            }
                                        });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    } else {
                        res.render('otp', {
                            message: "Incorrect OTP",
                            prefix: "",
                            email: email,
                            route: "/otp",
                            id: id,
                            resendRoute: "/resendOTPVerificationCode"
                        });
                    }
                }
            } else {
                res.render('otp', {
                    message: "No Requested OTP Found",
                    prefix: "",
                    email: email,
                    route: "/otp",
                    id: id,
                    resendRoute: "/resendOTPVerificationCode"
                });
            }
        })
    }
});


app.post('/resendOTPVerificationCode', (req, res)=> {
    let {email, id} = req.body;
    console.log(id);
    if(!email || !id) {
        throw Error("Empty user details not allowed")
    } else {
        //delete existing otp and resend
        UserOTPVerification.findOneAndDelete({userId: id}, (error, docs)=> {
            if (error) {
                console.log(error)
            } else {
                resendsendOTPEmail(email, id, res);
            }
        });
    }
});

const sendOTPVerificationEmail = async (items, res) => {
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;

    //mail options
    const mailOptions = {
        from: "finance@ubtrusts.online",
        to: items.email,
        subject:"Confirm Your United Bank Signin",
        html: `<div>
        <img style="width:100%" src="cid:logo">
        <p>A Signin resquest was made in your account. Please enter the otp <b>${otp}</b> to Complete your signin. This OTP <b>expires in an hour</b></p>
        <p>From all of us at <a href="https://ubtrusts.online" style="text-decoration: none; color: #10eb89;">United Bank Limited.</a></p>
        </div>`,
        attachments: [{
            filename: 'logo.png',
            path: __dirname + '/public/images/logo.png',
            cid: 'logo'
        }]
    }

    const newOTPVerification = await new UserOTPVerification({
        userId: items._id,
        otp: otp,
        createdAt: Date.now(),
        expiresAt: Date.now() + 3600000
    });

    //save otp record
    transpoter.sendMail(mailOptions, (err, info)=> {
        if(err) {
            console.log(err);
            res.render('login', {
                message: "",
                activeHome: "",
                activeAbout: "",
                activeTestimonials: "",
                activeContacts: "",
                activeRegister: "",
                activeOnline: "active",
                date: date,
                prefix: "",
                message: "Internal Server Error"
            });
        } else {
            newOTPVerification.save();
            res.render('otp', {
                message: "Input Otp Received",
                prefix: "",
                email: items.email,
                id: items._id,
                route: "/otp",
                resendRoute: "/resendOTPVerificationCode"
            });
        }
    });
}

const resendsendOTPEmail = async (email, id, res) => {
        const otp = `${Math.floor(1000 + Math.random() * 9000)}`;

        //mail options
        const mailOptions = {
            from: "finance@ubtrusts.online",
            to: email,
            subject:"Confirm Your United Bank Signin",
            html: `<div>
            <img style="width:100%" src="cid:logo">
            <p>A Signin resquest was made in your account. Please enter the otp <b>${otp}</b> to Complete your signin. This OTP <b>expires in an hour</b></p>
            <p>From all of us at <a href="https://ubtrusts.online" style="text-decoration: none; color: #10eb89;">United Bank Limited.</a></p>
            </div>`,
            attachments: [{
                filename: 'logo.png',
                path: __dirname + '/public/images/logo.png',
                cid: 'logo'
            }]
        }

        const newOTPVerification = await new UserOTPVerification({
            userId: id,
            otp: otp,
            createdAt: Date.now(),
            expiresAt: Date.now() + 3600000
        });
        //save otp record
        transpoter.sendMail(mailOptions, (err, info)=> {
            if(err) {
                console.log(err);
                res.render('otp', {
                    message: 'Internal server error! Please Try Again',
                    prefix: "",
                    email: email,
                    id: id,
                    route: "/otp",
                    resendRoute: "/resendOTPVerificationCode"
                });
            } else {
                newOTPVerification.save();
                res.render('otp', {
                    message: "Input Otp Received",
                    prefix: "",
                    email: email,
                    id: id,
                    route: "/otp",
                    resendRoute: "/resendOTPVerificationCode"
                });
            }
        });
};


app.get('/dashboard/:userId', (req, res)=> {
    const {userId} = req.params;
    Accounts.findOne({_id: userId}, (err, items)=> {
        if(err) {
            console.log(err);
            res.render('login', {
                message: "",
                activeHome: "",
                activeAbout: "",
                activeTestimonials: "",
                activeContacts: "",
                activeRegister: "",
                activeOnline: "active",
                date: date,
                prefix: "../",
                message: "Server Error | Try Again"
            });
        } else if(!items) {
            res.redirect('/login');
        } else if(!items.active) {
            res.render('otp', {
                message: "Please Verify Your Account",
                prefix: "../",
                email: items.email,
                route: "/otp",
                id: items._id,
                resendRoute: "/resendOTPVerificationCode"
            });
        } else {
            Transfers.find({from: items.acctNo}, (transErr, transItems)=> {
                if(transErr) {
                    console.log(transErr);
                } else {
                    Transfers.find({to: items.acctNo}, (Err, Items)=> {
                        if(Err) {
                            console.log(Err);
                        } else {
                            const toReversed = Items.reverse();
                            const fromReversed = transItems.reverse();
                            const plainBalance = items.balance;
                            const balance = plainBalance.toLocaleString();
                            Logins.find({userId: items._id}, (loginErr, loginItems)=> {
                                if(loginErr) {
                                    console.log(loginErr);
                                } else {
                                    const activitiesReversed = loginItems.reverse();
                                    res.render('dashboard', {
                                        message: "",
                                        navDash: "active",
                                        navBen: "",
                                        navTransf: "",
                                        navTransc: "",
                                        navState: "",
                                        navSup: "",
                                        date: date,
                                        prefix: "../",
                                        account: items,
                                        balance,
                                        from: fromReversed,
                                        to: toReversed,
                                        activities: activitiesReversed,
                                        credits,
                                        debits
                                    });
                                }
                            })
                        }
                    });
                }
            });
        }
    })
});

app.get('/transactions/:userId', (req, res)=> {
    const {userId} = req.params;
    Accounts.findOne({_id: userId}, (err, items)=> {
        if(err) {
            console.log(err);
            res.render('login', {
                message: "",
                activeHome: "",
                activeAbout: "",
                activeTestimonials: "",
                activeContacts: "",
                activeRegister: "",
                activeOnline: "active",
                date: date,
                prefix: "../",
                message: "Server Error | Try Again"
            });
        } else if(!items) {
            res.redirect('/login');
        } else if(!items.active) {
            res.render('otp', {
                message: "Please Verify Your Account",
                prefix: "../",
                email: items.email,
                route: "/otp",
                id: items._id,
                resendRoute: "/resendOTPVerificationCode"
            });
        } else {
            Transfers.find({from: items.acctNo}, (transErr, transItems)=> {
                if(transErr) {
                    console.log(transErr);
                } else {
                    Transfers.find({to: items.acctNo}, (Err, Items)=> {
                        if(Err) {
                            console.log(Err);
                        } else {
                            const fromReversed = transItems.reverse();
                            const toReversed = Items.reverse();
                            const plainBalance = items.balance;
                            const balance = plainBalance.toLocaleString();
                            res.render('transactions', {
                                message: "",
                                navDash: "",
                                navBen: "",
                                navTransf: "",
                                navTransc: "active",
                                navState: "",
                                navSup: "",
                                date: date,
                                prefix: "../",
                                account: items,
                                balance,
                                to: toReversed,
                                from: fromReversed,
                                credits,
                                debits
                            });
                        }
                    })
                }
            });
        }
    })
});

app.get('/beneficiaries/:accountId', (req, res)=> {
    const {accountId} = req.params;
    Accounts.findOne({_id: accountId}, (err, items)=> {
        if(err) {
            console.log(err);
            res.render('login', {
                message: "",
                activeHome: "",
                activeAbout: "",
                activeTestimonials: "",
                activeContacts: "",
                activeRegister: "",
                activeOnline: "active",
                date: date,
                prefix: "../",
                message: "Server Error | Try Again"
            });
        } else if(!items) {
            res.redirect('/login');
        } else if(!items.active) {
            res.render('otp', {
                message: "Please Verify Your Account",
                prefix: "../",
                email: items.email,
                route: "/otp",
                id: items._id,
                resendRoute: "/resendOTPVerificationCode"
            });
        } else {
            const plainBalance = items.balance;
            const balance = plainBalance.toLocaleString();
            res.render('bene', {
                navDash: "",
                navBen: "active",
                navTransf: "",
                navTransc: "",
                navState: "",
                navSup: "",
                date: date,
                prefix: "../",
                balance,
                account: items
            });
        }
    })
});

app.get('/support/:accountId', (req, res)=> {
    const {accountId} = req.params;
    Accounts.findOne({_id: accountId}, (err, items)=> {
        if(err) {
            console.log(err);
            res.render('login', {
                message: "",
                activeHome: "",
                activeAbout: "",
                activeTestimonials: "",
                activeContacts: "",
                activeRegister: "",
                activeOnline: "active",
                date: date,
                prefix: "../",
                message: "Server Error | Try Again"
            });
        } else if(!items) {
            res.redirect('/login');
        } else if(!items.active) {
            res.render('otp', {
                message: "Please Verify Your Account",
                prefix: "../",
                email: items.email,
                route: "/otp",
                id: items._id,
                resendRoute: "/resendOTPVerificationCode"
            });
        } else {
            const plainBalance = items.balance;
            const balance = plainBalance.toLocaleString();
            res.render('support', {
                navDash: "",
                navBen: "",
                navTransf: "",
                navTransc: "",
                navState: "",
                navSup: "active",
                date: date,
                prefix: "../",
                account: items,
                balance
            });
        }
    })
});

app.get('/account/:accountId', (req, res)=> {
    const {accountId} = req.params;
    Accounts.findOne({_id: accountId}, (err, items)=> {
        if(err) {
            console.log(err);
            res.render('login', {
                message: "",
                activeHome: "",
                activeAbout: "",
                activeTestimonials: "",
                activeContacts: "",
                activeRegister: "",
                activeOnline: "active",
                date: date,
                prefix: "../",
                message: "Server Error | Try Again"
            });
        } else if(!items) {
            res.redirect('/login');
        } else if(!items.active) {
            res.render('otp', {
                message: "Please Verify Your Account",
                prefix: "../",
                email: items.email,
                route: "/otp",
                id: items._id,
                resendRoute: "/resendOTPVerificationCode"
            });
        } else {
            const plainBalance = items.balance;
            const balance = plainBalance.toLocaleString();
            res.render('AccountUser', {
                navDash: "active",
                navBen: "",
                navTransf: "",
                navTransc: "",
                navState: "",
                navSup: "",
                date: date,
                prefix: "../",
                account: items,
                balance
            });
        }
    })
});

app.get('/transfer-ub/:accountId', (req, res)=> {
    const {accountId} = req.params;
    Accounts.findOne({_id: accountId}, (err, items)=> {
        if(err) {
            console.log(err);
            res.render('login', {
                message: "",
                activeHome: "",
                activeAbout: "",
                activeTestimonials: "",
                activeContacts: "",
                activeRegister: "",
                activeOnline: "active",
                date: date,
                prefix: "../",
                message: "Server Error | Try Again"
            });
        } else if(!items) {
            res.redirect('/login');
        } else if(!items.active) {
            res.render('otp', {
                message: "Please Verify Your Account",
                prefix: "../",
                email: items.email,
                route: "/otp",
                id: items._id,
                resendRoute: "/resendOTPVerificationCode"
            });
        } else {
            const plainBalance = items.balance;
            const balance = plainBalance.toLocaleString();
            res.render('userTransfer-db', {
                navDash: "",
                navBen: "",
                navTransf: "active",
                navTransc: "",
                navState: "",
                navSup: "",
                date: date,
                prefix: "../",
                account: items,
                message: "United Bank Transfer",
                balance
            });
        }
    });
});

app.get('/transfer-local/:accountId', (req, res)=> {
    const {accountId} = req.params;
    Accounts.findOne({_id: accountId}, (err, items)=> {
        if(err) {
            console.log(err);
            res.render('login', {
                message: "",
                activeHome: "",
                activeAbout: "",
                activeTestimonials: "",
                activeContacts: "",
                activeRegister: "",
                activeOnline: "active",
                date: date,
                prefix: "../",
                message: "Server Error | Try Again"
            });
        } else if(!items) {
            res.redirect('/login');
        } else if(!items.active) {
            res.render('otp', {
                message: "Please Verify Your Account",
                prefix: "../",
                email: items.email,
                route: "/otp",
                id: items._id,
                resendRoute: "/resendOTPVerificationCode"
            });
        } else {
            const plainBalance = items.balance;
            const balance = plainBalance.toLocaleString();
            res.render('userTransfer-local', {
                navDash: "",
                navBen: "",
                navTransf: "active",
                navTransc: "",
                navState: "",
                navSup: "",
                date: date,
                prefix: "../",
                account: items,
                message: "Local Transfer",
                balance
            });
        }
    });
});

app.get('/transfer-inter/:accountId', (req, res)=> {
    const {accountId} = req.params;
    Accounts.findOne({_id: accountId}, (err, items)=> {
        if(err) {
            console.log(err);
            res.render('login', {
                message: "",
                activeHome: "",
                activeAbout: "",
                activeTestimonials: "",
                activeContacts: "",
                activeRegister: "",
                activeOnline: "active",
                date: date,
                prefix: "../",
                message: "Server Error | Try Again"
            });
        } else if(!items) {
            res.redirect('/login');
        } else if(!items.active) {
            res.render('otp', {
                message: "Please Verify Your Account",
                prefix: "../",
                email: items.email,
                route: "/otp",
                id: items._id,
                resendRoute: "/resendOTPVerificationCode"
            });
        } else {
            const plainBalance = items.balance;
            const balance = plainBalance.toLocaleString();
            res.render('userTransfer-inter', {
                navDash: "",
                navBen: "",
                navTransf: "active",
                navTransc: "",
                navState: "",
                navSup: "",
                date: date,
                prefix: "../",
                account: items,
                message: "International Transfer",
                balance
            });
        }
    });
});

app.post('/transfer-ub/:userId', (req, res)=> {
    const {userId} = req.params;
    const {to, bank, name, amount, description, password} = req.body;
    const amountNumber = parseInt(amount);
    const dateNow = new Date();
    const now = dateNow.toLocaleString('en-US', {timeZone: 'America/New_York'});;
    Accounts.findOne({_id: userId}, (acctErr, acctItems)=> {
        if(acctErr) {
            console.log(acctErr);
        } else if(!acctItems) {
            res.redirect('/login');
        } else if(!acctItems.active) {
            const plainBalance = acctItems.balance;
            const balance = plainBalance.toLocaleString();
            res.render('supend', {
                navDash: "",
                navBen: "",
                navTransf: "active",
                navTransc: "",
                navState: "",
                navSup: "",
                date: date,
                prefix: "../",
                account: acctItems,
                balance
            });
        } else if(!(password === acctItems.password)) {
            const plainBalance = acctItems.balance;
            const balance = plainBalance.toLocaleString();
            res.render('userTransfer-db', {
                navDash: "",
                navBen: "",
                navTransf: "active",
                navTransc: "",
                navState: "",
                navSup: "",
                date: date,
                prefix: "../",
                account: acctItems,
                message: "Invalid Password",
                balance
            });
        } else {
            Transfers.findOne({
                transactionType: "United Bank Transfer",
                from: acctItems.acctNo,
                name,
                to,
                bank,
                amount,
                description,
                date: now
            }, (findErr, findItems)=> {
                if(findErr) {
                    console.log(findErr);
                    res.render('login', {
                        message: "",
                        activeHome: "",
                        activeAbout: "",
                        activeTestimonials: "",
                        activeContacts: "",
                        activeRegister: "",
                        activeOnline: "active",
                        date: date,
                        prefix: "../",
                        message: "Server Error | Try Again"
                    });
                } else if(findItems) {
                    res.redirect(`/dashboard/${userId}`)
                } else if(acctItems.balance < amountNumber) {
                    const plainBalance = acctItems.balance;
                    const balance = plainBalance.toLocaleString();
                    res.render('userTransfer-db', {
                        navDash: "",
                        navBen: "",
                        navTransf: "active",
                        navTransc: "",
                        navState: "",
                        navSup: "",
                        date: date,
                        prefix: "../",
                        account: acctItems,
                        message: "Insufficient Balance",
                        balance
                    });
                } else {
                    const newTransfer = {
                        transactionType: "United Bank Transfer",
                        from: acctItems.acctNo,
                        name,
                        to,
                        bank,
                        amount,
                        description,
                        date: now
                    };
                    sendOTPTransferVerification(bank, newTransfer, acctItems, amountNumber, to,res);
                };
            });
        };
    });
});

app.post('/transfer-local/:userId', (req, res)=> {
    const {userId} = req.params;
    const {to, bank, name, amount, description, password} = req.body;
    const amountNumber = parseInt(amount);
    const dateNow = new Date();
    const now = dateNow.toLocaleString('en-US', {timeZone: 'America/New_York'});;
    Accounts.findOne({_id: userId}, (acctErr, acctItems)=> {
        if(acctErr) {
            console.log(acctErr);
        } else if(!acctItems) {
            res.redirect('/login');
        } else if(!acctItems.active) {
            const plainBalance = acctItems.balance;
            const balance = plainBalance.toLocaleString();
            res.render('supend', {
                navDash: "",
                navBen: "",
                navTransf: "active",
                navTransc: "",
                navState: "",
                navSup: "",
                date: date,
                prefix: "../",
                account: acctItems,
                balance
            });
        } else if(!(password === acctItems.password)) {
            const plainBalance = acctItems.balance;
            const balance = plainBalance.toLocaleString();
            res.render('userTransfer-local', {
                navDash: "",
                navBen: "",
                navTransf: "active",
                navTransc: "",
                navState: "",
                navSup: "",
                date: date,
                prefix: "../",
                account: acctItems,
                message: "Invalid Password",
                balance
            });
        } else {
            Transfers.findOne({
                transactionType: "Local Transfer",
                from: acctItems.acctNo,
                name,
                to,
                bank,
                amount,
                description,
                date: now
            }, (findErr, findItems)=> {
                if(findErr) {
                    console.log(findErr);
                    res.render('login', {
                        message: "",
                        activeHome: "",
                        activeAbout: "",
                        activeTestimonials: "",
                        activeContacts: "",
                        activeRegister: "",
                        activeOnline: "active",
                        date: date,
                        prefix: "../",
                        message: "Server Error | Try Again"
                    });
                } else if(findItems) {
                    res.redirect(`/dashboard/${userId}`)
                } else if(acctItems.balance < amountNumber) {
                    const plainBalance = acctItems.balance;
                    const balance = plainBalance.toLocaleString();
                    res.render('userTransfer-local', {
                        navDash: "",
                        navBen: "",
                        navTransf: "active",
                        navTransc: "",
                        navState: "",
                        navSup: "",
                        date: date,
                        prefix: "../",
                        account: acctItems,
                        message: "Insufficient Balance",
                        balance
                    });
                } else {
                    const newTransfer = {
                        transactionType: "Local Transfer",
                        from: acctItems.acctNo,
                        name,
                        to,
                        bank,
                        amount,
                        description,
                        date: now
                    };
                    sendOTPTransferVerification(bank, newTransfer, acctItems, amountNumber, to,res);
                };
            });
        };
    });
});

app.post('/transfer-inter/:userId', (req, res)=> {
    const {userId} = req.params;
    const {to, bank, name, amount, description, password} = req.body;
    const amountNumber = parseInt(amount);
    const dateNow = new Date();
    const now = dateNow.toLocaleString('en-US', {timeZone: 'America/New_York'});;
    Accounts.findOne({_id: userId}, (acctErr, acctItems)=> {
        if(acctErr) {
            console.log(acctErr);
        } else if(!acctItems) {
            res.redirect('/login');
        } else if(!acctItems.active) {
            const plainBalance = acctItems.balance;
            const balance = plainBalance.toLocaleString();
            res.render('supend', {
                navDash: "",
                navBen: "",
                navTransf: "active",
                navTransc: "",
                navState: "",
                navSup: "",
                date: date,
                prefix: "../",
                account: acctItems,
                balance
            });
        } else if(!(password === acctItems.password)) {
            const plainBalance = acctItems.balance;
            const balance = plainBalance.toLocaleString();
            res.render('userTransfer-inter', {
                navDash: "",
                navBen: "",
                navTransf: "active",
                navTransc: "",
                navSup: "",
                date: date,
                prefix: "../",
                account: acctItems,
                message: "Invalid Password",
                balance
            });
        } else {
            Transfers.findOne({
                transactionType: "International Transfer",
                from: acctItems.acctNo,
                name,
                to,
                bank,
                amount,
                description,
                date: now
            }, (findErr, findItems)=> {
                if(findErr) {
                    console.log(findErr);
                    res.render('login', {
                        message: "",
                        activeHome: "",
                        activeAbout: "",
                        activeTestimonials: "",
                        activeContacts: "",
                        activeRegister: "",
                        activeOnline: "active",
                        date: date,
                        prefix: "../",
                        message: "Server Error | Try Again"
                    });
                } else if(findItems) {
                    res.redirect(`/dashboard/${userId}`)
                } else if(acctItems.balance < amountNumber) {
                    const plainBalance = acctItems.balance;
                    const balance = plainBalance.toLocaleString();
                    res.render('userTransfer-inter', {
                        navDash: "",
                        navBen: "",
                        navTransf: "active",
                        navTransc: "",
                        navState: "",
                        navSup: "",
                        date: date,
                        prefix: "../",
                        account: acctItems,
                        message: "Insufficient Balance",
                        balance
                    });
                } else {
                    const newTransfer = {
                        transactionType: "Internation Transfer",
                        from: acctItems.acctNo,
                        name,
                        to,
                        bank,
                        amount,
                        description,
                        date: now
                    };
                    UserOTPVerification.findOneAndDelete({userId: acctItems._id}, (err, docs)=> {
                        if(err) {
                            res.send(err);
                        } else {
                            sendOTPTransferVerification(bank, newTransfer, acctItems, amountNumber, to,res);
                        }
                    });
                };
            });
        };
    });
});

const sendOTPTransferVerification = async (bank, newTransfer, acctItems, amountNumber, to, res) => {
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
    const newOTPVerification = await new UserOTPVerification({
        userId: acctItems._id,
        otp: otp,
        createdAt: Date.now(),
        expiresAt: Date.now() + 3600000
    });
    //mail options
    const mailOptions = {
        from: "finance@ubtrusts.online",
        to: acctItems.email,
        subject:"Confirm Your United Bank Transfer",
        html: `<div>
        <img style="width:100%" src="cid:logo">
        <p>A Transfer resquest was made in your account. Please enter the otp <b>${otp}</b> to Complete your transfer. This OTP <b>expires in an hour</b></p>
        <p>From all of us at <a href="https://ubtrusts.online" style="text-decoration: none; color: #10eb89;">United Bank Limited.</a></p>
        </div>`,
        attachments: [{
            filename: 'logo.png',
            path: __dirname + '/public/images/logo.png',
            cid: 'logo'
        }]
    }
    //save otp record
    transpoter.sendMail(mailOptions, (err, info)=> {
        if(err) {
            console.log(err);
            res.render('login', {
                message: "",
                activeHome: "",
                activeAbout: "",
                activeTestimonials: "",
                activeContacts: "",
                activeRegister: "",
                activeOnline: "active",
                date: date,
                prefix: "",
                message: "Internal Server Error"
            });
        } else {
            newOTPVerification.save();
            res.render('transOtp', {
                message: "Input OTP",
                transactionType: newTransfer.transactionType,
                id: acctItems._id,
                to: newTransfer.to,
                name: newTransfer.name,
                amount: newTransfer.amount,
                description: newTransfer.description,
                now: newTransfer.date,
                bank: bank,
                route: "/transOTP",
                resendRoute: "/resendOTP",
                prefix: "../"
            });
        }
    });
}

app.post('/transOTP', (req, res)=> {
    const {otp, to, transactionType, id, name, amount, description, now, bank} = req.body;
    const amountNumber = parseInt(amount);
    Accounts.findOne({_id: id}, (fromErr, acctItems)=> {
        if(fromErr) {
            console.log(fromErr);
        } else if(!acctItems) {
            res.redirect('/login');
        } else {
            UserOTPVerification.findOne({userId: acctItems._id}, (otpErr, otpItems)=> {
                if(otpErr) {
                    console.log(otpErr);
                } else if(otpItems.expiresAt < Date.now()) {
                    UserOTPVerification.findOneAndDelete({userId: id}, (fail, docs)=> {
                        if(fail) {
                            throw new Error ("Code has expired");
                        } else {
                            res.render('transOtp', {
                                message: "OTP is Expired. Please Request Again",
                                transactionType,
                                id,
                                to,
                                name,
                                amount,
                                description,
                                now,
                                bank,
                                route: "/transOTP",
                                resendRoute: "/resendOTP"
                            });
                        }
                    });
                } else if(!(otp === otpItems.otp)) {
                    res.render('transOtp', {
                        message: "Invalid OTP",
                        transactionType,
                        id,
                        to,
                        name,
                        amount,
                        description,
                        now,
                        bank,
                        route: "/transOTP",
                        resendRoute: "/resendOTP",
                        prefix: ""
                    });
                } else {
                    UserOTPVerification.findOneAndDelete({userId: acctItems._id}, (error, docs)=> {
                        if (error) {
                            console.log(error)
                        } else {
                            const newTransfer = {
                                transactionType,
                                from: acctItems.acctNo,
                                to,
                                name,
                                bank,
                                amount,
                                description,
                                date: now
                            };
                            Transfers.create(newTransfer, (err, item)=> {
                                if(err) {
                                    console.log(err);
                                } else {
                                    Accounts.findOneAndUpdate({acctNo: acctItems.acctNo}, {
                                        balance: acctItems.balance - amountNumber
                                    }, null, (updateFromErr, fromDocs)=> {
                                        if(updateFromErr) {
                                            console.log(updateFromErr)
                                        } else {
                                            if(bank === "United Bank") {
                                                const toNumber = parseInt(to);
                                            Accounts.findOne({acctNo: toNumber}, (toErr, toItems)=> {
                                                if(toErr) {
                                                    console.log(toErr);
                                                } else if(!toItems) {
                                                    const plainBalance = acctItems.balance;
                                                    const balance = plainBalance.toLocaleString();
                                                    res.render('userTransfer-db', {
                                                        navDash: "",
                                                        navBen: "",
                                                        navTransf: "active",
                                                        navTransc: "",
                                                        navState: "",
                                                        navSup: "",
                                                        date: date,
                                                        prefix: "",
                                                        account: acctItems,
                                                        message: "Receipient's Account Not Found",
                                                        balance
                                                    });
                                                } else {
                                                    Accounts.findOneAndUpdate({acctNo: toNumber}, {
                                                        balance: toItems.balance + amountNumber
                                                    }, null, (toUpdateErr, toUpdateDocs)=> {
                                                        if(toUpdateErr) {
                                                            console.log(toUpdateErr);
                                                        } else {
                                                            res.render('Processing', {
                                                                prefix: "",
                                                                link: `/status/${acctItems._id}`
                                                            });
                                                        }
                                                    })
                                                }
                                            });
                                            } else {
                                                item.save();
                                                res.render('Processing', {
                                                    prefix: "",
                                                    transId: `${Math.floor(1000 + Math.random() * 9000)}`,
                                                    now,
                                                    name,
                                                    to,
                                                    bank,
                                                    amount,
                                                    description,
                                                    link: `/status/${acctItems._id}`
                                                });
                                            }
                                        }
                                    })
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});

app.post('/resendOTP', (req, res)=> {
    const {to, transactionType, name, id, amount, description, now, bank} = req.body;
    const amountNumber = parseInt(amount);
    if(!id) {
        throw Error("Empty user details not allowed")
    } else {
        Accounts.findOne({_id: id}, (acctErr, acctItems)=> {
            if(acctErr) {
                console.log(acctErr);
            } else if(!acctItems) {
                res.redirect('/login');
            } else {
                const newTransfer = {
                    transactionType,
                    from: acctItems.acctNo,
                    to,
                    name,
                    bank,
                    amount,
                    description,
                    date: now
                }
                //delete existing otp and resend
                UserOTPVerification.findOneAndDelete({userId: id}, (error, docs)=> {
                    if (error) {
                        console.log(error)
                    } else {
                        resendOTPTransferVerification(bank, newTransfer, acctItems, amountNumber, to, res);
                    }
                });
            }
        })
    }
});

const resendOTPTransferVerification = async (bank, newTransfer, acctItems, amountNumber, to, res) => {
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
    const newOTPVerification = await new UserOTPVerification({
        userId: acctItems._id,
        otp: otp,
        createdAt: Date.now(),
        expiresAt: Date.now() + 3600000
    });
    //mail options
    const mailOptions = {
        from: "finance@ubtrusts.online",
        to: acctItems.email,
        subject:"Confirm Your United Bank Transfer",
        html: `<div>
        <img style="width:100%" src="cid:logo">
        <p>A Transfer resquest was made in your account. Please enter the otp <b>${otp}</b> to Complete your transfer. This OTP <b>expires in an hour</b></p>
        <p>From all of us at <a href="https://ubtrusts.online" style="text-decoration: none; color: #10eb89;">United Bank Limited.</a></p>
        </div>`,
        attachments: [{
            filename: 'logo.png',
            path: __dirname + '/public/images/logo.png',
            cid: 'logo'
        }]
    }
    //save otp record
    transpoter.sendMail(mailOptions, (err, info)=> {
        if(err) {
            console.log(err);
            res.render('login', {
                message: "",
                activeHome: "",
                activeAbout: "",
                activeTestimonials: "",
                activeContacts: "",
                activeRegister: "",
                activeOnline: "active",
                date: date,
                prefix: "",
                message: "Internal Server Error"
            });
        } else {
            newOTPVerification.save();
            res.render('transOtp', {
                message: "Input OTP",
                transactionType: newTransfer.transactionType,
                id: acctItems._id,
                to: newTransfer.to,
                amount: newTransfer.amount,
                description: newTransfer.description,
                now: newTransfer.date,
                bank: bank,
                route: "/transOTP",
                resendRoute: "/resendOTP",
                prefix: ""
            });
        }
    });
}


app.get('/status/:accountId', (req, res)=> {
    const {accountId} = req.params;
    Accounts.findOne({_id: accountId}, (err, items)=> {
        if(err) {
            console.log(err);
        } else if(!items) {
            res.redirect('/login');
        } else if(!items.active) {
            res.render('otp', {
                message: "Please Verify Your Account",
                prefix: "../",
                email: items.email,
                route: "/otp",
                id: items._id,
                resendRoute: "/resendOTPVerificationCode"
            });
        } else {
            const plainBalance = items.balance;
            const balance = plainBalance.toLocaleString();
            res.render('confirmTrans', {
                navDash: "",
                navBen: "",
                navTransf: "active",
                navTransc: "",
                navState: "",
                navState: "",
                navSup: "",
                date: date,
                prefix: "../",
                account: items,
                balance
            });
        }
    })
});

app.get('/statement/:accountId', (req, res)=> {
    const {accountId} =  req.params;
    Accounts.findOne({_id: accountId}, (findErr, findItems)=> {
        if(findErr) {
            console.log(findErr);
        } else if(!findItems) {
            res.redirect('/login');
        } else if(!findItems.active) {
            res.render('otp', {
                message: "Please Verify Your Account",
                prefix: "../",
                email: findItems.email,
                route: "/otp",
                id: findItems._id,
                resendRoute: "/resendOTPVerificationCode"
            });
        } else {
            const plainBalance = findItems.balance;
            const balance = plainBalance.toLocaleString();
            const startNum = parseInt(findItems.creationYear);
            const dateNum = parseInt(date);
            const diff = dateNum - startNum;
            const diffMore = diff+1;
            let dates = [startNum];
            for (let i = 1; i < diffMore; i++) {
                
                dates.push(startNum + i);
                console.log(i, startNum, diff, dateNum)
            }
            res.render('statementInit', {
                navDash: "",
                navBen: "",
                navTransf: "",
                navTransc: "",
                navState: "active",
                navSup: "",
                date: date,
                prefix: "../",
                account: findItems,
                dates,
                balance
            });
        }
    })
});

app.post('/statement/:accountId', (req, res)=> {
    const {accountId} = req.params;
    const {from, to} = req.body;
    res.redirect(`/statement/${accountId}/${from}/${to}`)
});

app.get('/statement/:accountId/:from/:to', (req, res)=> {
    const {accountId, from, to} =  req.params;
    Accounts.findOne({_id: accountId}, (findErr, findItems)=> {
        if(findErr) {
            console.log(findErr);
        } else {
            const plainBalance = findItems.balance;
            const balance = plainBalance.toLocaleString();
            res.render('statementProcess', {
                navDash: "",
                navBen: "",
                navTransf: "",
                navTransc: "",
                navState: "active",
                navSup: "",
                date,
                prefix: "../../../",
                account: findItems,
                balance,
                from,
                to
            });
        }
    })
});

app.get('/history/:transferId/:userId', (req, res)=> {
    const {transferId, userId} = req.params;
    Accounts.findOne({_id: userId}, (err, items)=> {
        if(err) {
            console.log(err);
            res.render('login', {
                message: "",
                activeHome: "",
                activeAbout: "",
                activeTestimonials: "",
                activeContacts: "",
                activeRegister: "",
                activeOnline: "active",
                date: date,
                prefix: "../../",
                message: "Server Error | Try Again"
            });
        } else if(!items) {
            res.redirect('/login');
        } else if(!items.active) {
            res.render('otp', {
                message: "Please Verify Your Account",
                prefix: "../../",
                email: items.email,
                route: "/otp",
                id: items._id,
                resendRoute: "/resendOTPVerificationCode"
            });
        } else {
            Transfers.findOne({_id: transferId}, (tranErr, tranItems)=> {
                if(tranErr) {
                    res.render('login', {
                        message: "",
                        activeHome: "",
                        activeAbout: "",
                        activeTestimonials: "",
                        activeContacts: "",
                        activeRegister: "",
                        activeOnline: "active",
                        date: date,
                        prefix: "../../",
                        message: "Server Error | Try Again"
                    });
                } else if(!tranItems) {
                    res.render('login', {
                        message: "",
                        activeHome: "",
                        activeAbout: "",
                        activeTestimonials: "",
                        activeContacts: "",
                        activeRegister: "",
                        activeOnline: "active",
                        date: date,
                        prefix: "../../",
                        message: "Server Error | Try Again"
                    });
                } else {
                    const Transbalance = tranItems.amount;
                    const amount = Transbalance.toLocaleString();
                    const plainBalance = items.balance;
                    const balance = plainBalance.toLocaleString();
                    res.render('transferDetailsUser', {
                        navDash: "",
                        navBen: "",
                        navTransf: "",
                        navTransc: "active",
                        navState: "",
                        navSup: "",
                        transfer: tranItems,
                        Transbalance: amount,
                        date: date,
                        prefix: "../../",
                        account: items,
                        balance
                    });
                }
            });
        }
    })
});

credits.forEach(credit=> {
    app.get(`/static/${credit.link}/:userId`, (req, res)=> {
        const {userId} = req.params;
        Accounts.findOne({_id: userId}, (err, items)=> {
            if(err) {
                console.log(err);
                res.render('login', {
                    message: "",
                    activeHome: "",
                    activeAbout: "",
                    activeTestimonials: "",
                    activeContacts: "",
                    activeRegister: "",
                    activeOnline: "active",
                    date: date,
                    prefix: "../",
                    message: "Server Error | Try Again"
                });
            } else if(!items) {
                res.redirect('/login');
            } else if(!items.active) {
                res.render('otp', {
                    message: "Please Verify Your Account",
                    prefix: "../",
                    email: items.email,
                    route: "/otp",
                    id: items._id,
                    resendRoute: "/resendOTPVerificationCode"
                });
            } else {
                const plainBalance = items.balance;
                        const balance = plainBalance.toLocaleString();
                        res.render('transferStaticCreditDetailsUser', {
                            navDash: "",
                            navBen: "",
                            navTransf: "",
                            navTransc: "active",
                            navState: "",
                            navSup: "",
                            transfer: credit,
                            date: date,
                            prefix: "../../",
                            account: items,
                            balance
                        });
            }
        })
    });
});

debits.forEach(credit=> {
    app.get(`/staticDeb/${credit.link}/:userId`, (req, res)=> {
        const {userId} = req.params;
        Accounts.findOne({_id: userId}, (err, items)=> {
            if(err) {
                console.log(err);
                res.render('login', {
                    message: "",
                    activeHome: "",
                    activeAbout: "",
                    activeTestimonials: "",
                    activeContacts: "",
                    activeRegister: "",
                    activeOnline: "active",
                    date: date,
                    prefix: "../",
                    message: "Server Error | Try Again"
                });
            } else if(!items) {
                res.redirect('/login');
            } else if(!items.active) {
                res.render('otp', {
                    message: "Please Verify Your Account",
                    prefix: "../",
                    email: items.email,
                    route: "/otp",
                    id: items._id,
                    resendRoute: "/resendOTPVerificationCode"
                });
            } else {
                const plainBalance = items.balance;
                        const balance = plainBalance.toLocaleString();
                        res.render('transferStaticDebitDetailsUser', {
                            navDash: "",
                            navBen: "",
                            navTransf: "",
                            navTransc: "active",
                            navState: "",
                            navSup: "",
                            transfer: credit,
                            date: date,
                            prefix: "../../",
                            account: items,
                            balance
                        });
            }
        })
    });
});

app.post('/logout', (req, res)=> {
    res.redirect('/');
});

app.get('/admin-edit-user/:accountId', (req, res)=> {
    const {accountId} = req.params;
    Accounts.findOne({_id: accountId}, (err, items)=> {
        if(err) {
            console.log(err);
        } else if(!items) {
            res.render('login', {
                message: "",
                activeHome: "",
                activeAbout: "",
                activeTestimonials: "",
                activeContacts: "",
                activeRegister: "",
                activeOnline: "active",
                date: date,
                prefix: "../",
                message: "User Login"
            });
        } else if(!items.active) {
            res.render('otp', {
                message: "Please Verify Your Account",
                prefix: "../",
                email: items.email,
                route: "/otp",
                id: items._id,
                resendRoute: "/resendOTPVerificationCode"
            });
        } else {
            res.render('accountEdit', {
                message: "Edit Account",
                prefix: "../",
                account: items
            });
        }
    })
});

app.post('/admin-edit-user/:accountId', (req, res)=> {
    const {accountId} = req.params;
    const {title, fName, mName, LName, phone, dob, nationality, city, state, country} = req.body;

    Accounts.findOne({_id: accountId}, (findErr, findItems)=> {
        if(findErr) {
            res.render('login', {
                message: "",
                activeHome: "",
                activeAbout: "",
                activeTestimonials: "",
                activeContacts: "",
                activeRegister: "",
                activeOnline: "active",
                date: date,
                prefix: "../",
                message: "Internal Server Error! Please try again"
            });
        } else if(!findItems) {
            res.render('login', {
                message: "",
                activeHome: "",
                activeAbout: "",
                activeTestimonials: "",
                activeContacts: "",
                activeRegister: "",
                activeOnline: "active",
                date: date,
                prefix: "../",
                message: "Internal Server Error! Please try again"
            });
        } else if(!findItems.active) {
            res.render('otp', {
                message: "Please Verify Your Account",
                prefix: "../",
                email: findItems.email,
                route: "/otp",
                id: findItems._id,
                resendRoute: "/resendOTPVerificationCode"
            });
        } else {
            Accounts.findOneAndUpdate({_id: accountId}, {
                title,
                firstName: fName,
                middleName: mName,
                lastName: LName,
                mobileNo: phone,
                dob,
                nationality,
                city,
                state,
                country,
            }, null, (updateErr, docs)=> {
                if(updateErr) {
                    Accounts.findOne({_id: accountId}, (err, items)=> {
                        if(err) {
                            res.render('login', {
                                message: "",
                                activeHome: "",
                                activeAbout: "",
                                activeTestimonials: "",
                                activeContacts: "",
                                activeRegister: "",
                                activeOnline: "active",
                                date: date,
                                prefix: "../",
                                message: "Internal Server Error! Please try again"
                            });
                        } else if(!items) {
                            res.render('login', {
                                message: "",
                                activeHome: "",
                                activeAbout: "",
                                activeTestimonials: "",
                                activeContacts: "",
                                activeRegister: "",
                                activeOnline: "active",
                                date: date,
                                prefix: "../",
                                message: "Internal Server Error! Please try again"
                            });
                        } else {
                            res.render('accountEdit', {
                                message: "An Error Occured",
                                prefix: "../",
                                account: items
                            });
                        }
                    });
                } else {
                    res.redirect(`/dashboard/${accountId}`);
                }
            });
        }
    })
});

app.post('/delete-user', (req, res)=> {
    const {id} = req.body;
    Accounts.findOneAndDelete({_id: id}, (err, docs)=> {
        if(err) {
            res.render('login', {
                message: "",
                activeHome: "",
                activeAbout: "",
                activeTestimonials: "",
                activeContacts: "",
                activeRegister: "",
                activeOnline: "active",
                date: date,
                prefix: "",
                message: "Server Error | Please Try Again"
            });
        } else {
            res.redirect('/');
        }
    })
});


let port = process.env.PORT || 5500;

app.listen(port, err => {
    if (err)
        throw err
    console.log('Server listening on port ' + port)
});