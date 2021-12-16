import jest from 'jest';
import supertest from 'supertest';
import Ajv from 'ajv';
import randomStr from 'randomstring';

import { deleteAPIData, getLoginToken, getRandomCompany, getRandomEmail, getRndInteger, patchAPIData, postAPIData, randomNumber } from '../helpers/helper';
import { CallTemplateSchema, ErrorSchema, NotLoggedInSchema, PersonMobileSchema, ProfileMetaSchema, XapiDynamicResponseSchema } from '../schemas/responseSchemas';

import { request } from '../helpers/helper';
const ajv = new Ajv({ strict: false })



// TOKENS
import { LoginCreds } from '../creds/LoginCreds';
const token = LoginCreds.tokens;
const Data = LoginCreds.data;




describe.only('TESTING "jobs.js" CONTROLLER', () => {


  describe('Get All Inactive Jobs API', () => {
    const url = `/jobs/d/no-activity`;
    const headers = [
      {
        key: "jobName",
        header: "Vacancy"
      },
      {
        key: "companyName",
        header: "Company Name"
      },
      {
        key: "recruiterName",
        header: "Recruiter"
      },
      {
        key: "actionDate",
        header: "Last Activity Date"
      },
      {
        key: "openDate",
        header: "Created Date"
      }
    ]
    const schema = {
      type: "object",
      properties: {
        id: { type: "string" },
        jobName: { type: "string" },
        companyName: { type: "string" },
        recruiterName: { type: "string" },
        actionDate: { type: "string" },
        openDate: { type: "string" },
      },
      required: ["id", "jobName", "companyName", "recruiterName", "actionDate", "openDate"],
      additionalProperties: true,
    }
    // positive testings
    it('get all leads follow up of today', async () => {
      const res = await request.get(url)
        .set({ 'Authorization': token.adminRecruiter1 })

      expect([200, 201].includes(res.status)).toBe(true);
      expect(ajv.validate(XapiDynamicResponseSchema, res.body)).toBe(true);
      expect(res.body.headers).toEqual(headers);
      expect(ajv.validate(schema, res.body.rows[0])).toBe(true);
    })

    it('inactivityPeriod param works', async () => {
      const res = await request.get(url + `?inactivityPeriod=7`)
        .set({ 'Authorization': token.adminRecruiter1 })

      expect([200, 201].includes(res.status)).toBe(true);
      expect(ajv.validate(XapiDynamicResponseSchema, res.body)).toBe(true);
      expect(res.body.headers).toEqual(headers);
      expect(ajv.validate(schema, res.body.rows[0])).toBe(true);
    })

    it('view param works', async () => {
      const res = await request.get(url + `?view=mine`)
        .set({ 'Authorization': token.adminRecruiter1 })

      expect([200, 201].includes(res.status)).toBe(true);
      expect(ajv.validate(XapiDynamicResponseSchema, res.body)).toBe(true);
      expect(res.body.headers).toEqual(headers);
      expect(ajv.validate(schema, res.body.rows[0])).toBe(true);
    })

    // negative testing
    it('invalid inactivityPeriod param', async () => {
      const res = await request.get(url + `?inactivityPeriod=1month`)
        .set({ 'Authorization': token.adminRecruiter1 })

      expect(ajv.validate(ErrorSchema, res.body)).toBe(true);
      expect(res.body.message).not.toBe('Error occurred while processing');
      expect(res.body.message.search(/inactivityPeriod param is invalid/i)).not.toBe(-1);
    })

    it('invalid view param', async () => {
      const res = await request.get(url + `?view=everything`)
        .set({ 'Authorization': token.adminRecruiter1 })

      expect(ajv.validate(ErrorSchema, res.body)).toBe(true);
      expect(res.body.message).not.toBe('Error occurred while processing');
      expect(res.body.message.search(/view param is invalid/i)).not.toBe(-1);
    })

    it('can not use if not recruiter', async () => {
      const res = await request.get(url)
        .set({ 'Authorization': token.candidate1 })

      expect(ajv.validate(ErrorSchema, res.body)).toBe(true);
      expect(res.body.message).not.toBe('Error occurred while processing');
      expect(res.body.message.search(/You are not authorized/i)).not.toBe(-1);
    })

    // it('can not use view=all if not admin recruiter', async () => {
    //   const res = await request.get(url)
    //     .set({ 'Authorization': token.adminRecruiter1 })

    //   expect(ajv.validate(ErrorSchema, res.body)).toBe(true);
    //   expect(res.body.message).not.toBe('Error occurred while processing');
    //   expect(res.body.message.search(/view param is invalid because this value is only applicable to admins/i)).not.toBe(-1);
    // })

    it('can not use if not logged in', async () => {
      const res = await request.get(url)
      expect(ajv.validate(NotLoggedInSchema, res.body)).toBe(true);
    })

  })

})