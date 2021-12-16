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




describe.skip('TESTING "leads.js" CONTROLLER', () => {


  describe('Get All Leads Follow Up Of Today API', () => {
    const url = `/leads/l/all-follow-up-today`;
    // positive testings
    it('get all leads follow up of today', async () => {
      const res = await request.get(url)
        .set({ 'Authorization': token.adminRecruiter1 })

      const headers = [
        {
          key: "leadName",
          header: "Lead Name"
        },
        {
          key: "companyName",
          header: "Company Name"
        },
        {
          key: "dmName",
          header: "DM"
        },
        {
          key: "status",
          header: "Status"
        },
        {
          key: "createdAt",
          header: "Created Date"
        }
      ]
      expect([200, 201].includes(res.status)).toBe(true);
      expect(ajv.validate(XapiDynamicResponseSchema, res.body)).toBe(true);
      expect(res.body.headers).toEqual(headers);
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