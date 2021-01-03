const request = require('supertest');

const {app, initRoutes} = require('../index');
const connect = require('../roles');

// connect mongodb truoc khi test
beforeEach(async() => {
  // add link mongodb vao env sau
  await connect.connectMongodb('mongodb+srv://lequocdatfit:lequocdat1234@cluster0.emhcb.mongodb.net/ClassPin?retryWrites=true&w=majority', initRoutes);
});

describe("Test the root path", () => {
  test("It should response the GET method", async() => {
    const response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
  });
});

describe("Test login path", () => {
  test("It should response 200", async() => {
    const res = await request(app).get("/login");
    expect(res.statusCode).toBe(200);
  })
});


/// TEST LOGIN PAGE


describe("Test login path", () => {
  test("It should response 200", async() => {
    const res = await request(app).get("/login");
    expect(res.statusCode).toBe(200);
  })
});

// Dang nhap voi password dung, mat khau sai
describe("Test login with wrong username", () => {
  test("It should render login page", async()=> {
    const res = await request(app).post("/login").send({
      namelogin: "truongcuda",
      password: "lequocdat1234"
    })
    expect(res.statusCode).toBe(200);
  })
})

// Dang nhap voi mat khau sai
// Boi vi sai mat khau nen se render lai trang login
describe("Test login wrong password", () => {
  test("It should render page login", async() => {
    const res = await request(app).post("/login").send({
      namelogin: "truongcuong",
      password: "abcd"
    });
    expect(res.statusCode).toBe(200);
  })
})

// Dang nhap dung namelogin va password
describe("Test login with true password", () => {
  test("It should render page login", async() => {
    const res = await request(app).post("/login").send({
      namelogin: "truongcuong",
      password: "lequocdat1234"
    });
    expect(res.statusCode).toBe(302); // Khi login dung thi se redirect den trang chu. statuscode = 302
  });
});


// TEST DASHBOARD

// kiem tra user chua dang nhap truy cap vao /class
describe("Test the class path", () => {
  test("It should response 200", async() => {
    const response = await request(app).get("/class/");
    expect(response.status).toBe(302); // redirect to login
  })
})