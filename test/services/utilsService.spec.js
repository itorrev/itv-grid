/**
 * Created by itorrev on 4/04/14.
 */
describe('utilsService', function(){
    beforeEach(module('itvUtilsService'));

    var UtilsService;
    beforeEach(inject(function(_UtilsService_){
        UtilsService = _UtilsService_;
    }));

    describe('create headers function', function(){
        var headers = ['header1', 'header2', 'header3', 'header4'];
        var headersObj = [['header1', '1'], ['header2', '2'], ['header3', {value: '3'}], ['header4', ['value4']]];
        var hide = ['header2'];
        var notEditable = ['header1'];
        var idField = 'header2';

        it('should return an array with 4 headers', function(){
            var response = UtilsService.createHeaders(headers, notEditable, hide, idField);
            expect(response.length).toBe(4);
        });

        it('should filter out header 3 and 4 since values are array and object', function(){
            var response = UtilsService.createHeaders(headersObj, notEditable, hide, idField);
            expect(response.length).toBe(2);
            expect(response[0].name).toEqual('header1');
            expect(response[1].name).toEqual('header2');
        });

        it('should return header1 is not editable', function(){
            var response = UtilsService.createHeaders(headers, notEditable, hide, idField);
            expect(response[0].isEditable).toBe(false);
            expect(response[1].isEditable).toBe(true);
            expect(response[2].isEditable).toBe(true);
            expect(response[3].isEditable).toBe(true);
        });

        it('should return header2 is not insertable', function(){
            var response = UtilsService.createHeaders(headers, notEditable, hide, idField);
            expect(response[0].isInsertable).toBe(true);
            expect(response[1].isInsertable).toBe(false);
            expect(response[2].isInsertable).toBe(true);
            expect(response[3].isInsertable).toBe(true);
        });

        it('should return header2 is hidden', function(){
            var response = UtilsService.createHeaders(headers, notEditable, hide, idField);
            expect(response[0].isHidden).toBe(false);
            expect(response[1].isHidden).toBe(true);
            expect(response[2].isHidden).toBe(false);
            expect(response[3].isHidden).toBe(false);
        })
    });

    describe('filter data function', function(){
        var data = [
            {"id": 1, "nombre": "Noel", "apellido": "Washington", "telefono": "(385) 371-9631", "email": "at@lobortis.co.uk", "pais": "Bahamas", "ciudad": "Colorado Springs"},
            {"id": 2, "nombre": "Rachel", "apellido": "Ferrell", "telefono": "(825) 917-1440", "email": "luctus@dapibusrutrum.co.uk", "pais": "Jan Mayen Islands", "ciudad": "Parchim\tCity"},
            {"id": 3, "nombre": "Kimberley", "apellido": "Clemons", "telefono": "(816) 948-3943", "email": "Nulla@pretiumetrutrum.com", "pais": "Thailand", "ciudad": "South Portland"},
            {"id": 6, "nombre": "September", "apellido": "Roy", "telefono": "(396) 162-0085", "email": "Nunc.mauris.elit@molestie.org", "pais": "Puerto Rico", "ciudad": "Robechies"},
            {"id": 7, "nombre": "Burton", "apellido": "Rosa", "telefono": "(504) 784-9962", "email": "velit.eget.laoreet@magna.co.uk", "pais": "Latvia", "ciudad": "Brampton"},
            {"id": 8, "nombre": "Nora", "apellido": "Hurst", "telefono": "(222) 501-5014", "email": "malesuada.malesuada@dolor.com", "pais": "Haiti", "ciudad": "Bielefeld"},
            {"id": 9, "nombre": "Leonard", "apellido": "Gay", "telefono": "(488) 124-5307", "email": "cursus@etmagnisdis.org", "pais": "Christmas Island", "ciudad": "Flint"},
            {"id": 10, "nombre": "Adele", "apellido": "Reyes", "telefono": "(134) 673-2406", "email": "feugiat@Suspendisse.edu", "pais": "Christmas Island", "ciudad": "Tewkesbury"},
            {"id": 11, "nombre": "Kiona", "apellido": "Montgomery", "telefono": "(293) 872-8778", "email": "amet.orci.Ut@Loremipsum.net", "pais": "Tonga", "ciudad": "Acciano"},
            {"id": 12, "nombre": "Raven", "apellido": "Salas", "telefono": "(564) 223-6733", "email": "ornare.libero.at@enim.edu", "pais": "Moldova", "ciudad": "Wallasey"},
            {"id": 13, "nombre": "Devin", "apellido": "Vinson", "telefono": "(131) 910-2362", "email": "dictum.magna@aliquet.com", "pais": "Malaysia", "ciudad": "Santa Cesarea Terme"},
            {"id": 14, "nombre": "Kai", "apellido": "Holloway", "telefono": "(668) 354-8781", "email": "porttitor.tellus.non@sitametmetus.net", "pais": "Denmark", "ciudad": "Dudzele"},
            {"id": 15, "nombre": "Emmanuel", "apellido": "Bernard", "telefono": "(295) 232-7215", "email": "Curabitur@semper.net", "pais": "Ethiopia", "ciudad": "Port Hope"},
            {"id": 16, "nombre": "Chantale", "apellido": "Merrill", "telefono": "(473) 774-4952", "email": "semper@euismodurna.ca", "pais": "Turks and Caicos Islands", "ciudad": "Marchienne-au-Pont"},
            {"id": 17, "nombre": "Duncan", "apellido": "Serrano", "telefono": "(878) 339-3829", "email": "facilisi.Sed@commodohendrerit.ca", "pais": "Montserrat", "ciudad": "Chattanooga"},
            {"id": 18, "nombre": "Laurel", "apellido": "Jones", "telefono": "(378) 662-7983", "email": "lectus.rutrum@aenimSuspendisse.com", "pais": "Czech Republic", "ciudad": "Wismar"},
            {"id": 19, "nombre": "Phoebe", "apellido": "Burnett", "telefono": "(517) 261-7420", "email": "Mauris@elitpellentesquea.ca", "pais": "Tanzania", "ciudad": "Montgomery"},
            {"id": 20, "nombre": "Mariko", "apellido": "Schroeder", "telefono": "(170) 681-8854", "email": "odio@Nullamscelerisque.edu", "pais": "Tuvalu", "ciudad": "Wandsworth"},
            {"id": 21, "nombre": "Rudyard", "apellido": "Gomez", "telefono": "(948) 721-1891", "email": "lorem.eget.mollis@non.ca", "pais": "Cayman Islands", "ciudad": "Motta Visconti"},
            {"id": 22, "nombre": "Madeline", "apellido": "Mcleod", "telefono": "(330) 179-8704", "email": "et@amagna.org", "pais": "Senegal", "ciudad": "Bocchigliero"},
            {"id": 23, "nombre": "Davis", "apellido": "Stuart", "telefono": "(574) 336-9943", "email": "Mauris.nulla@dictumProineget.ca", "pais": "Slovakia", "ciudad": "Barcelona"},
            {"id": 24, "nombre": "Liberty", "apellido": "Battle", "telefono": "(710) 604-0756", "email": "at.sem.molestie@ullamcorper.co.uk", "pais": "Bahrain", "ciudad": "Ravensburg"},
            {"id": 25, "nombre": "Gloria", "apellido": "Shelton", "telefono": "(737) 544-6515", "email": "nec@tellus.net", "pais": "Turks and Caicos Islands", "ciudad": "Drachten"},
            {"id": 26, "nombre": "Tallulah", "apellido": "Phelps", "telefono": "(585) 966-2919", "email": "ac@convallisincursus.net", "pais": "Denmark", "ciudad": "Portico e San Benedetto"},
            {"id": 27, "nombre": "Preston", "apellido": "Hunter", "telefono": "(272) 745-4231", "email": "Mauris.non@ante.ca", "pais": "Netherlands", "ciudad": "Aulnay-sous-Bois"},
            {"id": 28, "nombre": "Sylvester", "apellido": "Duffy", "telefono": "(958) 895-0166", "email": "sollicitudin@Nullamsuscipitest.co.uk", "pais": "Iran", "ciudad": "Civo"},
            {"id": 29, "nombre": "Valentine", "apellido": "Heath", "telefono": "(350) 887-1530", "email": "Donec.porttitor.tellus@temporestac.edu", "pais": "Colombia", "ciudad": "Parkland County"},
            {"id": 30, "nombre": "Shea", "apellido": "Conway", "telefono": "(724) 562-0371", "email": "placerat@tellus.ca", "pais": "Mauritius", "ciudad": "Castres"},
            {"id": 31, "nombre": "Geoffrey", "apellido": "Odonnell", "telefono": "(584) 504-0035", "email": "turpis.egestas@diameudolor.co.uk", "pais": "Lebanon", "ciudad": "Rangiora"},
            {"id": 32, "nombre": "Skyler", "apellido": "Castillo", "telefono": "(760) 334-3162", "email": "habitant@tristiquealiquet.org", "pais": "Tunisia", "ciudad": "Sluis"},
            {"id": 33, "nombre": "Daniel", "apellido": "Barry", "telefono": "(527) 240-9084", "email": "dictum@ligulaAenean.org", "pais": "Venezuela", "ciudad": "Sorradile"},
            {"id": 34, "nombre": "Shad", "apellido": "Newton", "telefono": "(280) 788-1306", "email": "tristique@duilectusrutrum.edu", "pais": "British Indian Ocean Territory", "ciudad": "Jamoigne"},
            {"id": 35, "nombre": "Cynthia", "apellido": "Dotson", "telefono": "(186) 158-7237", "email": "facilisis@luctus.edu", "pais": "Bahamas", "ciudad": "Nieuwmunster"},
            {"id": 36, "nombre": "Rinah", "apellido": "Daniels", "telefono": "(414) 735-3373", "email": "at.sem.molestie@elit.edu", "pais": "Bolivia", "ciudad": "Whitby"},
            {"id": 37, "nombre": "Evangeline", "apellido": "Ashley", "telefono": "(190) 419-5456", "email": "penatibus.et@idmagnaet.co.uk", "pais": "Mayotte", "ciudad": "Burg"},
            {"id": 38, "nombre": "Arden", "apellido": "Grimes", "telefono": "(514) 918-2841", "email": "Vivamus@etultricesposuere.edu", "pais": "Ghana", "ciudad": "Raymond"},
            {"id": 39, "nombre": "Brielle", "apellido": "Reese", "telefono": "(137) 667-2443", "email": "urna@vestibulumMaurismagna.ca", "pais": "Saint Kitts and Nevis", "ciudad": "Quarona"},
            {"id": 40, "nombre": "Wesley", "apellido": "Larsen", "telefono": "(920) 302-6872", "email": "ante.dictum.mi@arcuacorci.edu", "pais": "Sandwich Islands", "ciudad": "Koersel"},
            {"id": 41, "nombre": "Anne", "apellido": "Underwood", "telefono": "(183) 831-7288", "email": "erat@dolorsit.ca", "pais": "Guernsey", "ciudad": "Toledo"},
            {"id": 42, "nombre": "Piper", "apellido": "Sherman", "telefono": "(399) 881-7493", "email": "tincidunt@mollisInteger.org", "pais": "Botswana", "ciudad": "Albiano"},
            {"id": 43, "nombre": "Alfreda", "apellido": "Adkins", "telefono": "(348) 436-8272", "email": "mus.Aenean@diamluctus.edu", "pais": "Mexico", "ciudad": "Dampicourt"},
            {"id": 44, "nombre": "Curran", "apellido": "James", "telefono": "(555) 350-9929", "email": "Vestibulum.ante@variusorci.edu", "pais": "Montenegro", "ciudad": "HÃ©rouville-Saint-Clair"},
            {"id": 45, "nombre": "Jorden", "apellido": "Ford", "telefono": "(557) 892-0470", "email": "sit@Cum.com", "pais": "Slovakia", "ciudad": "Warburg"},
            {"id": 46, "nombre": "Stacy", "apellido": "West", "telefono": "(188) 610-5378", "email": "Integer.id@luctusvulputate.edu", "pais": "Mayotte", "ciudad": "Provo"},
            {"id": 47, "nombre": "Cyrus", "apellido": "England", "telefono": "(103) 109-6587", "email": "magna.Suspendisse@id.ca", "pais": "Gabon", "ciudad": "Lithgow"},
            {"id": 48, "nombre": "Uta", "apellido": "Norton", "telefono": "(437) 661-2638", "email": "imperdiet@Vivamusnisi.edu", "pais": "Myanmar", "ciudad": "Ulloa (Barrial)"},
            {"id": 49, "nombre": "Mohammad", "apellido": "Little", "telefono": "(654) 722-7768", "email": "pulvinar@tinciduntpedeac.edu", "pais": "Saint Pierre and Miquelon", "ciudad": "Oordegem"},
            {"id": 50, "nombre": "Belle", "apellido": "Lindsay", "telefono": "(179) 129-1191", "email": "sagittis@volutpat.org", "pais": "Jamaica", "ciudad": "Trevignano Romano"}
        ];

        it('should return the same data if empty string used', function(){
            var response = UtilsService.filterData('', data);
            expect(response).toEqual(data);
        });

        it('should return results of search string in any field of objects in data', function(){
            var response = UtilsService.filterData('tt', data);
            expect(response.length).toEqual(12);
        });

        it('should return results of search object matching only field specified', function(){
            var response = UtilsService.filterData({'apellido': 'tt'}, data);
            expect(response.length).toEqual(3);
        });

        it('should return result of search string through custom function only in not hidden properties', function(){
            var headers = [
                {'name': 'id', 'isHidden': false},
                {'name': 'nombre', 'isHidden': false},
                {'name': 'apellido', 'isHidden': false},
                {'name': 'telefono', 'isHidden': false},
                {'name': 'email', 'isHidden': true},
                {'name': 'pais', 'isHidden': false},
                {'name': 'ciudad', 'isHidden': false}
            ];
            var response = UtilsService.filterData(UtilsService.createCustomFilterFunction('tt', headers), data);
            expect(response.length).toBe(9);
        })
    });

    describe('getFirstLastTotalObject function', function(){
        var itemsPerPage, page, total;

        it('should return correct values', function(){
            itemsPerPage = 10;
            page = 2;
            total = 100;
            var result = UtilsService.getFirstLastTotalObject(page, total, itemsPerPage);
            expect(result).toEqual({'initIndex': 11, 'endIndex': 20, 'totalItems': 100});
        });

        it('should return correct values when last page not completed', function(){
            itemsPerPage = 10;
            page = 12;
            total = 112;
            var result = UtilsService.getFirstLastTotalObject(page, total, itemsPerPage);
            expect(result).toEqual({'initIndex': 111, 'endIndex': 112, 'totalItems': 112});
        });

        it('should return correct values when items per page is string', function(){
            itemsPerPage = '10';
            page = 1;
            total = 9;
            var result = UtilsService.getFirstLastTotalObject(page, total, itemsPerPage);
            expect(result).toEqual({'initIndex': 1, 'endIndex': 9, 'totalItems': 9});
        });

        it('should return correct values when total is zero', function(){
            itemsPerPage = 10;
            page = 1;
            total = 0;
            var result = UtilsService.getFirstLastTotalObject(page, total, itemsPerPage);
            expect(result).toEqual({'initIndex': 0, 'endIndex': 0, 'totalItems': 0});
        })
    });

    describe('getSpecificDataService function', function(){
        it('should create services with different configuration', function(){
            var configObj = {
                id: 'idObj1',
                url: 'http://url1.com/'
            };
            var instance1 = UtilsService.getSpecificDataService(configObj);

            configObj.id = 'idObj2';
            configObj.url = 'http://url2.com/';

            var instance2 = UtilsService.getSpecificDataService(configObj);

            expect(instance1.getUrl()).toEqual('http://url1.com/');
            expect(instance1.getIdField()).toEqual('idObj1');

            expect(instance2.getUrl()).toEqual('http://url2.com/');
            expect(instance2.getIdField()).toEqual('idObj2');
        })
    });

    describe('getStripIdOnUpdateTransformer function', function(){
        it('should return a function which strips specific field from object', function(){
            var fn = UtilsService.getStripIdOnUpdateTransformer();
            var data = {
                'id': 'id',
                'field1': 'value1',
                'field2': 'value2'
            };
            var responseObj = fn(data, 'id');
            expect(responseObj).toEqual({'field1': 'value1','field2': 'value2'});
        })
    })
});
