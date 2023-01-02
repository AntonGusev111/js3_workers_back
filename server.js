const  faker = require ('@faker-js/faker/locale/en');
const http = require('http');
const path = require('path');
const fs = require('fs');
const Koa = require('koa');
const koaBody = require('koa-body');
const koaStatic = require('koa-static');
const uuid = require('uuid');
const slow = require('koa-slow');

const app = new Koa();



const public = path.join(__dirname, '/public')
app.use(koaStatic(public));

app.use(async (ctx, next) => {
  const origin = ctx.request.get('Origin');
  if (!origin) {
    return await next();
  }

  const headers = { 'Access-Control-Allow-Origin': '*', };

  if (ctx.request.method !== 'OPTIONS') {
    ctx.response.set({...headers});
    try {
      return await next();
    } catch (e) {
      e.headers = {...e.headers, ...headers};
      throw e;
    }
  }

  if (ctx.request.get('Access-Control-Request-Method')) {
    ctx.response.set({
      ...headers,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH',
    });

    if (ctx.request.get('Access-Control-Request-Headers')) {
      ctx.response.set('Access-Control-Allow-Headers', ctx.request.get('Access-Control-Request-Headers'));
    }

    ctx.response.status = 204;
  }
});

app.use(koaBody({
  text: true,
  urlencoded: true,
  multipart: true,
  json: true,
}));

const Router = require('koa-router');
const router = new Router();

app.use(slow({
  url: /.get.info/,
  delay: 10000,
  debug: true,
}));

router.get('/api/get-info', async (ctx) => {

  let info = {
    "status": "ok",
    "data": [
      {
        "title": faker.faker.helpers.fake("{{lorem.words}}"),
        "img": faker.faker.image.avatar(),
        "description1": faker.faker.helpers.fake('{{lorem.words}}'),
        "description2": faker.faker.helpers.fake('{{lorem.words}}'),
      },
      {
        "title": faker.faker.helpers.fake("{{lorem.words}}"),
        "img": faker.faker.image.avatar(),
        "description1": faker.faker.helpers.fake('{{lorem.words}}'),
        "description2": faker.faker.helpers.fake('{{lorem.words}}'),
      },{
        "title": faker.faker.helpers.fake("{{lorem.words}}"),
        "img": faker.faker.image.avatar(),
        "description1": faker.faker.helpers.fake('{{lorem.words}}'),
        "description2": faker.faker.helpers.fake('{{lorem.words}}'),
      },
    ]
  };

  ctx.response.body = info;
  ctx.response.status = 200;

}); 
 
app.use(router.routes()).use(router.allowedMethods());

const port = process.env.PORT || 7070;
const server = http.createServer(app.callback()).listen(port);
