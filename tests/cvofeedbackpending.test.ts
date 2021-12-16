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




describe.only('TESTING "cvofeedbackpending.js" CONTROLLER', () => {


  describe('Get All CVO Feedback Pending Records API', () => {
    const url = `/jobs/d/cvo-feedback-pending`;
    // positive testings
    it('get all cvo feedback pending records', async () => {
      const res = await request.get(url)
        .set({ 'Authorization': token.adminRecruiter1 })

      const headers = [
        {
          key: "appId",
          header: "App ID"
        },
        {
          key: "candidateName",
          header: "Candidate"
        },
        {
          key: "candidateEmail",
          header: "Candidate Email"
        },
        {
          key: "companyName",
          header: "Company Name"
        },
        {
          key: "recruiterName",
          header: "Recruiter"
        }
      ]
      const schema = {
        type: "object",
        properties: {
          id: { type: "string" },
          appId: { type: "string" },
          recruiterName: { type: "string" },
          jobName: { type: "string" },
          companyName: { type: "string" },
          candidateName: { type: "string" },
          candidateEmail: { type: "string" },
        },
        required: ["id", "appId", "recruiterName", "jobName", "companyName", "candidateName", "candidateEmail"],
        additionalProperties: true,
      }
      expect([200, 201].includes(res.status)).toBe(true);
      expect(ajv.validate(XapiDynamicResponseSchema, res.body)).toBe(true);
      expect(res.body.headers).toEqual(headers);
      expect(ajv.validate(schema, res.body.rows[0])).toBe(true);
    })

    // negative testing
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

})