/**
 * Created by itorrev on 4/04/14.
 */
describe('dataResource', function(){
    beforeEach(module('itvDataResource'));

    var $httpBackend, DataResource, $rootScope;
    beforeEach(inject(function(_$httpBackend_, _DataResource_, _$rootScope_){
        $httpBackend = _$httpBackend_;
        DataResource = _DataResource_;
        $rootScope = _$rootScope_;
        DataResource.setUrl('http://test.com/tests/');
    }));

    describe('data service', function(){
        beforeEach(function(){
            $httpBackend.whenGET('http://test.com/tests/').respond([
                {
                    'id': '1',
                    'nombre': 'Ivan',
                    'apellido': 'Torre',
                    'ciudad': 'Cabanillas'
                },
                {
                    'id': '2',
                    'nombre': 'Mónica',
                    'apellido': 'Pisón',
                    'ciudad': 'Cabanillas'
                }
            ]);

            $httpBackend.whenGET('http://test.com/tests/1').respond({
                'id': '1',
                'nombre': 'Ivan',
                'apellido': 'Torre',
                'ciudad': 'Cabanillas'
            });

            $httpBackend.whenPOST('http://test.com/tests/', {
                'nombre': 'Aleksandr',
                'apellido': 'Kovacs',
                'ciudad': 'Rovinij'
            }).respond({
                'id': '3',
                'nombre': 'Aleksandr',
                'apellido': 'Kovacs',
                'ciudad': 'Rovinij'
            });

            $httpBackend.whenDELETE('http://test.com/tests/1').respond({});

            $httpBackend.whenPUT('http://test.com/tests/1', {
                'id': '1',
                'nombre': 'Ivan',
                'apellido': 'Torre',
                'ciudad': 'Cabanillas'
            }).respond({
                'id': '1',
                'nombre': 'Ivan',
                'apellido': 'Torre',
                'ciudad': 'Guadalajara'
            });

        });

        it('should retrieve an array of data', function(){
            var response;
            var promise = DataResource.query();
            promise.then(function(data){
                response = data;
            });
            $httpBackend.flush();
            expect(response.length).toBe(2);
            expect(response[0]['id']).toEqual('1');
            expect(response[1]['id']).toEqual('2');
        });

        it('should transform results into DataResource instances', function(){
            var response;
            var promise = DataResource.query();
            promise.then(function(data){
                response = data;
            });
            $httpBackend.flush();
            expect(response[0] instanceof DataResource).toBe(true);
        });

        it('should retrieve an object by id', function(){
            var response;
            var promise = DataResource.get('1');
            promise.then(function(data){
                response = data.data;
            });
            $httpBackend.flush();
            expect(response['nombre']).toEqual('Ivan');
        });

        it('should insert an element', function(){
            var insert = {
                'nombre': 'Aleksandr',
                'apellido': 'Kovacs',
                'ciudad': 'Rovinij'
            };

            var promise = DataResource.save(insert);
            var status, response;
            promise.then(function(data){
                response = data.data;
                status = data.status;
            });
            $httpBackend.flush();

            expect(status).toBe(200);
            expect(response.id).toEqual('3');
        });

        it('should remove an element', function(){
            var response, status;
            var promise = DataResource.query();
            promise.then(function(data){
                response = data;
            });
            $httpBackend.flush();

            var remove = response[0];
            promise = DataResource.remove(remove);
            promise.then(function(data){
                status = data.status;
            });
            $httpBackend.flush();

            expect(status).toBe(200);
        });

        it('should remove an element using own method', function(){
            var response, status;
            var promise = DataResource.query();
            promise.then(function(data){
                response = data;
            });
            $httpBackend.flush();

            var remove = response[0];
            promise = remove.$remove();
            promise.then(function(data){
                status = data.status;
            });
            $httpBackend.flush();

            expect(status).toBe(200);
        });

        it('should update an element', function(){
            var response;
            var promise = DataResource.query();
            promise.then(function(data){
                response = data;
            });
            $httpBackend.flush();

            var update = response[0];
            promise = DataResource.update(update);
            promise.then(function(data){
                response = data;
            });

            expect(update.ciudad).toEqual('Cabanillas');
            $httpBackend.flush();

            expect(response.ciudad).toEqual('Guadalajara');
        });

        it('should update an element using own method', function(){
            var response;
            var promise = DataResource.query();
            promise.then(function(data){
                response = data;
            });
            $httpBackend.flush();

            var update = response[0];
            promise = update.$update();
            promise.then(function(data){
                response = data;
            });

            expect(update.ciudad).toEqual('Cabanillas');
            $httpBackend.flush();

            expect(response.ciudad).toEqual('Guadalajara');
        })
    })
});
