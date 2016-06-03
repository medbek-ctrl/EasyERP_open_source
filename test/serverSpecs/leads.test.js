// require('../../config/development');

var request = require('supertest');
var expect = require('chai').expect;
var url = 'http://localhost:8089/';
var host = process.env.HOST;
var aggent;
var dbId = 'production';
var admin = {
    login: 'admin',
    pass : 'tm2016',
    dbId : dbId
};
var bannedUser = {
    login: 'ArturMyhalko',
    pass : 'thinkmobiles2015',
    dbId : dbId
};

describe('Leads Specs', function () {
    'use strict';
    var id;

    describe('Leads with admin', function () {

        before(function (done) {
            aggent = request.agent(url);

            aggent
                .post('users/login')
                .send(admin)
                .expect(200, done);
        });

        after(function (done) {
            aggent
                .get('logout')
                .expect(302, done);
        });

        it('should create lead', function (done) {
            var body = {
                name: 'Subject'
            };

            aggent
                .post('leads')
                .send(body)
                .expect(201)
                .end(function (err, res) {
                    var bodyRes = res.body;

                    if (err) {
                        return done(err);
                    }

                    expect(bodyRes)
                        .to.be.instanceOf(Object);
                    expect(bodyRes)
                        .to.have.property('success');

                    id = bodyRes.id;

                    done();
                });
        });

        it('should fail create Lead', function (done) {
            var body = {};

            aggent
                .post('leads')
                .send(body)
                .expect(404, done);
        });

        it('should get Leads Priority', function (done) {
            aggent
                .get('leads/priority')
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    expect(body)
                        .to.be.instanceOf(Object);
                    expect(body)
                        .to.have.property('data');
                    expect(body.data)
                        .to.be.instanceOf(Array);
                    done();
                });
        });

        it('should get Leads totalCollectionLength', function (done) {
            aggent
                .get('leads/totalCollectionLength')
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    expect(body)
                        .to.be.instanceOf(Object);
                    expect(body)
                        .to.have.property('count');
                    expect(body)
                        .to.have.property('showMore');
                    done();
                });
        });

        it('should get Lead For Chart', function (done) {
            aggent
                .get('leads/getLeadsForChart')
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    expect(body)
                        .to.be.instanceOf(Object);
                    expect(body)
                        .to.have.property('data');
                    done();
                });
        });

        it('should get Leads for viewType list', function (done) {

            var query = {
                viewType     : 'list',
                contentType  : 'Leads',
                page         : 1,
                count        : 100,
                newCollection: false
            };

            aggent
                .get('leads/')
                .query(query)
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;
                    var firstProject;

                    if (err) {
                        return done(err);
                    }

                    expect(body)
                        .to.be.instanceOf(Object);
                    expect(body)
                        .to.have.property('data');
                    expect(body)
                        .to.have.property('total');
                    expect(body.data)
                        .to.be.instanceOf(Array);

                    firstProject = body.data[1];

                    expect(firstProject)
                        .and.to.have.property('_id')
                        .and.to.have.lengthOf(24);
                    expect(firstProject)
                        .and.to.have.property('name')
                        .and.to.be.a('string');
                    expect(firstProject)
                        .and.to.have.property('contactName');
                    expect(firstProject)
                        .and.to.have.property('email');
                    expect(firstProject)
                        .and.to.have.property('phones')
                        .and.to.have.property('phone')
                        .and.not.to.have.property('mobile');
                    expect(firstProject)
                        .and.to.have.property('address');
                    expect(firstProject.address)
                        .and.to.have.property('country');
                    expect(firstProject.address)
                        .not.to.have.property('street');
                    expect(firstProject.address)
                        .not.to.have.property('state');
                    expect(firstProject.address)
                        .not.to.have.property('zip');
                    expect(firstProject.address)
                        .not.to.have.property('city');
                    expect(firstProject)
                        .to.have.property('workflow')
                        .and.to.have.property('_id');
                    expect(firstProject)
                        .to.have.property('workflow');
                    expect(firstProject.workflow)
                        .to.have.property('name');
                    expect(firstProject.workflow)
                        .to.have.property('status');
                    expect(firstProject.workflow.name)
                        .to.be.a('string');
                    expect(firstProject)
                        .and.to.have.property('campaign');
                    expect(firstProject)
                        .to.have.property('source');
                    expect(firstProject)
                        .and.to.have.property('salesPerson')
                        .and.to.have.property('name')
                        .and.to.have.property('first')
                        .and.to.be.a('string');
                    expect(firstProject)
                        .and.to.have.property('createdBy')
                        .and.to.have.property('date');
                    expect(firstProject)
                        .and.to.have.property('createdBy')
                        .and.to.have.property('user');
                    expect(firstProject)
                        .and.to.have.property('editedBy')
                        .and.to.have.property('date');
                    expect(firstProject)
                        .and.to.have.property('editedBy')
                        .and.to.have.property('user');

                    done();
                });
        });

        it('should get Lead for viewType form', function (done) {
            var query = {
                id      : id,
                viewType: 'form'
            };

            aggent
                .get('leads')
                .query(query)
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    expect(body)
                        .to.be.instanceOf(Object)
                        .and.to.have.property('_id');

                    done();
                });
        });

        /*        it('should get Lead for viewType kanban', function (done) {

         var query = {
         workflowId: '528ce5e3f3f67bc40b000018'
         };

         aggent
         .get('leads/kanban')
         .query(query)
         .expect(200)
         .end(function (err, res) {
         var body = res.body;

         if (err) {
         return done(err);
         }

         expect(body)
         .to.be.instanceOf(Object);
         expect(body)
         .to.have.property('data');
         expect(body)
         .to.have.property('workflowId');
         done();
         });
         });*/

        it('should partially update Lead', function (done) {
            var body = {
                name: 'test'
            };
            aggent
                .patch('leads/' + id)
                .send(body)
                .expect(200)
                .end(function (err, res) {
                    var bodyRes = res.body;

                    if (err) {
                        return done(err);
                    }

                    expect(bodyRes)
                        .to.be.instanceOf(Object);
                    expect(bodyRes)
                        .to.have.property('success');
                    expect(bodyRes)
                        .to.have.property('result');

                    done();
                });
        });

        it('should Lead update', function (done) {
            var body = {
                _id: id
            };
            aggent
                .put('leads/' + id)
                .send(body)
                .expect(200)
                .end(function (err, res) {
                    var bodyRes = res.body;

                    if (err) {
                        return done(err);
                    }

                    expect(bodyRes)
                        .to.be.instanceOf(Object);
                    expect(bodyRes)
                        .to.have.property('success');
                    expect(bodyRes)
                        .to.have.property('result');

                    done();
                });
        });

        it('should remove Lead', function (done) {
            aggent
                .delete('leads/' + id)
                .expect(200, done);
        });

    });

    describe('Leads with user without a license', function () {

        before(function (done) {
            aggent = request.agent(url);

            aggent
                .post('users/login')
                .send(bannedUser)
                .expect(200, done);
        });

        after(function (done) {
            aggent
                .get('logout')
                .expect(302, done);
        });

        it('should fail create Leads', function (done) {
            var body = {
                name: 'Subject'
            };

            aggent
                .post('leads')
                .send(body)
                .expect(403, done);
        });
    });
});