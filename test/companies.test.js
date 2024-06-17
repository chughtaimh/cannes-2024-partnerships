import { expect } from 'chai';
import request from 'supertest';
import app from '../src/app.js';
import db from '../src/database.js';

describe('Companies API', () => {
    let companyId;

    after((done) => {
        // Clean up the created company after tests
        db.run('DELETE FROM companies WHERE cid = ?', [companyId], done);
    });

    it('should create a new company', (done) => {
        request(app)
            .post('/company')
            .send({ name: 'Test Company' })
            .end((err, res) => {
                expect(res.status).to.equal(201);
                expect(res.body).to.have.property('cid');
                companyId = res.body.cid;
                done();
            });
    });

    it('should get all companies', (done) => {
        request(app)
            .get('/company')
            .end((err, res) => {
                expect(res.status).to.equal(200);
                expect(res.body).to.be.an('array');
                done();
            });
    });

    it('should get a specific company', (done) => {
        request(app)
            .get(`/company/${companyId}`)
            .end((err, res) => {
                expect(res.status).to.equal(200);
                expect(res.body).to.have.property('cid', companyId);
                done();
            });
    });

    it('should update a company', (done) => {
        request(app)
            .put(`/company/${companyId}`)
            .send({ name: 'Updated Company', views: 10, likes: 5 })
            .end((err, res) => {
                expect(res.status).to.equal(200);
                done();
            });
    });

    it('should increment company views', (done) => {
        request(app)
            .post(`/company/${companyId}/views`)
            .end((err, res) => {
                expect(res.status).to.equal(200);
                done();
            });
    });

    it('should increment company likes', (done) => {
        request(app)
            .post(`/company/${companyId}/likes`)
            .end((err, res) => {
                expect(res.status).to.equal(200);
                done();
            });
    });

    it('should delete a company', (done) => {
        request(app)
            .delete(`/company/${companyId}`)
            .end((err, res) => {
                expect(res.status).to.equal(200);
                done();
            });
    });
});
