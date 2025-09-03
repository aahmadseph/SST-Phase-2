var deepExtend = require('utils/deepExtend');

describe('MergeDeep Scenarios', () => {
    describe('Merge Two', () => {
        it('should merge all arguments into the first one and return it', () => {
            const one = { one: 'one' };
            const two = { two: 'two' };

            const result = deepExtend(one, two);

            expect(result.one).toEqual('one');
            expect(result.two).toEqual('two');
        });
    });

    describe('Merge two into one', () => {
        it('should merge all arguments into the first one and return it', () => {
            const one = { one: 'one' };
            const two = {
                two: 'two',
                three: 'two'
            };
            const three = { three: 'three' };

            const result = deepExtend(one, two, three);

            expect(result.one).toEqual('one');
            expect(result.two).toEqual('two');
            expect(result.three).toEqual('three');
        });

        it('should merge all into one and leave the second unaltered', () => {
            const two = {
                eventData: {
                    eventInfo: {
                        attributes: {
                            eventStrings: 'scAdd',
                            eventName: 'Name2',
                            linkName: 'add to basket'
                        }
                    }
                }
            };

            const three = {
                eventData: {
                    eventInfo: {
                        attributes: {
                            eventStrings: 'scAdd',
                            eventName: 'Name3',
                            linkName: 'add to basket'
                        }
                    }
                }
            };

            const result = deepExtend({}, two, three);

            //two is unaltered
            expect(two.eventData.eventInfo.attributes.eventName).toEqual('Name2');

            expect(result.eventData.eventInfo.attributes.eventName).toEqual('Name3');
        });
    });
});

describe('deep-extend', function () {
    it('should ignore undefined', function () {
        var a = { hello: 1 };
        var b = undefined;
        deepExtend(a, b);
        expect(a).toEqual({ hello: 1 });
    });

    it('should ignore null', function () {
        var a = { hello: 1 };
        var b = null;
        deepExtend(a, b);
        expect(a).toEqual({ hello: 1 });
    });

    it('can extend on 1 level', function () {
        var a = { hello: 1 };
        var b = { world: 2 };
        deepExtend(a, b);
        expect(a).toEqual({
            hello: 1,
            world: 2
        });
    });

    it('can extend on 2 levels', function () {
        var a = { person: { name: 'John' } };
        var b = { person: { age: 30 } };
        deepExtend(a, b);
        expect(a).toEqual({
            person: {
                name: 'John',
                age: 30
            }
        });
    });

    it('Date objects', function () {
        var a = { d: new Date() };
        var b = deepExtend({}, a);
        expect(b.d instanceof Date).toBeTruthy();
    });

    it('Date object is cloned', function () {
        var a = { d: new Date() };
        var b = deepExtend({}, a);
        b.d.setTime(new Date().getTime() + 100000);
        expect(b.d.getTime()).not.toEqual(a.d.getTime());
    });

    it('RegExp objects', function () {
        var a = { d: new RegExp() };
        var b = deepExtend({}, a);
        expect(b.d instanceof RegExp).toBeTruthy();
    });

    it('RegExp object is cloned', function () {
        var a = { d: new RegExp('b', 'g') };
        var b = deepExtend({}, a);
        b.d.test('abc');
        expect(b.d.lastIndex).not.toEqual(a.d.lastIndex);
    });

    it('doesn\'t change sources', function () {
        var a = { a: [1] };
        var b = { a: [2] };
        var c = { c: 3 };

        expect(a).toEqual({ a: [1] });
        expect(b).toEqual({ a: [2] });
        expect(c).toEqual({ c: 3 });
    });

    it('example from README.md', function () {
        var obj1 = {
            a: 1,
            b: 2,
            d: {
                a: 1,
                b: [],
                c: {
                    test1: 123,
                    test2: 321
                }
            },
            f: 5,
            g: 123,
            i: 321,
            j: [1, 2]
        };
        var obj2 = {
            b: 3,
            c: 5,
            d: {
                b: {
                    first: 'one',
                    second: 'two'
                },
                c: { test2: 222 }
            },
            e: {
                one: 1,
                two: 2
            },
            f: [],
            g: undefined,
            h: /abc/g,
            i: null,
            j: [3, 4]
        };

        deepExtend(obj1, obj2);

        expect(obj1).toEqual({
            a: 1,
            b: 3,
            d: {
                a: 1,
                b: {
                    first: 'one',
                    second: 'two'
                },
                c: {
                    test1: 123,
                    test2: 222
                }
            },
            f: [],
            g: undefined,
            c: 5,
            e: {
                one: 1,
                two: 2
            },
            h: /abc/g,
            i: null,
            j: [3, 4]
        });

        expect('g' in obj1).toBeTruthy();
        expect('x' in obj1).toBeFalsy();
    });

    it('clone arrays instead of extend', function () {
        expect(deepExtend({ a: [1, 2, 3] }, { a: [2, 3] })).toEqual({ a: [2, 3] });
    });

    it('recursive clone objects and special objects in cloned arrays', function () {
        var date = new Date(1519337700356);
        var obj1 = {
            x: 1,
            y: { foo: 'bar' }
        };
        var b = { bar: 'bax' };
        var obj2 = {
            x: 1,
            y: [2, 4, obj1, b],
            z: date
        };
        var foo = { a: [obj2, obj2] };
        var bar = deepExtend({}, foo);
        bar.a[0].x = 2;
        bar.a[1].x = 3;
        bar.a[1].z = new Date(1519337765390);
        bar.a[0].y[0] = 3;
        bar.a[0].y[2].x = 5;
        bar.a[0].y[2].y['heh'] = 'heh';
        bar.a[0].y[3]['ho'] = 'ho';
        bar.a[1].y[1] = 3;
        bar.a[1].y[2].y['nah'] = 'nah';
        bar.a[1].y[3]['he'] = 'he';

        expect(obj2.x).toEqual(1);
        expect(obj2.z.getTime()).toEqual(date.getTime());
        expect(bar.a[0].x).toEqual(2);
        expect(bar.a[0].z.getTime()).toEqual(date.getTime());
        expect(bar.a[1].x).toEqual(3);
        expect(bar.a[1].z.getTime()).not.toEqual(date.getTime());
        expect(obj1.x).toEqual(1);
        expect(obj1.y['foo']).toEqual('bar');
        expect(b['bar']).toEqual('bax');

        expect(bar.a[0].y[0]).toEqual(3);
        expect(bar.a[0].y[1]).toEqual(4);
        expect(bar.a[0].y[2].x).toEqual(5);
        expect(bar.a[0].y[2].y['heh']).toEqual('heh');
        expect(bar.a[0].y[3]['ho']).toEqual('ho');

        expect(bar.a[1].y[0]).toEqual(2);
        expect(bar.a[1].y[1]).toEqual(3);
        expect(bar.a[1].y[2].x).toEqual(1);
        expect(bar.a[1].y[2].y['nah']).toEqual('nah');
        expect(bar.a[1].y[3]['her']).not.toEqual('her');

        expect(foo.a.length).toEqual(2);
        expect(bar.a.length).toEqual(2);
        expect(Object.keys(obj2)).toEqual(['x', 'y', 'z']);
        expect(Object.keys(bar.a[0])).toEqual(['x', 'y', 'z']);
        expect(Object.keys(bar.a[1])).toEqual(['x', 'y', 'z']);
        expect(obj2.y.length).toEqual(4);
        expect(bar.a[0].y.length).toEqual(4);
        expect(bar.a[1].y.length).toEqual(4);
        expect(Object.keys(obj2.y[2])).toEqual(['x', 'y']);
        expect(Object.keys(bar.a[0].y[2])).toEqual(['x', 'y']);
        expect(Object.keys(bar.a[1].y[2])).toEqual(['x', 'y']);
    });

    it('checking keys for hasOwnPrototype', function () {
        var A = function () {
            this.x = 1;
            this.y = 2;
        };
        A.prototype.z = 3;
        var foo = new A();
        expect(deepExtend({ x: 123 }, foo)).toEqual({
            x: 1,
            y: 2
        });
        foo.z = 5;
        expect(deepExtend({ x: 123 }, foo, { y: 22 })).toEqual({
            x: 1,
            y: 22,
            z: 5
        });
    });
});
