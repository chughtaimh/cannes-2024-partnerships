const request = require('supertest');
const { expect } = require('chai');
const app = require('../src/app');
const db = require('../src/database');

describe('Partnerships API', () => {
    let partnershipId;
    let companyOneId;
    let companyTwoId;

    before((done) => {
        // Create two companies to use in partnership tests
        request(app)
            .post('/company')
            .send({ name: 'Company One' })
            .end((err, res) => {
                companyOneId = res.body.cid;
                request(app)
                    .post('/company')
                    .send({ name: 'Company Two' })
                    .end((err, res) => {
                        companyTwoId = res.body.cid;
                        done();
                    });
            });
    });

    after((done) => {
        // Clean up the created companies and partnership after tests
        db.run('DELETE FROM partnerships WHERE pid = ?', [partnershipId], () => {
            db.run('DELETE FROM companies WHERE cid IN (?, ?)', [companyOneId, companyTwoId], done);
        });
    });

    it('should create a new partnership', (done) => {
        request(app)
            .post('/partnership')
            .send({ company_one: companyOneId, company_two: companyTwoId, title: 'Test Partnership', desc: 'Description', link: 'http://example.com' })
            .end((err, res) => {
                expect(res.status).to.equal(201);
                expect(res.body).to.have.property('pid');
                partnershipId = res.body.pid;
                done();
            });
    });

    it('should get all partnerships', (done) => {
        request(app)
            .get('/partnership')
            .end((err, res) => {
                expect(res.status).to.equal(200);
                expect(res.body).to.be.an('array');
                done();
            });
    });

    it('should get a specific partnership', (done) => {
        request(app)
            .get(`/partnership/${partnershipId}`)
            .end((err, res) => {
                expect(res.status).to.equal(200);
                expect(res.body).to.have.property('pid', partnershipId);
                done();
            });
    });

    it('should update a partnership', (done) => {
        request(app)
            .put(`/partnership/${partnershipId}`)
            .send({ company_one: companyOneId, company_two: companyTwoId, title: 'Updated Partnership', desc: 'Updated Description', link: 'http://updatedlink.com', views: 10, likes: 5 })
            .end((err, res) => {
                expect(res.status).to.equal(200);
                done();
            });
    });

    it('should increment partnership views', (done) => {
        request(app)
            .post(`/partnership/${partnershipId}/views`)
            .end((err, res) => {
                expect(res.status).to.equal(200);
                done();
            });
    });

    it('should increment partnership likes', (done) => {
        request(app)
            .post(`/partnership/${partnershipId}/likes`)
            .end((err, res) => {
                expect(res.status).to.equal(200);
                done();
            });
    });

    it('should delete a partnership', (done) => {
        request(app)
            .delete(`/partnership/${partnershipId}`)
            .end((err, res) => {
                expect(res.status).to.equal(200);
                done();
            });
    });
});
