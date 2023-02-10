const express=require('express');
const cors=require('cors');
const app=express();
const models=require('./models');
const multer = require('multer');
const upload = multer({
    storage: multer.diskStorage({
        destination: function(req, file, cb){
            cb(null, 'uploads');  //처음에는 null값, 들어오면 uploads폴더안에 넣기
        },
        filename: function(req, file, cb){
            cb(null, file.originalname);
        },
    }),
});
const port='8080';

app.use(express.json());  //json형식의 데이터를 처리할 수 있게 설정
app.use(cors());  //브라우저의 cors이슈를 막기 위해
app.use('/uploads', express.static('uploads'));

app.get('/banners', (req, res) => {
    models.Banner.findAll({
        limit: 2
    }).then((result) => {
        res.send({
            banners: result
        })
    })
    .catch((error) => {
        console.error(error);
        res.status(500).send('에러가 발생했습니다.');
    })
})


app.get('/products', (req, res) => {    //model 안에 Product(테이블)에 있는 것들 전부
    models.Product.findAll({
        order:[['createdAt', 'DESC']],
        attributes:['id', 'name', 'price', 'seller', 'description', 'imageUrl', 'createdAt', 'soldout'],
    })
    .then((result) => {
        res.send({
            product: result,
        });
    }).catch((error) => {
        console.error(error);
        res.status(400).send('에러발생');
    });
});

app.get('/products/:id', (req, res) => {
    const params=req.params;
    const {id}=params;
    models.Product.findOne({
        where:{
            id,
        },
    }).then((result) => {
        res.send({product: result});
    })
    .catch((error) => {
        console.error(error);
        res.status(400).send('상품 조회시 에러가 발생했습니다.');
    });
});

app.post('/products', (req, res) => {
    const body=req.body;
    const { name, description, price, seller, imageUrl } = body;
    if(!name || !description || !price || !seller){
        res.send('모든 필드를 입력해주세요.');
    }
    models.Product.create({
        name,
        description,
        price,
        seller,
        imageUrl
    }).then((result) => {
        res.send({
            product: result
        })
    }).catch((error) => {
        console.error(error);
        res.status(400).send('상품 업로드에 문제가 생겼습니다.');
    });
});

app.post('/purchase/:id', (req, res) => {
    const {id} = req.params;
    models.Product.update(
        {
            soldout: 1,
        },
        {
            where: {
                id,
            }
        }
    ).then((result) => {
        res.send({
            result:true,
        })
    }).catch((error) => {
        console.error(error);
        res.status(500).send('에러가 발생했습니다.');
    });
});

app.post('/image', upload.single('image'), (req, res) => {
    const file = req.file;  //요청한 파일값을 file에 담기
    console.log(file);
    res.send({
        imageUrl:file.path,
    });
});

app.listen(port, () => {
		console.log("망고샵 서버 실행중");
    models.sequelize.sync()  //db연결
    .then(() =>{
        console.log('DB연결 성공');
    }).catch((err) =>{
        console.log('DB연결 에러');
        console.error(err);
        process.exit();  //끝나고 빠져나오게
    });
})