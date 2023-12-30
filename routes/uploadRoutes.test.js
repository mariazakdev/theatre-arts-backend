const request = require('supertest');
const createApp = require('../index'); 
const knex = require('knex')(require('../knexfile'));

let app; 
let server;

beforeAll( async() => {
    app = createApp();
    server = app.listen();

});

afterAll(async () => {
server.close();
});

describe('GET /upload', () => {
  test('upload route respond with status 200', async () => {
    const app = createApp();
    const response = await request(app).get('/upload');

    expect(response.status).toBe(200);

  });
});

// describe('GET /contestant', () => {
//   test('It should respond with a contestant object', async () => {
//     const [user_id] = await knex('users').insert({
//         firebase_auth_id: 'test_firebase_id',
//     }); 
    
//     const app = createApp();
//     const response = await request(app).get('/upload/21'); 

//     expect(response.status).toBe(200);

//     const contestant = response.body;
//     expect(contestant.id).toBe(21);
//     expect(contestant.user_id).toBe(41);
//     expect(contestant.name).toBe('Brad Smith');
//     expect(contestant.description).toBe('I love theatre. I have a backround in broadway.');
//     expect(contestant.url_photo).toBe('https://monologue-avatars.s3.us-east-2.amazonaws.com/istockphoto-501787000-2048x2048.jpg');
//     expect(contestant.url_video).toBe('https://www.youtube.com/watch?v=0yZcDeVsj_Y');
//     expect(contestant.votes).toBe(30);
//     const expectedSignedPhotoUrl ="https://monologue-avatars.s3.us-east-2.amazonaws.com/https%3A//monologue-avatars.s3.us-east-2.amazonaws.com/istockphoto-501787000-2048x2048.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAX5XMAWUZGQWU23AN%2F20231230%2Fus-east-2%2Fs3%2Faws4_request&X-Amz-Date=20231230T153133Z&X-Amz-Expires=900&X-Amz-Signature=cac277b487c15c2f0edb01af502671e22774d89c264c9c27a548e9b9239cb2ea&X-Amz-SignedHeaders=host&x-id=GetObject" ;
//     expect(contestant.signedPhotoUrl).toBe(expectedSignedPhotoUrl);
//   });
// });
