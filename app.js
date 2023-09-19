let express = require('express');
let cors = require('cors')
let path = require('path');
let logger = require('morgan');

const deckRouter = require('./router/deck_router')
const sectionRouter = require('./router/section_router')
const cardRouter = require('./router/card_router')

const config = require('./config/app_config.json')
const { response_code } = require('./config/app_config.json')
let loggers = require('./common/logger');
const responseBody = require('./common/common_response')
let app = express();
app.use(cors());





// view engine setu
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Methods: POST, PUT, GET, OPTIONS");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});


const authorizationService = require('./service/authorization_service');
const { newAccessToken, verifyToken, verifyRole } = require('./common/token')
const {  downloadExcel} = require('./service/card_service')


app.post("/authorization", async (req, res) => {
    loggers.infos({ file_name: config.fileName.app, method_name: config.methodName.Authorization, userid: req.body.userName, operation: loggers.operation.create, subOperation: loggers.subOperation.entry, result: loggers.result.success, label: ``, errorcode: config.response_code.success })
    await authorizationService.checkAuthorization(req, res)
});

app.post('/authenticate/accesstoken/get', async (req, res) => {
    loggers.infos({ file_name: config.fileName.app, method_name: config.methodName.Authorization, userid: ``, operation: loggers.operation.read, subOperation: loggers.subOperation.entry, result: loggers.result.success, label: ``, errorcode: config.response_code.success })
    await newAccessToken(req, res, config.tokenValidity.access, config.tokenValidity.refresh)
})
app.post('/newClient', async (req, res) => {
    loggers.infos({ file_name: config.fileName.app, method_name: config.methodName.newClient, userid: req.body?.name ?? ``, operation: loggers.operation.create, subOperation: loggers.subOperation.entry, result: loggers.result.success, label: ``, errorcode: config.response_code.success })
    await authorizationService.addClientService(req, res);
})
app.get('/excel/download', async (req, res) => {
    loggers.infos({ file_name: config.fileName.app, method_name: config.methodName.excel, userid: '' ?? ``, operation: loggers.operation.create, subOperation: loggers.subOperation.entry, result: loggers.result.success, label: ``, errorcode: config.response_code.success })
    await downloadExcel(req, res);
});
app.use(verifyToken)
app.use(verifyRole)



// enter logger
app.use(function (req, res, next) {
    let userId = req.token.userId;
    if (userId) {
        loggers.infos({ file_name: config.fileName.app, method_name: config.methodName.logger, userid: userId, operation: loggers.operation.read, subOperation: loggers.subOperation.entry, result: loggers.result.success, label: ``, errorcode: `` })
    }
    next();
})


const userRouter = require('./router/users_router')

app.use("/user", userRouter);
app.use("/card", cardRouter);
app.use("/deck", deckRouter);
app.use("/section", sectionRouter);




// catch 404 and forward to error handler
app.use(function (req, res, next) {
    res.status(200).send(
        responseBody.responseCb(
            responseBody.headerCb({ code: response_code.url_error }),
            responseBody.bodyCb({ val: "urlError" })
        )
    )
});



// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;



