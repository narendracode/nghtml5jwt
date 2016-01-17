var superagent = require('superagent');
var assert = require('assert');
var expect = require('expect.js');
var jsdom = require('mocha-jsdom');
var authController = require('../app/authorization/controllers/AuthController.js');
describe('Array', function() {
    describe('#indexOf()', function () {
        it('should return -1 when the value is not present', function () {
            assert.equal(-1, [1,2,3].indexOf(5));
            assert.equal(-1, [1,2,3].indexOf(0));
        });
    });
});



describe('Express rest API test', function() {
    jsdom();
    var user;
    var token;
    var signupUrl = 'http://localhost:3000/auth/signup';
    var loginUrl = 'http://localhost:3000/auth/login';
    var logoutUrl = 'http://localhost:3000/auth/logout';
    var testBaseUrl = 'http://localhost:3000/auth/test';
    
    function urlBase64Decode(str) {
        var output = str.replace('-', '+').replace('_', '/');
        switch (output.length % 4) {
            case 0:
                break;
            case 2:
                output += '==';
                break;
            case 3:
                output += '=';
                break;
            default:
                throw 'Illegal base64url string!';
        }
        return window.atob(output);
    }

    function parseToken(token){
        var user = {};
        if(token){
            var encoded = token.split('.')[1];
            user = JSON.parse(urlBase64Decode(encoded));
        }
        return user;  
    }
    
    
    
    
    describe('TEST', function () {
        
        it('should return -1 when the value is not present', function () {
            assert.equal(-1, [1,2,3].indexOf(5));
            assert.equal(-1, [1,2,3].indexOf(0));
            expect('H').to.eql('H');
        });
        
        
           it('#SIGNUP', function (done) {
            superagent.post(signupUrl)
                .send({
                    email : 'test@test.com',
                    password : 'testPassword',
                    name : 'tester'
                })
                .end(function(e,res){
                    expect(e).to.eql(null);
                    expect(res.body.type).to.eql(true);
                    token = res.body.token;
                    user = parseToken(token);
                    expect(user.email).to.eql('test@test.com');
                    expect(user.role).to.eql('user');
                    expect(user.name).to.eql('tester');
                    done();
                })
        });
        
        it('#LOGIN', function (done) {
            superagent
                .post(loginUrl)
                .send({
                    email : 'test@test.com',
                    password : 'testPassword'
                })
                .end(function(e,res){
                expect(e).to.eql(null);
                expect(res.body.type).to.eql(true);
                token = res.body.token;
                user = parseToken(token);
                expect(user.email).to.eql('test@test.com');
                expect(user.role).to.eql('user');
                expect(user.name).to.eql('tester');
                done();
            })
        });
        
        
        it('#DELETE USER', function (done) {
            superagent
                .del(signupUrl)
                .send({
                email : 'test@test.com'
            })
                .end(function(e,res){
                expect(e).to.eql(null);
                expect(res.body.type).to.eql(true);
                expect(res.body.data).to.eql('user deleted successfully with email test@test.com');
                done();
            })
        });
        
       it('#TEST-POST', function (done) {
            superagent
                .post(testBaseUrl)
                .send({
                    
                    })
                .set('Authorization', 'bearer '+token)
                .end(function(e,res){
                expect(e).to.eql(null);
               // console.log(" POST RES Body : "+JSON.stringify(res.body));
                expect(res.body.msg).to.eql("response form test post");
                done();
            })
        });
        
        it('#TEST-GET', function (done) {
            superagent
                .get(testBaseUrl)
                .send({

                })
                .set('Authorization', 'bearer '+token)
                .end(function(e,res){
                expect(e).to.eql(null);
                
                expect(res.body.email).to.eql("test@test.com");
                expect(res.body.role).to.eql("user");
                expect(res.body.name).to.eql("tester");
                expect(res.body.msg).to.eql("Response appended from Server");
                //console.log(" GET RES Body : "+JSON.stringify(res.body));
                

                //Response appended from Server
                done();
            })
        });
        
        
        
    });
});



