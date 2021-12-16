import jest from 'jest';
import supertest from 'supertest';
import Ajv from 'ajv';

import { deleteAPIData, getLoginToken, getRandomCompany, getRandomEmail, getRndInteger, patchAPIData, postAPIData, randomNumber } from '../helpers/helper';
import { CallTemplateSchema, ErrorSchema, NotLoggedInSchema, PersonMobileSchema } from '../schemas/responseSchemas';

import { request } from '../helpers/helper';
const ajv = new Ajv({ strict: false })



// TOKENS
import { LoginCreds } from '../creds/LoginCreds';
const token = LoginCreds.tokens;
const Data = LoginCreds.data;




describe.only('TESTING "personmobile.js" CONTROLLER', () => {


  describe('Get All Person Mobile Records API', () => {
    const rootUrl = `/personmobile/all`;
    const url = rootUrl + `/${Data.profileId}`;
    // positive testings
    it('get all person mobile records', async () => {
      const res = await request.get(url)
        .set({ 'Authorization': token.adminRecruiter1 })

      const schema = {
        type: "object",
        properties: {
          count: { type: "string" },
          personMobiles: {
            type: "array",
            items: PersonMobileSchema,
          },
        },
        required: ["personMobiles"],
        additionalProperties: false
      }
      expect([200, 201].includes(res.status)).toBe(true);
      expect(ajv.validate(schema, res.body)).toBe(true);
    })

    it('primary mobile always on top', async () => {
      const res = await request.get(url)
        .set({ 'Authorization': token.adminRecruiter1 })

      const schema = {
        type: "object",
        properties: {
          count: { type: "string" },
          personMobiles: {
            type: "array",
            items: PersonMobileSchema,
          },
        },
        required: ["personMobiles"],
        additionalProperties: false
      }
      expect([200, 201].includes(res.status)).toBe(true);
      expect(ajv.validate(schema, res.body)).toBe(true);
      expect(res.body.personMobiles[0].isPrimary).toBe(true);
    })

    // negative testing
    // it('can not use if not recruiter or candidate', async () => {
    //   const res = await request.get(url)
    //     .set({ 'Authorization': token.candidate1 })

    //   expect(ajv.validate(ErrorSchema, res.body)).toBe(true);
    //   expect(res.body.message).not.toBe('Error occurred while processing');
    //   expect(res.body.message.search(/You are not authorized/i)).not.toBe(-1);
    // })

    it('can not use if not logged in', async () => {
      const res = await request.get(url)
      expect(ajv.validate(NotLoggedInSchema, res.body)).toBe(true);
    })

  })



  describe('Create Person Mobile Record API', () => {
    const rootUrl = `/personmobile`;
    const url = rootUrl + `/${Data.profileId}`;

    let payload: { codeId: number, mobile: string };
    beforeEach(() => {
      payload = {
        codeId: 91,
        mobile: String(getRndInteger(1000000000, 9999999999)),
      }
    })

    // positive testings
    it('create person mobile record', async () => {
      const res = await request.post(url)
        .set({ 'Authorization': token.adminRecruiter1 })
        .send(payload)

      expect([200, 201].includes(res.status)).toBe(true);
      expect(ajv.validate(PersonMobileSchema, res.body)).toBe(true);

      // delete this new record
      await request.delete(rootUrl + `/${res.body.personMobId}`)
        .set({ 'Authorization': token.adminRecruiter1 })
    })

    // negative testing
    it('same mobile already exists for this profile', async () => {
      const res = await request.post(url)
        .set({ 'Authorization': token.adminRecruiter1 })
        .send({ codeId: 91, mobile: '9876543210' })

      expect(ajv.validate(ErrorSchema, res.body)).toBe(true);
      expect(res.body.message).not.toBe('Error occurred while processing');
      expect(res.body.message.search(/This mobile already exists for this profile/i)).not.toBe(-1);
    })

    it('isPrimary should be a boolean', async () => {
      const res = await request.post(url)
        .set({ 'Authorization': token.adminRecruiter1 })
        .send({ ...payload, isPrimary: "true" })

      expect(ajv.validate(ErrorSchema, res.body)).toBe(true);
      expect(res.body.message).not.toBe('Error occurred while processing');
      expect(res.body.message.search(/isPrimary should be a boolean value/i)).not.toBe(-1);
    })

    it('invalid payload', async () => {
      const res = await request.post(url)
        .set({ 'Authorization': token.adminRecruiter1 })
        .send({ ...payload, mobileNo: payload.mobile })

      expect(ajv.validate(ErrorSchema, res.body)).toBe(true);
      expect(res.body.message).not.toBe('Error occurred while processing');
      expect(res.body.message.search(/Invalid payload request/i)).not.toBe(-1);
    })

    // it('can not use if not recruiter or candidate', async () => {
    //   const res = await request.post(url)
    //     .set({ 'Authorization': token.candidate1 })
    //     .send(payload)

    //   expect(ajv.validate(ErrorSchema, res.body)).toBe(true);
    //   expect(res.body.message).not.toBe('Error occurred while processing');
    //   expect(res.body.message.search(/You are not authorized/i)).not.toBe(-1);
    // })

    it('codeId or mobile does not exist', async () => {
      const res = await request.post(url)
        .set({ 'Authorization': token.adminRecruiter1 })
        .send({ codeId: payload.codeId })

      expect(ajv.validate(ErrorSchema, res.body)).toBe(true);
      expect(res.body.message).not.toBe('Error occurred while processing');
      expect(res.body.message.search(/Please provide necessary details/i)).not.toBe(-1);
    })

    it('can not use if not logged in', async () => {
      const res = await request.post(url)
        .send(payload)

      expect(ajv.validate(NotLoggedInSchema, res.body)).toBe(true);
    })

  })



  describe('Update Person Mobile Record API', () => {
    const rootUrl = `/personmobile`;
    const url = rootUrl + `/${Data.personMobId}`;

    const payload = {
      codeId: 91,
    };

    // positive testings
    it('update person mobile record', async () => {
      const res = await request.patch(url)
        .set({ 'Authorization': token.adminRecruiter1 })
        .send(payload)

      expect([200, 201].includes(res.status)).toBe(true);
      expect(ajv.validate(PersonMobileSchema, res.body)).toBe(true);
    })

    // negative testing
    it('mobile record does not exist', async () => {
      const res = await request.patch(rootUrl + `/27000`)
        .set({ 'Authorization': token.adminRecruiter1 })
        .send(payload)

      expect(ajv.validate(ErrorSchema, res.body)).toBe(true);
      expect(res.body.message).not.toBe('Error occurred while processing');
      expect(res.body.message.search(/Mobile Record not found/i)).not.toBe(-1);
    })

    it('invalid update request', async () => {
      const res = await request.patch(url)
        .set({ 'Authorization': token.adminRecruiter1 })
        .send({ createdAt: new Date() })

      expect(ajv.validate(ErrorSchema, res.body)).toBe(true);
      expect(res.body.message).not.toBe('Error occurred while processing');
      expect(res.body.message.search(/Invalid update request/i)).not.toBe(-1);
    })

    it('same mobile already exists for this profile', async () => {
      const res = await request.patch(url)
        .set({ 'Authorization': token.adminRecruiter1 })
        .send({ mobile: '9876543210' })

      expect(ajv.validate(ErrorSchema, res.body)).toBe(true);
      expect(res.body.message).not.toBe('Error occurred while processing');
      expect(res.body.message.search(/This mobile already exists for this profile/i)).not.toBe(-1);
    })

    // it('if candidate and it is not his/her profile', async () => {
    //   const res = await request.patch(url)
    //     .set({ 'Authorization': token.adminRecruiter1 })
    //     .send({ createdAt: new Date() })

    //   expect(ajv.validate(ErrorSchema, res.body)).toBe(true);
    //   expect(res.body.message).not.toBe('Error occurred while processing');
    //   expect(res.body.message.search(/You are not authorized/i)).not.toBe(-1);
    // })

    // it('if recruiter and he does not have access', async () => {
    //   const res = await request.patch(url)
    //     .set({ 'Authorization': token.adminRecruiter1 })
    //     .send({ createdAt: new Date() })

    //   expect(ajv.validate(ErrorSchema, res.body)).toBe(true);
    //   expect(res.body.message).not.toBe('Error occurred while processing');
    //   expect(res.body.message.search(/You are not authorized/i)).not.toBe(-1);
    // })

    // it('can not use if not recruiter or candidate', async () => {
    //   const res = await request.patch(url)
    //     .set({ 'Authorization': token.recruiter1 })
    //     .send(payload)

    //   expect(ajv.validate(ErrorSchema, res.body)).toBe(true);
    //   expect(res.body.message).not.toBe('Error occurred while processing');
    //   expect(res.body.message.search(/You are not authorized/i)).not.toBe(-1);
    // })

    it('can not use if not logged in', async () => {
      const res = await request.patch(url)
        .send(payload)

      expect(ajv.validate(NotLoggedInSchema, res.body)).toBe(true);
    })

  })



  describe('Delete Person Mobile Record API', () => {
    const rootUrl = `/personmobile`;
    let personMobId;
    let url: string;

    beforeEach(async () => {
      const payload = {
        codeId: 91,
        mobile: String(getRndInteger(1000000000, 9999999999)),
      };

      const createdNewRecord = await postAPIData(request, token.adminRecruiter1, rootUrl + `/${Data.profileId}`, payload)
      personMobId = createdNewRecord.personMobId;
      url = rootUrl + `/${personMobId}`;
    })

    afterEach(async () => {
      // delete it
      await request.delete(url)
        .set({ 'Authorization': token.adminRecruiter1 })
    })

    // positive testings
    it('delete person mobile record', async () => {
      const res = await request.delete(url)
        .set({ 'Authorization': token.adminRecruiter1 })

      const schema = {
        type: "object",
        properties: {
          message: { type: "string" },
        },
        required: ["message"],
        additionalProperties: false,
      }
      expect([200, 201].includes(res.status)).toBe(true);
      expect(ajv.validate(schema, res.body)).toBe(true);
    })

    // negative testing
    it('mobile record does not exist', async () => {
      const res = await request.delete(rootUrl + `/27000`)
        .set({ 'Authorization': token.adminRecruiter1 })

      expect(ajv.validate(ErrorSchema, res.body)).toBe(true);
      expect(res.body.message).not.toBe('Error occurred while processing');
      expect(res.body.message.search(/Mobile Record not found/i)).not.toBe(-1);
    })

    // it('can not use if not recruiter or candidate', async () => {
    //   const res = await request.delete(url)
    //     .set({ 'Authorization': token.recruiter1 })

    //   expect(ajv.validate(ErrorSchema, res.body)).toBe(true);
    //   expect(res.body.message).not.toBe('Error occurred while processing');
    //   expect(res.body.message.search(/You are not authorized/i)).not.toBe(-1);

    // })

    it('can not use if not logged in', async () => {
      const res = await request.delete(url)
      expect(ajv.validate(NotLoggedInSchema, res.body)).toBe(true);
    })

  })

})