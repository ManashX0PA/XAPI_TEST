import jest from 'jest';
import supertest from 'supertest';
import Ajv from 'ajv';
import randomStr from 'randomstring';

import { deleteAPIData, getLoginToken, getRandomCompany, getRandomEmail, getRndInteger, patchAPIData, postAPIData, randomNumber } from '../helpers/helper';
import { CallTemplateSchema, ContactNoteLogSchema, ContactNoteSchema, ErrorSchema, NotLoggedInSchema, PersonMobileSchema, ProfileMetaSchema } from '../schemas/responseSchemas';

import { request } from '../helpers/helper';
const ajv = new Ajv({ strict: false })



// TOKENS
import { LoginCreds } from '../creds/LoginCreds';
const token = LoginCreds.tokens;
const Data = LoginCreds.data;




describe.only('TESTING "contactnotes.js" CONTROLLER', () => {


  describe('Get All Contact Note Logs API', () => {
    const url = `/contactnotes/all-logs`;
    // positive testings
    it('get all contact note logs', async () => {
      const res = await request.get(url)
        .set({ 'Authorization': token.adminRecruiter1 })

      console.log(res.body);
      const schema = {
        type: "object",
        properties: {
          logs: {
            type: "array",
            items: ContactNoteLogSchema,
          },
        },
        required: ["logs"],
        additionalProperties: false
      }
      expect([200, 201].includes(res.status)).toBe(true);
      expect(ajv.validate(schema, res.body)).toBe(true);
    })

    // negative testing
    it('can not use if not recruiter', async () => {
      const res = await request.get(url)
        .set({ 'Authorization': token.candidate1 })

      expect(ajv.validate(ErrorSchema, res.body)).toBe(true);
      expect(res.body.message).not.toBe('Error occurred while processing');
      expect(res.body.message.search(/You are not authorized/i)).not.toBe(-1);
    })

    it('can not use if not logged in', async () => {
      const res = await request.get(url)
      expect(ajv.validate(NotLoggedInSchema, res.body)).toBe(true);
    })

  })



  describe('Get All Contact Notes API', () => {
    const rootUrl = `/contactnotes/all`;
    const url = rootUrl + `/${Data.contactId}`;
    // positive testings
    it('get all contact notes', async () => {
      const res = await request.get(url)
        .set({ 'Authorization': token.adminRecruiter1 })

      const schema = {
        type: "object",
        properties: {
          count: { type: "string" },
          contactNotes: {
            type: "array",
            items: ContactNoteSchema,
          },
        },
        required: ["count", "contactNotes"],
        additionalProperties: false
      }
      expect([200, 201].includes(res.status)).toBe(true);
      expect(ajv.validate(schema, res.body)).toBe(true);
      expect(res.body.contactNotes.every((item:any)=> item.isDeleted)).toBe(false);
      expect(res.body.contactNotes.every((item:any)=> item.isPrivate)).toBe(false);
    })

    it('limit param working', async () => {
      const res = await request.get(url + `?limit=27`)
        .set({ 'Authorization': token.adminRecruiter1 })
      expect(ajv.validate(ErrorSchema, res.body)).not.toBe(true);
      expect(res.body.message).not.toBe('Error occurred while processing');
      expect([200, 201].includes(res.status)).toBe(true);
    })

    it('offset param working', async () => {
      const res = await request.get(url + `?offset=5`)
        .set({ 'Authorization': token.adminRecruiter1 })
      expect(ajv.validate(ErrorSchema, res.body)).not.toBe(true);
      expect(res.body.message).not.toBe('Error occurred while processing');
      expect([200, 201].includes(res.status)).toBe(true);
    })

    it('sort param working', async () => {
      const res = await request.get(url + `?sort=updated_at:desc`)
        .set({ 'Authorization': token.adminRecruiter1 })
      expect(ajv.validate(ErrorSchema, res.body)).not.toBe(true);
      expect(res.body.message).not.toBe('Error occurred while processing');
      expect([200, 201].includes(res.status)).toBe(true);
    })

    it('sort param without sort type working', async () => {
      const res = await request.get(url + `?sort=created_at`)
        .set({ 'Authorization': token.adminRecruiter1 })
      expect(ajv.validate(ErrorSchema, res.body)).not.toBe(true);
      expect(res.body.message).not.toBe('Error occurred while processing');
      expect([200, 201].includes(res.status)).toBe(true);
    })

    // negative testing
    it('can not use if not recruiter', async () => {
      const res = await request.get(url)
        .set({ 'Authorization': token.candidate1 })

      expect(ajv.validate(ErrorSchema, res.body)).toBe(true);
      expect(res.body.message).not.toBe('Error occurred while processing');
      expect(res.body.message.search(/You are not authorized/i)).not.toBe(-1);
    })

    it('limit is not a number', async () => {
      const res = await request.get(url + `?limit=1to100`)
        .set({ 'Authorization': token.adminRecruiter1 })
      expect(ajv.validate(ErrorSchema, res.body)).toBe(true);
      expect(res.body.message).not.toBe('Error occurred while processing');
    })

    it('offset is not a number', async () => {
      const res = await request.get(url + `?offset=1to100`)
        .set({ 'Authorization': token.adminRecruiter1 })
      expect(ajv.validate(ErrorSchema, res.body)).toBe(true);
      expect(res.body.message).not.toBe('Error occurred while processing');
    })

    it('limit is less than 0', async () => {
      const res = await request.get(url + `?limit=-1`)
        .set({ 'Authorization': token.adminRecruiter1 })
      expect(ajv.validate(ErrorSchema, res.body)).toBe(true);
      expect(res.body.message).not.toBe('Error occurred while processing');
    })

    it('limit is more than 100', async () => {
      const res = await request.get(url + `?limit=101`)
        .set({ 'Authorization': token.adminRecruiter1 })
      expect(ajv.validate(ErrorSchema, res.body)).toBe(true);
      expect(res.body.message).not.toBe('Error occurred while processing');
    })

    it('invalid sort request', async () => {
      const res = await request.get(url + `?sort=description:asc`)
        .set({ 'Authorization': token.adminRecruiter1 })
      expect(ajv.validate(ErrorSchema, res.body)).toBe(true);
      expect(res.body.message).not.toBe('Error occurred while processing');
    })

    it('invalid sort type request', async () => {
      const res = await request.get(url + `?sort=updated_at:ascending`)
        .set({ 'Authorization': token.adminRecruiter1 })
      expect(ajv.validate(ErrorSchema, res.body)).toBe(true);
      expect(res.body.message).not.toBe('Error occurred while processing');
    })

    it('can not use if not logged in', async () => {
      const res = await request.get(url)
      expect(ajv.validate(NotLoggedInSchema, res.body)).toBe(true);
    })

  })



  describe('Get Contact Note Details API', () => {
    const rootUrl = `/contactnotes`;
    const url = rootUrl + `/${Data.contactNoteId}`;
    // positive testings
    it('get contact note details', async () => {
      const res = await request.get(url)
        .set({ 'Authorization': token.adminRecruiter1 })

      expect([200, 201].includes(res.status)).toBe(true);
      expect(ajv.validate(ContactNoteSchema, res.body)).toBe(true);
    })

    // negative testing
    it('can not use if not recruiter', async () => {
      const res = await request.get(url)
        .set({ 'Authorization': token.candidate1 })

      expect(ajv.validate(ErrorSchema, res.body)).toBe(true);
      expect(res.body.message).not.toBe('Error occurred while processing');
      expect(res.body.message.search(/You are not authorized/i)).not.toBe(-1);
    })

    it('can not use if not logged in', async () => {
      const res = await request.get(url)
      expect(ajv.validate(NotLoggedInSchema, res.body)).toBe(true);
    })

  })



  describe('Create Contact Note API', () => {
    const rootUrl = `/contactnotes`;
    const url = rootUrl + `/${Data.contactId}`;

    const payload = { notesData: "We have an appointment at 4:00 GMT" };

    // positive testings
    it('create profile meta record', async () => {
      const res = await request.post(url)
        .set({ 'Authorization': token.adminRecruiter1 })
        .send(payload)

      expect([200, 201].includes(res.status)).toBe(true);
      expect(ajv.validate(ContactNoteSchema, res.body)).toBe(true);

      // delete this new record
      await request.delete(rootUrl + `/${res.body.noteId}`)
        .set({ 'Authorization': token.adminRecruiter1 })
    })

    // negative testing
    it('Contact record does not exist', async () => {
      const res = await request.post(rootUrl + `/27000`)
        .set({ 'Authorization': token.adminRecruiter1 })
        .send(payload)

      expect(ajv.validate(ErrorSchema, res.body)).toBe(true);
      expect(res.body.message).not.toBe('Error occurred while processing');
      expect(res.body.message.search(/Contact not found/i)).not.toBe(-1);
    })

    it('invalid payload', async () => {
      const res = await request.post(url)
        .set({ 'Authorization': token.adminRecruiter1 })
        .send({ ...payload, content: payload.notesData })

      expect(ajv.validate(ErrorSchema, res.body)).toBe(true);
      expect(res.body.message).not.toBe('Error occurred while processing');
      expect(res.body.message.search(/Invalid payload request/i)).not.toBe(-1);
    })

    it('can not use if not recruiter', async () => {
      const res = await request.post(url)
        .set({ 'Authorization': token.candidate1 })
        .send(payload)

      expect(ajv.validate(ErrorSchema, res.body)).toBe(true);
      expect(res.body.message).not.toBe('Error occurred while processing');
      expect(res.body.message.search(/You are not authorized/i)).not.toBe(-1);
    })

    it('notesData does not exist', async () => {
      const res = await request.post(url)
        .set({ 'Authorization': token.adminRecruiter1 })
        .send()

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



  describe('Update Contact Note API', () => {
    const rootUrl = `/contactnotes`;
    const url = rootUrl + `/${Data.contactNoteId}`;

    const payload = { notesData: "We have an appointment at 4:00 GMT" };

    // positive testings
    it('update contact note by creator', async () => {
      const res = await request.patch(url)
        .set({ 'Authorization': token.adminRecruiter1 })
        .send(payload)

      expect([200, 201].includes(res.status)).toBe(true);
      expect(ajv.validate(ContactNoteSchema, res.body)).toBe(true);
    })

    it('update contact note by admin recruiter', async () => {
      const res = await request.patch(url)
        .set({ 'Authorization': token.adminRecruiter2 })
        .send(payload)

      expect([200, 201].includes(res.status)).toBe(true);
      expect(ajv.validate(ContactNoteSchema, res.body)).toBe(true);
    })

    // negative testing
    it('contact note record does not exist', async () => {
      const res = await request.patch(rootUrl + `/27000`)
        .set({ 'Authorization': token.adminRecruiter1 })
        .send(payload)

      expect(ajv.validate(ErrorSchema, res.body)).toBe(true);
      expect(res.body.message).not.toBe('Error occurred while processing');
      expect(res.body.message.search(/Contact Note not found/i)).not.toBe(-1);
    })

    it('invalid update request', async () => {
      const res = await request.patch(url)
        .set({ 'Authorization': token.adminRecruiter1 })
        .send({ notesData: payload.notesData, createdAt: new Date() })

      expect(ajv.validate(ErrorSchema, res.body)).toBe(true);
      expect(res.body.message).not.toBe('Error occurred while processing');
      expect(res.body.message.search(/Invalid update request/i)).not.toBe(-1);
    })

    it('if not admin recruiter and also not the creator', async () => {
      const res = await request.patch(url)
        .set({ 'Authorization': token.recruiter1 })
        .send(payload)

      expect(ajv.validate(ErrorSchema, res.body)).toBe(true);
      expect(res.body.message).not.toBe('Error occurred while processing');
      expect(res.body.message.search(/You are not authorized/i)).not.toBe(-1);
    })

    it('can not use if not logged in', async () => {
      const res = await request.patch(url)
        .send(payload)

      expect(ajv.validate(NotLoggedInSchema, res.body)).toBe(true);
    })

  })



  describe('Delete Contact Note API', () => {
    const rootUrl = `/contactnotes`;
    let contactNoteId;
    let url: string;

    const payload = { notesData: "We have an appointment at 4:00 GMT" };
    beforeEach(async () => {

      const createdNewRecord = await postAPIData(request, token.adminRecruiter1, rootUrl + `/${Data.contactId}`, payload)
      contactNoteId = createdNewRecord.noteId;
      url = rootUrl + `/${contactNoteId}`;
    })

    afterEach(async () => {
      // delete it
      await request.delete(url)
        .set({ 'Authorization': token.adminRecruiter1 })
    })

    // positive testings
    it('delete contact note by creator', async () => {
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

    it('delete contact note by admin recruiter', async () => {
      const res = await request.delete(url)
        .set({ 'Authorization': token.adminRecruiter2 })

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
    it('contact note record does not exist', async () => {
      const res = await request.delete(rootUrl + `/27000`)
        .set({ 'Authorization': token.adminRecruiter1 })

      expect(ajv.validate(ErrorSchema, res.body)).toBe(true);
      expect(res.body.message).not.toBe('Error occurred while processing');
      expect(res.body.message.search(/Contact Note not found/i)).not.toBe(-1);
    })

    it('can not use if not admin recruiter and also not creator', async () => {
      const res = await request.delete(url)
        .set({ 'Authorization': token.recruiter1 })

      expect(ajv.validate(ErrorSchema, res.body)).toBe(true);
      expect(res.body.message).not.toBe('Error occurred while processing');
      expect(res.body.message.search(/You are not authorized/i)).not.toBe(-1);

    })

    it('can not use if not logged in', async () => {
      const res = await request.delete(url)
      expect(ajv.validate(NotLoggedInSchema, res.body)).toBe(true);
    })

  })

})