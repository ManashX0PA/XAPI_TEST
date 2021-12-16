import jest from 'jest';
import supertest from 'supertest';
import Ajv from 'ajv';
import randomStr from 'randomstring';

import { deleteAPIData, getLoginToken, getRandomCompany, getRandomEmail, getRndInteger, patchAPIData, postAPIData, randomNumber } from '../helpers/helper';
import { CallTemplateSchema, ErrorSchema, NotLoggedInSchema, PersonMobileSchema, ProfileMetaSchema } from '../schemas/responseSchemas';

import { request } from '../helpers/helper';
const ajv = new Ajv({ strict: false })



// TOKENS
import { LoginCreds } from '../creds/LoginCreds';
const token = LoginCreds.tokens;
const Data = LoginCreds.data;




describe.skip('TESTING "profilemeta.js" CONTROLLER', () => {


  describe('Get All Profile Meta Records API', () => {
    const rootUrl = `/profilemeta/all`;
    const url = rootUrl + `/${Data.profileId}`;
    // positive testings
    it('get all profile meta records', async () => {
      const res = await request.get(url)
        .set({ 'Authorization': token.adminRecruiter1 })
      
      const schema = {
        type: "object",
        properties: {
          profileMeta: {
            type: "array",
            items: ProfileMetaSchema,
          },
        },
        required: ["profileMeta"],
        additionalProperties: false
      }
      expect([200, 201].includes(res.status)).toBe(true);
      expect(ajv.validate(schema, res.body)).toBe(true);
    })

    // negative testing
    // it('can not use if not recruiter or candidate', async () => {
    //   const res = await request.get(url)
    //     .set({ 'Authorization': token.candidate1 })

    //   expect(ajv.validate(ErrorSchema, res.body)).toBe(true);
    //   expect(res.body.message).not.toBe('Invalid');
    //   expect(res.body.message.search(/You are not authorized/i)).not.toBe(-1);
    // })

    it('can not use if not logged in', async () => {
      const res = await request.get(url)
      expect(ajv.validate(NotLoggedInSchema, res.body)).toBe(true);
    })

  })



  describe('Create Profile Meta Record API', () => {
    const rootUrl = `/profilemeta`;
    const url = rootUrl + `/${Data.profileId}`;

    let payload: { metaKey: string, metaValue: string };
    beforeEach(() => {
      payload = {
        metaKey: randomStr.generate(5),
        metaValue: randomStr.generate(5),
      }
    })

    // positive testings
    it('create profile meta record', async () => {
      const res = await request.post(url)
        .set({ 'Authorization': token.adminRecruiter1 })
        .send(payload)

      expect([200, 201].includes(res.status)).toBe(true);
      expect(ajv.validate(ProfileMetaSchema, res.body)).toBe(true);

      // delete this new record
      const finalRes = await request.delete(rootUrl + `/${res.body.profileMetaId}`)
        .set({ 'Authorization': token.adminRecruiter1 })
    })

    // negative testing
    it('same meteKey already exists for this profile', async () => {
      const res = await request.post(url)
        .set({ 'Authorization': token.adminRecruiter1 })
        .send({ metaKey: 'Aniversary Date', metaValue: 'April 1st' })

      expect(ajv.validate(ErrorSchema, res.body)).toBe(true);
      expect(res.body.message).not.toBe('Invalid');
      expect(res.body.message.search(/This metaKey already exists for this profile/i)).not.toBe(-1);
    })

    it('invalid payload', async () => {
      const res = await request.post(url)
        .set({ 'Authorization': token.adminRecruiter1 })
        .send({ ...payload, profileName: payload.metaKey })

      expect(ajv.validate(ErrorSchema, res.body)).toBe(true);
      expect(res.body.message).not.toBe('Invalid');
      expect(res.body.message.search(/Invalid payload request/i)).not.toBe(-1);
    })

    // it('can not use if not recruiter or candidate', async () => {
    //   const res = await request.post(url)
    //     .set({ 'Authorization': token.candidate1 })
    //     .send(payload)

    //   expect(ajv.validate(ErrorSchema, res.body)).toBe(true);
    //   expect(res.body.message).not.toBe('Invalid');
    //   expect(res.body.message.search(/You are not authorized/i)).not.toBe(-1);
    // })

    it('metaKey or metaValue does not exist', async () => {
      const res = await request.post(url)
        .set({ 'Authorization': token.adminRecruiter1 })
        .send({ metaValue: payload.metaValue })

      expect(ajv.validate(ErrorSchema, res.body)).toBe(true);
      expect(res.body.message).not.toBe('Invalid');
      expect(res.body.message.search(/Please provide necessary details/i)).not.toBe(-1);
    })

    it('can not use if not logged in', async () => {
      const res = await request.post(url)
        .send(payload)

      expect(ajv.validate(NotLoggedInSchema, res.body)).toBe(true);
    })

  })



  describe('Update Profile Meta Record API', () => {
    const rootUrl = `/profilemeta`;
    const url = rootUrl + `/${Data.profileMetaId}`;

    const payload = {
      metaValue: randomStr.generate(5),
    };

    // positive testings
    it('update profile meta record', async () => {
      const res = await request.patch(url)
        .set({ 'Authorization': token.adminRecruiter1 })
        .send(payload)

      expect([200, 201].includes(res.status)).toBe(true);
      expect(ajv.validate(ProfileMetaSchema, res.body)).toBe(true);
    })

    // negative testing
    it('profile meta record does not exist', async () => {
      const res = await request.patch(rootUrl + `/27000`)
        .set({ 'Authorization': token.adminRecruiter1 })
        .send(payload)

      expect(ajv.validate(ErrorSchema, res.body)).toBe(true);
      expect(res.body.message).not.toBe('Invalid');
      expect(res.body.message.search(/Profile meta record not found/i)).not.toBe(-1);
    })

    it('invalid update request', async () => {
      const res = await request.patch(url)
        .set({ 'Authorization': token.adminRecruiter1 })
        .send({ createdAt: new Date() })

      expect(ajv.validate(ErrorSchema, res.body)).toBe(true);
      expect(res.body.message).not.toBe('Invalid');
      expect(res.body.message.search(/Invalid update request/i)).not.toBe(-1);
    })

    it('same metaKey already exists for this profile', async () => {
      const res = await request.patch(url)
        .set({ 'Authorization': token.adminRecruiter1 })
        .send({ metaKey: 'Aniversary Date', metaValue: payload.metaValue })

      expect(ajv.validate(ErrorSchema, res.body)).toBe(true);
      expect(res.body.message).not.toBe('Invalid');
      expect(res.body.message.search(/Another metaKey with this name already exists for this profile/i)).not.toBe(-1);
    })

    // it('if candidate and it is not his/her profile', async () => {
    //   const res = await request.patch(url)
    //     .set({ 'Authorization': token.adminRecruiter1 })
    //     .send({ createdAt: new Date() })

    //   expect(ajv.validate(ErrorSchema, res.body)).toBe(true);
    //   expect(res.body.message).not.toBe('Invalid');
    //   expect(res.body.message.search(/You are not authorized/i)).not.toBe(-1);
    // })

    // it('if recruiter and he does not have access', async () => {
    //   const res = await request.patch(url)
    //     .set({ 'Authorization': token.adminRecruiter1 })
    //     .send({ createdAt: new Date() })

    //   expect(ajv.validate(ErrorSchema, res.body)).toBe(true);
    //   expect(res.body.message).not.toBe('Invalid');
    //   expect(res.body.message.search(/You are not authorized/i)).not.toBe(-1);
    // })

    // it('can not use if not recruiter or candidate', async () => {
    //   const res = await request.patch(url)
    //     .set({ 'Authorization': token.recruiter1 })
    //     .send(payload)

    //   expect(ajv.validate(ErrorSchema, res.body)).toBe(true);
    //   expect(res.body.message).not.toBe('Invalid');
    //   expect(res.body.message.search(/You are not authorized/i)).not.toBe(-1);
    // })

    it('can not use if not logged in', async () => {
      const res = await request.patch(url)
        .send(payload)

      expect(ajv.validate(NotLoggedInSchema, res.body)).toBe(true);
    })

  })



  describe('Delete Profile Meta Record API', () => {
    const rootUrl = `/profilemeta`;
    let profileMetaId;
    let url: string;

    beforeEach(async () => {
      const payload = {
        metaKey: randomStr.generate(5),
        metaValue: randomStr.generate(5),
      };

      const createdNewRecord = await postAPIData(request, token.adminRecruiter1, rootUrl + `/${Data.profileId}`, payload)
      profileMetaId = createdNewRecord.profileMetaId;
      url = rootUrl + `/${profileMetaId}`;
    })

    afterEach(async () => {
      // delete it
      await request.delete(url)
        .set({ 'Authorization': token.adminRecruiter1 })
    })

    // positive testings
    it('delete profilemeta record', async () => {
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
    it('profile meta record does not exist', async () => {
      const res = await request.delete(rootUrl + `/27000`)
        .set({ 'Authorization': token.adminRecruiter1 })

      expect(ajv.validate(ErrorSchema, res.body)).toBe(true);
      expect(res.body.message).not.toBe('Invalid');
      expect(res.body.message.search(/Profile meta record not found/i)).not.toBe(-1);
    })

    // it('can not use if not recruiter or candidate', async () => {
    //   const res = await request.delete(url)
    //     .set({ 'Authorization': token.recruiter1 })

    //   expect(ajv.validate(ErrorSchema, res.body)).toBe(true);
    //   expect(res.body.message).not.toBe('Invalid');
    //   expect(res.body.message.search(/You are not authorized/i)).not.toBe(-1);

    // })

    it('can not use if not logged in', async () => {
      const res = await request.delete(url)
      expect(ajv.validate(NotLoggedInSchema, res.body)).toBe(true);
    })

  })

})