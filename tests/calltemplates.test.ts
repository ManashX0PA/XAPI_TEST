import jest from 'jest';
import supertest from 'supertest';
import Ajv from 'ajv';

import { deleteAPIData, getLoginToken, getRandomCompany, getRandomEmail, patchAPIData, postAPIData } from '../helpers/helper';
import { CallTemplateSchema, ErrorSchema, NotLoggedInSchema } from '../schemas/responseSchemas';

import { request } from '../helpers/helper';
const ajv = new Ajv({ strict: false })



// TOKENS
import { LoginCreds } from '../creds/LoginCreds';
const token = LoginCreds.tokens;





describe.only('TESTING "calltemplates.js" CONTROLLER', () => {


  describe('Get All Call Templates API', () => {
    const url = `/calltemplates/ct/all`;
    // positive testings
    it('get all call templates', async () => {
      const res = await request.get(url)
        .set({ 'Authorization': token.employer1 })

      const schema = {
        type: "object",
        properties: {
          count: { type: "string" },
          callTemplates: {
            type: "array",
            items: CallTemplateSchema,
          },
        },
        required: ["callTemplates"],
        additionalProperties: false
      }
      expect(ajv.validate(schema, res.body)).toBe(true);
    })

    it('search param working', async () => {
      const res = await request.get(url + `?search=something`)
        .set({ 'Authorization': token.employer1 })
      expect(ajv.validate(ErrorSchema, res.body)).not.toBe(true);
      expect(res.body.message).not.toBe('Invalid');
      expect([200, 201].includes(res.status)).toBe(true);
    })

    it('limit param working', async () => {
      const res = await request.get(url + `?limit=27`)
        .set({ 'Authorization': token.employer1 })
      expect(ajv.validate(ErrorSchema, res.body)).not.toBe(true);
      expect(res.body.message).not.toBe('Invalid');
      expect([200, 201].includes(res.status)).toBe(true);
    })

    it('offset param working', async () => {
      const res = await request.get(url + `?offset=5`)
        .set({ 'Authorization': token.employer1 })
      expect(ajv.validate(ErrorSchema, res.body)).not.toBe(true);
      expect(res.body.message).not.toBe('Invalid');
      expect([200, 201].includes(res.status)).toBe(true);
    })

    it('sort param working', async () => {
      const res = await request.get(url + `?sort=template_name:desc`)
        .set({ 'Authorization': token.employer1 })
      expect(ajv.validate(ErrorSchema, res.body)).not.toBe(true);
      expect(res.body.message).not.toBe('Invalid');
      expect([200, 201].includes(res.status)).toBe(true);
    })
    
    it('sort param without sort type working', async () => {
      const res = await request.get(url + `?sort=template_name`)
        .set({ 'Authorization': token.employer1 })
      expect(ajv.validate(ErrorSchema, res.body)).not.toBe(true);
      expect(res.body.message).not.toBe('Invalid');
      expect([200, 201].includes(res.status)).toBe(true);
    })

    // negative testing
    it('can not use if not recruiter', async () => {
      const res = await request.get(url)
        .set({ 'Authorization': token.candidate1 })
      expect(ajv.validate(ErrorSchema, res.body)).toBe(true);
      expect(res.body.message).not.toBe('Invalid');
      expect(res.body.message.search(/You are not authorized/i)).not.toBe(-1);
    })

    it('limit is not a number', async () => {
      const res = await request.get(url + `?limit=1to100`)
        .set({ 'Authorization': token.employer1 })
      expect(ajv.validate(ErrorSchema, res.body)).toBe(true);
      expect(res.body.message).not.toBe('Invalid');
    })

    it('offset is not a number', async () => {
      const res = await request.get(url + `?offset=1to100`)
        .set({ 'Authorization': token.employer1 })
      expect(ajv.validate(ErrorSchema, res.body)).toBe(true);
      expect(res.body.message).not.toBe('Invalid');
    })

    it('limit is less than 0', async () => {
      const res = await request.get(url + `?limit=-1`)
        .set({ 'Authorization': token.employer1 })
      expect(ajv.validate(ErrorSchema, res.body)).toBe(true);
      expect(res.body.message).not.toBe('Invalid');
    })

    it('limit is more than 100', async () => {
      const res = await request.get(url + `?limit=101`)
        .set({ 'Authorization': token.employer1 })
      expect(ajv.validate(ErrorSchema, res.body)).toBe(true);
      expect(res.body.message).not.toBe('Invalid');
    })

    it('invalid sort request', async () => {
      const res = await request.get(url + `?sort=description:asc`)
        .set({ 'Authorization': token.employer1 })
      expect(ajv.validate(ErrorSchema, res.body)).toBe(true);
      expect(res.body.message).not.toBe('Invalid');
    })

    it('invalid sort type request', async () => {
      const res = await request.get(url + `?sort=template_name:ascending`)
        .set({ 'Authorization': token.employer1 })
      expect(ajv.validate(ErrorSchema, res.body)).toBe(true);
      expect(res.body.message).not.toBe('Invalid');
    })

    it('can not use if not logged in', async () => {
      const res = await request.get(url)
      expect(ajv.validate(NotLoggedInSchema, res.body)).toBe(true);
    })

  })

})