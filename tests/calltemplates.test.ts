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
const Data = LoginCreds.data;




describe.skip('TESTING "calltemplates.js" CONTROLLER', () => {


  describe('Get All Call Templates API', () => {
    const url = `/calltemplates/ct/all`;
    // positive testings
    it('get all call templates', async () => {
      const res = await request.get(url)
        .set({ 'Authorization': token.adminRecruiter1 })

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
      expect([200, 201].includes(res.status)).toBe(true);
      expect(ajv.validate(schema, res.body)).toBe(true);
    })

    it('search param working', async () => {
      const res = await request.get(url + `?search=something`)
        .set({ 'Authorization': token.adminRecruiter1 })
      expect(ajv.validate(ErrorSchema, res.body)).not.toBe(true);
      expect(res.body.message).not.toBe('Invalid');
      expect([200, 201].includes(res.status)).toBe(true);
    })

    it('limit param working', async () => {
      const res = await request.get(url + `?limit=27`)
        .set({ 'Authorization': token.adminRecruiter1 })
      expect(ajv.validate(ErrorSchema, res.body)).not.toBe(true);
      expect(res.body.message).not.toBe('Invalid');
      expect([200, 201].includes(res.status)).toBe(true);
    })

    it('offset param working', async () => {
      const res = await request.get(url + `?offset=5`)
        .set({ 'Authorization': token.adminRecruiter1 })
      expect(ajv.validate(ErrorSchema, res.body)).not.toBe(true);
      expect(res.body.message).not.toBe('Invalid');
      expect([200, 201].includes(res.status)).toBe(true);
    })

    it('sort param working', async () => {
      const res = await request.get(url + `?sort=template_name:desc`)
        .set({ 'Authorization': token.adminRecruiter1 })
      expect(ajv.validate(ErrorSchema, res.body)).not.toBe(true);
      expect(res.body.message).not.toBe('Invalid');
      expect([200, 201].includes(res.status)).toBe(true);
    })

    it('sort param without sort type working', async () => {
      const res = await request.get(url + `?sort=template_name`)
        .set({ 'Authorization': token.adminRecruiter1 })
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
        .set({ 'Authorization': token.adminRecruiter1 })
      expect(ajv.validate(ErrorSchema, res.body)).toBe(true);
      expect(res.body.message).not.toBe('Invalid');
    })

    it('offset is not a number', async () => {
      const res = await request.get(url + `?offset=1to100`)
        .set({ 'Authorization': token.adminRecruiter1 })
      expect(ajv.validate(ErrorSchema, res.body)).toBe(true);
      expect(res.body.message).not.toBe('Invalid');
    })

    it('limit is less than 0', async () => {
      const res = await request.get(url + `?limit=-1`)
        .set({ 'Authorization': token.adminRecruiter1 })
      expect(ajv.validate(ErrorSchema, res.body)).toBe(true);
      expect(res.body.message).not.toBe('Invalid');
    })

    it('limit is more than 100', async () => {
      const res = await request.get(url + `?limit=101`)
        .set({ 'Authorization': token.adminRecruiter1 })
      expect(ajv.validate(ErrorSchema, res.body)).toBe(true);
      expect(res.body.message).not.toBe('Invalid');
    })

    it('invalid sort request', async () => {
      const res = await request.get(url + `?sort=description:asc`)
        .set({ 'Authorization': token.adminRecruiter1 })
      expect(ajv.validate(ErrorSchema, res.body)).toBe(true);
      expect(res.body.message).not.toBe('Invalid');
    })

    it('invalid sort type request', async () => {
      const res = await request.get(url + `?sort=template_name:ascending`)
        .set({ 'Authorization': token.adminRecruiter1 })
      expect(ajv.validate(ErrorSchema, res.body)).toBe(true);
      expect(res.body.message).not.toBe('Invalid');
    })

    it('can not use if not logged in', async () => {
      const res = await request.get(url)
      expect(ajv.validate(NotLoggedInSchema, res.body)).toBe(true);
    })

  })



  describe('Get Call Template Details API', () => {
    const rootUrl = `/calltemplates`;
    const url = rootUrl + `/${Data.calltemplateId}`;
    // positive testings
    it('get call template details', async () => {
      const res = await request.get(url)
        .set({ 'Authorization': token.adminRecruiter1 })

      expect([200, 201].includes(res.status)).toBe(true);
      expect(ajv.validate(CallTemplateSchema, res.body)).toBe(true);
    })

    // negative testing
    it('template does not exist', async () => {
      const res = await request.get(rootUrl + `/27000`)
        .set({ 'Authorization': token.adminRecruiter1 })

      expect(ajv.validate(ErrorSchema, res.body)).toBe(true);
      expect(res.body.message).not.toBe('Invalid');
      expect(res.body.message.search(/No call template found/i)).not.toBe(-1);
    })

    it('can not use if not recruiter', async () => {
      const res = await request.get(url)
        .set({ 'Authorization': token.candidate1 })

      expect(ajv.validate(ErrorSchema, res.body)).toBe(true);
      expect(res.body.message).not.toBe('Invalid');
      expect(res.body.message.search(/You are not authorized/i)).not.toBe(-1);
    })

    it('can not use if not logged in', async () => {
      const res = await request.get(url)
      expect(ajv.validate(NotLoggedInSchema, res.body)).toBe(true);
    })

  })



  describe('Create Call Templates API', () => {
    const url = `/calltemplates`;
    const payload = {
      templateName: "Hired Call Template",
      templateBody: "Welcome aboard!",
      desc: "This template is for when applicants are hired.",
    };

    // positive testings
    it('create call templates', async () => {
      const res = await request.post(url)
        .set({ 'Authorization': token.adminRecruiter1 })
        .send(payload)

      expect([200, 201].includes(res.status)).toBe(true);
      expect(ajv.validate(CallTemplateSchema, res.body)).toBe(true);
    })

    // negative testing
    it('templateName or desc or templateBody does not exist', async () => {
      const res = await request.post(url)
        .set({ 'Authorization': token.adminRecruiter1 })
        .send({ templateName: payload.templateName })

      expect(ajv.validate(ErrorSchema, res.body)).toBe(true);
      expect(res.body.message).not.toBe('Invalid');
      expect(res.body.message.search(/Please provide necessary details/i)).not.toBe(-1);
    })

    // it('can not use if not admin recruiter', async () => {
    //   const res = await request.post(url)
    //     .set({ 'Authorization': token.recruiter1 })
    //   expect(ajv.validate(ErrorSchema, res.body)).toBe(true);
    //   expect(res.body.message).not.toBe('Invalid');
    //   expect(res.body.message.search(/You are not authorized/i)).not.toBe(-1);
    // })

    it('can not use if not recruiter', async () => {
      const res = await request.post(url)
        .set({ 'Authorization': token.candidate1 })
        .send(payload)

      expect(ajv.validate(ErrorSchema, res.body)).toBe(true);
      expect(res.body.message).not.toBe('Invalid');
      expect(res.body.message.search(/You are not authorized/i)).not.toBe(-1);
    })

    it('can not use if not logged in', async () => {
      const res = await request.post(url)
        .send(payload)

      expect(ajv.validate(NotLoggedInSchema, res.body)).toBe(true);
    })

  })



  describe('Update Call Templates API', () => {
    const rootUrl = `/calltemplates`;
    const url = rootUrl + `/${Data.calltemplateId}`;

    const payload = {
      templateName: "Hired Call Template",
      templateBody: "Welcome aboard!",
      desc: "This template is for when applicants are hired.",
    };

    // positive testings
    it('update call templates', async () => {
      const res = await request.patch(url)
        .set({ 'Authorization': token.adminRecruiter1 })
        .send(payload)

      expect([200, 201].includes(res.status)).toBe(true);
      expect(ajv.validate(CallTemplateSchema, res.body)).toBe(true);
    })

    // negative testing
    it('template does not exist', async () => {
      const res = await request.patch(rootUrl + `/27000`)
        .set({ 'Authorization': token.adminRecruiter1 })

      expect(ajv.validate(ErrorSchema, res.body)).toBe(true);
      expect(res.body.message).not.toBe('Invalid');
      expect(res.body.message.search(/No call template found/i)).not.toBe(-1);
    })

    it('invalid update request', async () => {
      const res = await request.patch(url)
        .set({ 'Authorization': token.adminRecruiter1 })
        .send({ createdAt: new Date() })

      expect(ajv.validate(ErrorSchema, res.body)).toBe(true);
      expect(res.body.message).not.toBe('Invalid');
      expect(res.body.message.search(/Invalid update request/i)).not.toBe(-1);
    })

    // it('can not use if not admin recruiter', async () => {
    //   const res = await request.patch(url)
    //     .set({ 'Authorization': token.recruiter1 })
    //     .send(payload)
    //   expect(ajv.validate(ErrorSchema, res.body)).toBe(true);
    //   expect(res.body.message).not.toBe('Invalid');
    //   expect(res.body.message.search(/You are not authorized/i)).not.toBe(-1);
    // })

    it('can not use if not recruiter', async () => {
      const res = await request.patch(url)
        .set({ 'Authorization': token.candidate1 })
        .send(payload)

      expect(ajv.validate(ErrorSchema, res.body)).toBe(true);
      expect(res.body.message).not.toBe('Invalid');
      expect(res.body.message.search(/You are not authorized/i)).not.toBe(-1);
    })

    it('can not use if not logged in', async () => {
      const res = await request.patch(url)
        .send(payload)

      expect(ajv.validate(NotLoggedInSchema, res.body)).toBe(true);
    })

  })



  describe('Delete Call Templates API', () => {
    const rootUrl = `/calltemplates`;
    let callTemplateId;
    let url: string;

    const payload = {
      templateName: "Hired Call Template",
      templateBody: "Welcome aboard!",
      desc: "This template is for when applicants are hired.",
    };

    beforeEach(async () => {
      const createdNewRecord = await postAPIData(request, token.adminRecruiter1, rootUrl, payload)
      callTemplateId = createdNewRecord.calltemplateId;
      url = rootUrl + `/${callTemplateId}`;
    })

    afterEach(async () => {
      // delete it
      await request.delete(url)
        .set({ 'Authorization': token.adminRecruiter1 })
    })

    // positive testings
    it('delete call templates', async () => {
      const res = await request.delete(url)
        .set({ 'Authorization': token.adminRecruiter1 })

      const schema = {
        type: "object",
        properties: {
          message: { type: "string"},
        },
        required: ["message"],
        additionalProperties: false,
      }
      expect([200, 201].includes(res.status)).toBe(true);
      expect(ajv.validate(schema, res.body)).toBe(true);
    })

    // negative testing
    it('template does not exist', async () => {
      const res = await request.delete(rootUrl + `/27000`)
        .set({ 'Authorization': token.adminRecruiter1 })

      expect(ajv.validate(ErrorSchema, res.body)).toBe(true);
      expect(res.body.message).not.toBe('Invalid');
      expect(res.body.message.search(/No call template found/i)).not.toBe(-1);
    })

    // it('can not use if not admin recruiter', async () => {
    //   const res = await request.delete(url)
    //     .set({ 'Authorization': token.recruiter1 })

    //   expect(ajv.validate(ErrorSchema, res.body)).toBe(true);
    //   expect(res.body.message).not.toBe('Invalid');
    //   expect(res.body.message.search(/You are not authorized/i)).not.toBe(-1);

    // })

    it('can not use if not recruiter', async () => {
      const res = await request.delete(url)
        .set({ 'Authorization': token.candidate1 })

      expect(ajv.validate(ErrorSchema, res.body)).toBe(true);
      expect(res.body.message).not.toBe('Invalid');
      expect(res.body.message.search(/You are not authorized/i)).not.toBe(-1);
    })

    it('can not use if not logged in', async () => {
      const res = await request.delete(url)
      expect(ajv.validate(NotLoggedInSchema, res.body)).toBe(true);
    })

  })

})