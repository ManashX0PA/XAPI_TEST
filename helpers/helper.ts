import supertest from "supertest";

import randomStr from 'randomstring';
const randomEmail = require('random-email');



// const rootURL = `https://empstag.x0pa.ai`;
const rootURL = `http://localhost:4580`;
const prefix = `/roboroy/api/v2`;

// let server = rootURL + prefix;
let server = `http://localhost:4580/roboroy/api/v2`
export const request = supertest(server);






/* ------------------------
.     HELPER FUNCTIONS
------------------------ */
export const randomNumber = (num: number) => {
  return Math.floor(Math.random() * num);
};

export function getRndInteger(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const getRandomEmail: () => string = () => {
  return randomEmail({ domain: 'random.com' });
}

export const getRandomCompany: () => string = () => {
  return `${randomStr.generate(5)} Random_Company`;
}

export const sleep = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};



/* ------------------------
.  HELPER HTTP FUNCTIONS
------------------------ */

export const getLoginToken = async (request: supertest.SuperTest<supertest.Test>, { email, password }: { email: string, password: string }) => {
  const res = await request.post('/login')
    .send({
      email: email,
      password: password,
    })
  const token = `Bearer ${res.body.token}`;

  return token;
}

export const getLoginData = async (request: supertest.SuperTest<supertest.Test>, { email, password }: { email: string, password: string }) => {
  const res = await request.post('/login')
    .send({
      email: email,
      password: password,
    })

  return res.body;
}

export const getAPIData = async (request: supertest.SuperTest<supertest.Test>, token: string, url: string) => {
  const res = await request.get(url)
    .set({ 'Authorization': token })

  return res.body;

}

export const postAPIData = async (request: supertest.SuperTest<supertest.Test>, token: string, url: string, data?: string | object) => {
  const res = await request.post(url)
    .set({ 'Authorization': token })
    .send(data)

  return res.body;

}

export const patchAPIData = async (request: supertest.SuperTest<supertest.Test>, token: string, url: string, data?: string | object) => {
  const res = await request.patch(url)
    .set({ 'Authorization': token })
    .send(data)

  return res.body;

}

export const deleteAPIData = async (request: supertest.SuperTest<supertest.Test>, token: string, url: string, data?: string | object) => {
  const res = await request.delete(url)
    .set({ 'Authorization': token })
    .send(data)

  return res.body;

}
